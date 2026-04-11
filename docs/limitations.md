# Limitations

This document describes what the MSBON Transcript Verification PoC does **not** do and where its boundaries lie. These limitations are intentional given the prototype scope and the one-month development timeline.

## Scope Limitations

**No automated licensing decisions**
The system never approves or denies a nursing license application. All AI and rule outputs are advisory only and require human review before any action is taken.

**No real applicant data**
The system has not been tested with actual MSBN applicant transcripts. All development used synthetic or anonymized data. It is not validated for production use.

**No external system integration**
The system does not connect to NURSYS, NCSBN, nursing schools, accreditation bodies, or any other external system. Accreditation and school data used in the rule engine is a static reference list, not a live data feed.

**No international transcripts**
The verification rules and approved institution list are scoped to U.S. nursing programs only. International transcripts are out of scope.

**No predictive or risk scoring**
The system does not assign applicants a risk score or probability of fraud. It flags specific, explainable rule violations and surfaces them for human judgment.

## Technical Limitations

**OCR quality depends on PDF quality**
Amazon Textract extracts text from PDF files. Scanned-image PDFs with poor scan quality may produce incomplete or inaccurate text. Transcripts that are entirely image-based without selectable text will produce limited extraction results.

**Extraction input is capped**
To work within Nova Lite's output token budget, OCR text is capped at 6,000 characters before being sent to the model. Very long transcripts may have later pages truncated during structured extraction.

**AI extraction is not perfect**
Nova Lite performs structured data extraction from unstructured OCR text. It may miss fields, misparse dates or GPA values, or fail to identify all courses if the transcript format is unusual. All extraction results should be verified against the original document.

**Rule engine uses representative reference data**
The approved school list and required course definitions are representative for PoC purposes. They are not authoritative. The rule engine may produce false positives (flagging valid transcripts) or false negatives (missing issues) depending on the specific institution or transcript format.

**Textract processing time**
For multi-page PDFs, Textract async processing can take 1–3 minutes. The verification pipeline will remain in `EXTRACTING` status during this time. The Lambda timeout is set to 5 minutes.

**No authentication or authorization**
The API and frontend have no user authentication in this prototype. Access control is not implemented. This is a known PoC limitation and must be addressed before any production use.

**No production security hardening**
The system has not undergone security testing, penetration testing, or a formal security review. It contains simplified security controls appropriate only for a prototype environment.

**No high availability or disaster recovery**
No multi-region deployment, backup strategy, or disaster recovery plan has been implemented.

## Workflow Limitations

**No notification system**
Staff are not notified when a transcript finishes processing. Reviewers must check the dashboard manually.

**Single reviewer per transcript**
The review workflow supports one active review at a time per transcript. Concurrent review by multiple staff members is not supported.

**No workload management**
There is no queue management, priority routing, or workload balancing for reviewers.

**No applicant-facing interface**
The system has no portal or communication channel for applicants. It is an internal staff tool only.

## What This PoC Demonstrates

Despite these limitations, the PoC successfully demonstrates:
- Feasibility of AI-assisted transcript extraction and rule-based verification
- An auditable, explainable output format suitable for human-in-the-loop review
- A serverless AWS architecture that can scale to support the full MSBN applicant volume
- A workflow that augments staff review without replacing human judgment

These findings are the basis for any future production development.
