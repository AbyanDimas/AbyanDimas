---
title: "AWS CLI Essentials"
description: "Manage AWS resources from the command line with aws cli."
date: "2025-09-28"
tags: ["aws", "cloud", "cli"]
category: "DevOps"
---

## Configure AWS CLI

```bash
aws configure
```

## List S3 buckets

```bash
aws s3 ls
```

## List bucket contents

```bash
aws s3 ls s3://my-bucket
```

## Upload file to S3

```bash
aws s3 cp file.txt s3://my-bucket/
```

## Download file from S3

```bash
aws s3 cp s3://my-bucket/file.txt ./
```

## Sync directory to S3

```bash
aws s3 sync ./local-dir s3://my-bucket/remote-dir
```

## Delete S3 object

```bash
aws s3 rm s3://my-bucket/file.txt
```

## List EC2 instances

```bash
aws ec2 describe-instances
```

## List running EC2 instances

```bash
aws ec2 describe-instances --filters "Name=instance-state-name,Values=running"
```

## Start EC2 instance

```bash
aws ec2 start-instances --instance-ids i-1234567890abcdef0
```

## Stop EC2 instance

```bash
aws ec2 stop-instances --instance-ids i-1234567890abcdef0
```

## Create EC2 key pair

```bash
aws ec2 create-key-pair --key-name MyKeyPair --query 'KeyMaterial' --output text > MyKeyPair.pem
```

## List security groups

```bash
aws ec2 describe-security-groups
```

## List VPCs

```bash
aws ec2 describe-vpcs
```

## List Lambda functions

```bash
aws lambda list-functions
```

## Invoke Lambda function

```bash
aws lambda invoke --function-name my-function output.txt
```

## List RDS instances

```bash
aws rds describe-db-instances
```

## Create RDS snapshot

```bash
aws rds create-db-snapshot --db-snapshot-identifier my-snapshot --db-instance-identifier my-db
```

## List CloudWatch logs

```bash
aws logs describe-log-groups
```

## Tail CloudWatch logs

```bash
aws logs tail /aws/lambda/my-function --follow
```

## List IAM users

```bash
aws iam list-users
```

## Get caller identity

```bash
aws sts get-caller-identity
```

## List regions

```bash
aws ec2 describe-regions --output table
```

## Use specific profile

```bash
aws s3 ls --profile production
```

## Use specific region

```bash
aws ec2 describe-instances --region us-west-2
```

## Output as JSON (default)

```bash
aws s3 ls --output json
```

## Output as table

```bash
aws ec2 describe-instances --output table
```
