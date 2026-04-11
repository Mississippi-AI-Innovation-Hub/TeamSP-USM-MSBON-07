"""Lambda handler for extracting structured data from nursing school transcript PDFs.

Part of the MSBON Fraud-Sensitive Transcript Verification system.
Uses Amazon Textract for OCR and Amazon Bedrock (Nova Lite) for structured parsing.
"""

import json
import logging
import sys
from datetime import datetime

import boto3

# Lambda layer shared modules
sys.path.insert(0, "/opt")
from models import AuditEntry
import db
import s3_utils
from bedrock_client import invoke_nova_json, NOVA_LITE

logger = logging.getLogger()
logger.setLevel(logging.INFO)

_textract = boto3.client("textract", region_name="us-east-1")

EXTRACTION_SCHEMA = {
    "student_id": "string",
    "institutions": ["list of institution names"],
    "program_name": "string",
    "program_type": "one of: ADN, BSN, MSN, LPN",
    "courses": [
        {
            "name": "string",
            "number": "string",
            "credits": "number",
            "grade": "string",
            "term": "string",
        }
    ],
    "transfer_credits": [
        {
            "institution": "string",
            "courses": [
                {
                    "name": "string",
                    "number": "string",
                    "credits": "number",
                    "grade": "string",
                }
            ],
        }
    ],
    "degree_conferral": "string or null",
    "graduation_date": "string (YYYY-MM-DD) or null",
    "graduation_confirmed": "boolean",
    "gpa_info": {
        "cumulative": "number or null",
        "program": "number or null",
        "by_term": [{"term": "string", "gpa": "number"}],
    },
    "total_credit_hours": "number",
    "enrollment_terms": ["list of term strings, e.g. 'Fall 2023'"],
}

SYSTEM_PROMPT = (
    "You are a data extraction assistant for a nursing board transcript verification system. "
    "Your job is to parse raw OCR text from nursing school transcripts and return structured JSON. "
    "Be precise and faithful to the source text. Do not invent data that is not present. "
    "If a field cannot be determined from the text, use null for optional fields or empty "
    "lists/strings for required fields. Return ONLY valid JSON, no commentary."
)

USER_PROMPT_TEMPLATE = """Extract structured data from the following nursing school transcript text.

Return a JSON object matching this exact schema:
{schema}

Important instructions:
- program_type must be one of: ADN, BSN, MSN, LPN. If unclear, use the best match or empty string.
- graduation_confirmed should be true only if the transcript explicitly states the degree was conferred/awarded.
- For courses, extract every course listed with as much detail as available.
- For transfer_credits, group courses by their originating institution.
- For gpa_info, extract cumulative GPA, program-specific GPA, and per-term GPA if available.
- Dates should be in YYYY-MM-DD format when possible.
- If the transcript spans multiple institutions, list all in the institutions array.

Transcript text:
{raw_text}"""


def _extract_text_with_textract(pdf_bytes: bytes, s3_key: str) -> tuple[str, int]:
    """Extract text from a PDF using Textract async API via S3 reference.

    Uses start_document_text_detection (async) so multi-page PDFs and
    documents over 5MB are fully supported. Polls until the job completes
    or the Lambda timeout approaches.
    """
    import time

    bucket = s3_utils.get_bucket_name()

    # Start async job referencing the file already in S3
    response = _textract.start_document_text_detection(
        DocumentLocation={"S3Object": {"Bucket": bucket, "Name": s3_key}}
    )
    job_id = response["JobId"]
    logger.info("Textract job started: %s", job_id)

    # Poll until complete (max 240s, staying within the 300s Lambda timeout)
    deadline = time.time() + 240
    while time.time() < deadline:
        result = _textract.get_document_text_detection(JobId=job_id)
        status = result["JobStatus"]
        if status == "SUCCEEDED":
            break
        if status == "FAILED":
            raise RuntimeError(f"Textract job failed: {result.get('StatusMessage', 'unknown')}")
        time.sleep(5)
    else:
        raise TimeoutError("Textract job did not complete within 240 seconds")

    # Collect all pages (Textract paginates results)
    blocks = list(result.get("Blocks", []))
    next_token = result.get("NextToken")
    while next_token:
        page_result = _textract.get_document_text_detection(JobId=job_id, NextToken=next_token)
        blocks.extend(page_result.get("Blocks", []))
        next_token = page_result.get("NextToken")

    lines = [b["Text"] for b in blocks if b["BlockType"] == "LINE"]
    page_count = sum(1 for b in blocks if b["BlockType"] == "PAGE")

    return "\n".join(lines), max(page_count, 1)


