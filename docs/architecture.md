# Architecture

## Overview

The MSBON Transcript Verification system is a serverless AWS application built with the AWS CDK. It processes nursing school transcript PDFs through an automated pipeline that extracts structured data, applies deterministic verification rules, and surfaces findings for human review. All outputs are advisory only — the system never makes licensing decisions.

## System Diagram

```
┌─────────────────────────────────┐
│   React SPA (S3 + CloudFront)   │
│   Upload → Review → Audit       │
└──────────────┬──────────────────┘
               │ HTTPS
┌──────────────▼──────────────────┐
│   API Gateway (HTTP API)         │
│   /transcripts  /reviews  /audit │
└──────────────┬──────────────────┘
               │
┌──────────────▼──────────────────┐
│   AWS Step Functions (Express)   │
│   Extract → Verify → Report     │
└──┬───────────┬──────────┬───────┘
   │           │          │
   ▼           ▼          ▼
Textract    Bedrock     Bedrock
(async)    Nova Pro     Nova Lite
(extract)  (verify)     (report)
```

## Components

### Frontend (React SPA)

- Built with React 18, TypeScript, Vite, and TailwindCSS
- Hosted on S3 with CloudFront distribution for HTTPS and caching
- Five pages: Dashboard, Upload, Verification Detail, Review, Audit Log
- Communicates with API Gateway via a typed API client (`frontend/src/services/api.ts`)
- Mock server (`frontend/mock-server.cjs`) enables full local development without AWS

### API Gateway (HTTP API)

- HTTP API with Lambda integrations (payload format v1.0 for compatibility)
- Routes:
  - `POST /transcripts` — create transcript record, return presigned S3 upload URL
  - `GET /transcripts` — list all transcripts
  - `GET /transcripts/{id}` — get transcript with verification results
  - `POST /transcripts/{id}/verify` — trigger Step Functions pipeline
  - `POST /reviews` — submit human review decision
  - `GET /transcripts/{id}/audit` — retrieve audit log entries

### Upload Lambda

- Handles `POST /transcripts`: creates a DynamoDB record and generates a presigned S3 URL
- Handles `POST /transcripts/{id}/verify`: starts the Step Functions Express workflow
- Handles `GET /transcripts` and `GET /transcripts/{id}`: returns transcript records with verification data

### Step Functions Workflow (Express)

Orchestrates three Lambda functions in sequence:

1. **Extract** — Runs Textract OCR, then sends text to Nova Lite for structured parsing
2. **Verify** — Applies 13 deterministic rules and calls Nova Pro for holistic analysis
3. **Report** — Generates a structured verification report and saves it to S3

### Extract Lambda

- Calls Textract `StartDocumentTextDetection` (async API) referencing the S3 object
- Polls until the job completes (up to 240 seconds, within the 300-second Lambda timeout)
- Caps OCR text at 6,000 characters before sending to Nova Lite (output token budget management)
- Saves structured JSON (courses, GPA, graduation, institutions, transfer credits) to S3

### Verify Lambda

- Loads extracted data from S3
- Applies 13 deterministic rules (see below)
- Calls Nova Pro for holistic transcript analysis with plain-language explanation
- Saves verification result to DynamoDB and S3
- Updates transcript status to `REVIEW_REQUIRED`

### Report Lambda

- Assembles a final verification report combining rule results and AI analysis
- Saves report JSON to S3
- Updates transcript status to `COMPLETE`

### Review Lambda

- Handles `POST /reviews`: records human reviewer decisions (approve, flag, request-info, override)
- Stores review records in DynamoDB with reviewer ID and timestamp
- Writes audit entry for every review action

### Audit Lambda

- Handles `GET /transcripts/{id}/audit`: queries the audit table for all events related to a transcript
- Audit entries are append-only (never updated or deleted)

## Storage

### S3 Bucket

All objects are organized by prefix:

| Prefix | Contents |
|--------|----------|
| `uploads/` | Original PDF transcripts |
| `extracted/` | Nova Lite structured extraction JSON |
| `verifications/` | Rule engine + Nova Pro verification JSON |
| `reports/` | Final verification reports |

### DynamoDB Tables

| Table | Primary Key | Description |
|-------|-------------|-------------|
| Transcripts | `transcriptId` (String) | Transcript metadata and pipeline status |
| Verifications | `verificationId` (String) | Rule results and AI analysis per transcript |
| Reviews | `reviewId` (String) | Human review decisions |
| Audit | `transcriptId` (String) + `timestamp` (String) | Immutable audit trail |

## Verification Rules

The rule engine applies 13 deterministic checks organized into four categories:

**Graduation & Conferral**
1. Graduation date present
2. Degree conferral confirmed
3. Graduation date not in the future

**Program Completion**
4. Minimum credit hours met (ADN: 60, BSN: 120, MSN: 36, LPN: 40)
5. Required nursing core courses present
6. Cumulative GPA meets minimum (2.0)
7. No failing grades in nursing courses

**Accreditation**
8. Institution is on the approved school list
9. Program type matches an accredited program at the institution

**Fraud Indicators**
10. Degree conferral date is not before enrollment began
11. GPA is within plausible range (0.0–4.0)
12. Credit hours per term are within plausible bounds
13. No duplicate course entries

Each rule returns: `ruleId`, `status` (PASS / FLAG / UNABLE_TO_DETERMINE), `explanation`, `sourceSection`, `confidence` (HIGH / MEDIUM / LOW).

## AI Models

| Model | Use | Reason |
|-------|-----|--------|
| Nova Lite | Structured data extraction, report generation | Fast, cost-effective for JSON extraction tasks |
| Nova Pro | Holistic transcript analysis | More capable reasoning for complex fraud/anomaly detection |

All AI outputs include source citations and plain-language explanations. No AI output results in an automated decision.

## Data Flow

```
1. User uploads PDF via browser
2. Browser PUTs file to presigned S3 URL
3. Frontend calls POST /transcripts/{id}/verify
4. Upload Lambda starts Step Functions Express workflow
5. Extract Lambda:
   a. Calls Textract async (polls until complete)
   b. Sends OCR text to Nova Lite
   c. Saves structured JSON to S3
6. Verify Lambda:
   a. Loads extraction from S3
   b. Runs 13 deterministic rules
   c. Calls Nova Pro for holistic analysis
   d. Saves verification result to DynamoDB + S3
7. Report Lambda:
   a. Assembles final report
   b. Saves to S3
   c. Updates transcript status → REVIEW_REQUIRED
8. Staff reviews findings in the UI
9. Staff submits decision → Review Lambda records it
10. All actions logged to Audit table
```

## Security Notes (PoC Scope)

- All S3 objects are private; access is via presigned URLs or Lambda IAM roles only
- API Gateway has no authentication in this PoC (out of scope for prototype)
- IAM roles follow least-privilege per Lambda function
- No real applicant PII is processed or stored
- CloudFront serves the frontend over HTTPS
