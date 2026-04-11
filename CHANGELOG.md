# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [1.0.0] - 2025-04-10

### Added
- Initial Proof of Concept release
- PDF transcript upload with presigned S3 URL flow
- Amazon Textract async OCR extraction (multi-page PDF support)
- Amazon Bedrock Nova Lite structured data extraction (courses, GPA, graduation, transfer credits)
- 13 deterministic verification rules across graduation, program completion, accreditation, and fraud indicators
- Amazon Bedrock Nova Pro holistic AI analysis with plain-language explanations
- Human review and annotation workflow with status tracking
- Immutable audit trail for all system and user actions
- React SPA with Dashboard, Upload, Verification Detail, Review, and Audit Log pages
- AWS CDK (Python) infrastructure: StorageStack, VerificationStack, ApiStack, FrontendStack
- AWS Step Functions Express workflow orchestrating the full verification pipeline
- API Gateway HTTP API with routes for transcripts, reviews, and audit log
- CloudFront distribution for React frontend
- Mock API server for local development (no AWS required)
