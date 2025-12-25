---
title: "Terraform Infrastructure as Code"
description: "Manage cloud infrastructure with Terraform commands."
date: "2025-10-08"
tags: ["terraform", "iac", "cloud"]
category: "DevOps"
---

## Initialize Terraform

```bash
terraform init
```

## Validate configuration

```bash
terraform validate
```

## Format code

```bash
terraform fmt
```

## Format and check

```bash
terraform fmt -check
```

## Plan changes

```bash
terraform plan
```

## Apply changes

```bash
terraform apply
```

## Apply without confirmation

```bash
terraform apply -auto-approve
```

## Destroy infrastructure

```bash
terraform destroy
```

## Destroy without confirmation

```bash
terraform destroy -auto-approve
```

## Show current state

```bash
terraform show
```

## List resources

```bash
terraform state list
```

## Show specific resource

```bash
terraform state show aws_instance.example
```

## Refresh state

```bash
terraform refresh
```

## Output values

```bash
terraform output
```

## Specific output

```bash
terraform output instance_ip
```

## Import existing resource

```bash
terraform import aws_instance.example i-1234567890abcdef0
```

## Taint resource (force recreate)

```bash
terraform taint aws_instance.example
```

## Untaint resource

```bash
terraform untaint aws_instance.example
```

## Target specific resource

```bash
terraform apply -target=aws_instance.example
```

## Use variable file

```bash
terraform apply -var-file="prod.tfvars"
```

## Set variable from CLI

```bash
terraform apply -var="instance_type=t2.micro"
```

## Generate dependency graph

```bash
terraform graph | dot -Tsvg > graph.svg
```

## Select workspace

```bash
terraform workspace select prod
```

## List workspaces

```bash
terraform workspace list
```

## Create workspace

```bash
terraform workspace new staging
```

## Delete workspace

```bash
terraform workspace delete staging
```

## Show workspace

```bash
terraform workspace show
```

## Lock state

```bash
terraform force-unlock LOCK_ID
```

## Get providers

```bash
terraform providers
```

## Basic example

```hcl
# main.tf
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

resource "aws_instance" "web" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"
  
  tags = {
    Name = "WebServer"
  }
}

output "instance_ip" {
  value = aws_instance.web.public_ip
}
```

## Variables file

```hcl
# variables.tf
variable "region" {
  description = "AWS region"
  default     = "us-east-1"
}

variable "instance_type" {
  description = "EC2 instance type"
  default     = "t2.micro"
}
```

## Remote backend (S3)

```hcl
terraform {
  backend "s3" {
    bucket = "my-terraform-state"
    key    = "prod/terraform.tfstate"
    region = "us-east-1"
  }
}
```

## Debug mode

```bash
TF_LOG=DEBUG terraform apply
```
