# Setup and Deployment

## Prerequisites

- AWS CLI configured with appropriate credentials (`aws configure` or SSO)
- AWS CDK CLI: `npm install -g aws-cdk`
- Node.js 18+
- Python 3.11+
- Access to `us-east-1` region with the following services enabled:
  - Amazon Bedrock — Nova Lite and Nova Pro models (must be enabled in the Bedrock console)
  - Amazon Textract
  - AWS Step Functions
  - Amazon DynamoDB, S3, Lambda, API Gateway, CloudFront

## Local Development (No AWS Required)

The frontend includes a mock API server that simulates the full backend with five sample transcripts.

```bash
cd frontend
npm install
npm run dev:full        # Starts mock API on :3001 and frontend on :3000
```

Open **http://localhost:3000** to use the application locally.

## AWS Deployment

### 1. Enable Bedrock Models

In the AWS Console → Amazon Bedrock → Model access (`us-east-1`), request access to:
- Amazon Nova Lite
- Amazon Nova Pro

Wait for access to be granted before deploying.

### 2. Bootstrap CDK (first time only)

```bash
cd infrastructure
pip install -r requirements.txt
cdk bootstrap aws://<ACCOUNT_ID>/us-east-1
```

### 3. Deploy All Stacks

```bash
cd infrastructure
cdk deploy --all --outputs-file ../cdk-outputs.json
```

This deploys four stacks in dependency order:
1. `MsbonStorage` — S3 bucket and DynamoDB tables
2. `MsbonVerification` — Lambda functions and Step Functions workflow
3. `MsbonApi` — API Gateway HTTP API
4. `MsbonFrontend` — CloudFront distribution and S3 bucket for the React app

CDK outputs the API URL and CloudFront URL after deployment.

### 4. Build and Deploy the Frontend

After CDK deployment, get the API URL from the outputs:

```bash
cat cdk-outputs.json | python3 -c "import json,sys; d=json.load(sys.stdin); print(d['MsbonApi']['ApiUrl'])"
```

Build the React app with the API URL:

```bash
cd frontend
VITE_API_URL="https://<your-api-id>.execute-api.us-east-1.amazonaws.com" npm run build
```

Sync the build to S3 and invalidate CloudFront:

```bash
# Get bucket name and distribution ID from CDK outputs
BUCKET=$(cat ../cdk-outputs.json | python3 -c "import json,sys; d=json.load(sys.stdin); print(d['MsbonFrontend']['FrontendBucketName'])")
DIST=$(cat ../cdk-outputs.json | python3 -c "import json,sys; d=json.load(sys.stdin); print(d['MsbonFrontend']['DistributionId'])")

aws s3 sync dist/ s3://$BUCKET --delete
aws cloudfront create-invalidation --distribution-id $DIST --paths "/*"
```

### 5. Configure Environment (Optional)

For local development against the deployed AWS backend, copy `.env.example` and fill in your API URL:

```bash
cp .env.example .env.local
# Edit .env.local and set VITE_API_URL
```

## Stack Overview

| Stack | Resources |
|-------|-----------|
| `MsbonStorage` | S3 bucket, 4 DynamoDB tables (Transcripts, Verifications, Reviews, Audit) |
| `MsbonVerification` | 5 Lambda functions, Step Functions Express workflow, IAM roles |
| `MsbonApi` | API Gateway HTTP API, Lambda integrations |
| `MsbonFrontend` | S3 bucket (website), CloudFront distribution |

## Estimated Costs

This PoC is designed to run well within the $1,000 AWS Innovation Hub budget for prototype testing. Costs are driven by:
- Bedrock API calls (Nova Lite + Nova Pro) — per-token pricing
- Textract — per-page pricing
- Lambda invocations — effectively free at PoC scale
- DynamoDB on-demand — effectively free at PoC scale
- CloudFront + S3 — effectively free at PoC scale

Monitor usage in AWS Cost Explorer during development.

## Teardown

To remove all deployed resources:

```bash
cd infrastructure
cdk destroy --all
```

Note: S3 buckets with objects must be emptied before CDK can delete them.