def _parse_with_bedrock(raw_text: str) -> dict:
    """Send raw transcript text to Nova Lite for structured extraction.

    Input is capped at 12,000 characters to ensure the model has enough
    output token budget to complete the JSON response.
    """
    # Nova Lite output limit is ~5K tokens; keep input small so JSON output fits cleanly
    MAX_INPUT_CHARS = 6_000
    if len(raw_text) > MAX_INPUT_CHARS:
        raw_text = raw_text[:MAX_INPUT_CHARS] + "\n[... truncated for extraction ...]"

    schema_str = json.dumps(EXTRACTION_SCHEMA, indent=2)
    prompt = USER_PROMPT_TEMPLATE.format(schema=schema_str, raw_text=raw_text)

    extracted = invoke_nova_json(
        prompt=prompt,
        system_prompt=SYSTEM_PROMPT,
        model_id=NOVA_LITE,
        max_tokens=5000,
        temperature=0.0,
    )

    return extracted


def handler(event, context):
    """Lambda entry point. Invoked by Step Functions.

    Expected event:
        {
            "transcriptId": "uuid-string",
            "s3Key": "uploads/uuid-string.pdf"
        }

    Returns:
        {
            "transcriptId": "uuid-string",
            "extractedDataKey": "extracted/uuid-string.json"
        }
    """
    transcript_id = event["transcriptId"]
    s3_key = event["s3Key"]

    logger.info("Starting extraction for transcript %s from %s", transcript_id, s3_key)

    try:
        # Update status to EXTRACTING
        db.update_transcript_status(transcript_id, "EXTRACTING")

        # Step 1: Extract raw text via Textract (reads directly from S3)
        logger.info("Running Textract async OCR on s3_key: %s", s3_key)
        raw_text, page_count = _extract_text_with_textract(None, s3_key)
        logger.info("Textract extracted %d characters across %d page(s)", len(raw_text), page_count)

        if not raw_text.strip():
            raise ValueError("Textract returned no text from the PDF. The document may be image-only or corrupt.")

        # Step 3: Parse raw text into structured JSON via Bedrock
        logger.info("Sending text to Bedrock Nova Lite for structured extraction")
        extracted_data = _parse_with_bedrock(raw_text)

        # Attach raw text and page count to the extracted data
        extracted_data["raw_text"] = raw_text
        extracted_data["page_count"] = page_count

        # Step 4: Save extracted data to S3
        extracted_data_key = s3_utils.save_extracted_data(transcript_id, extracted_data)
        logger.info("Saved extracted data to %s", extracted_data_key)

        # Step 5: Update transcript status in DynamoDB
        db.update_transcript_status(
            transcript_id,
            "EXTRACTED",
            extractedDataKey=extracted_data_key,
        )

        # Step 6: Log audit entry
        audit = AuditEntry(
            transcript_id=transcript_id,
            actor="system",
            action="EXTRACTION_COMPLETE",
            details={
                "page_count": page_count,
                "text_length": len(raw_text),
                "courses_found": len(extracted_data.get("courses", [])),
                "institutions_found": len(extracted_data.get("institutions", [])),
                "extracted_data_key": extracted_data_key,
            },
        )
        db.put_audit_entry(audit.to_dynamo())

        logger.info("Extraction complete for transcript %s", transcript_id)

        return {
            "transcriptId": transcript_id,
            "extractedDataKey": extracted_data_key,
        }

    except Exception as e:
        logger.exception("Extraction failed for transcript %s: %s", transcript_id, str(e))

        # Update status to reflect failure
        db.update_transcript_status(transcript_id, "EXTRACTION_FAILED")

        # Log failure audit entry
        audit = AuditEntry(
            transcript_id=transcript_id,
            actor="system",
            action="EXTRACTION_FAILED",
            details={"error": str(e)},
        )
        db.put_audit_entry(audit.to_dynamo())

        raise
