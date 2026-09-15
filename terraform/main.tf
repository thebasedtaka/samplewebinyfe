terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    github = {
      source  = "integrations/github"
      version = "~> 6.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
  }
}

provider "aws" {
  region  = var.aws_region
  profile = var.aws_profile
}

provider "github" {
  token = var.github_token
}

# Unique suffix to prevent S3 bucket namespace collisions
resource "random_id" "bucket_suffix" {
  byte_length = 4
}

locals {
  bucket_name = "${var.project_name}-${random_id.bucket_suffix.hex}"
}

# -----------------------------------------------------------------------------
# AWS S3 Static Website Configuration
# -----------------------------------------------------------------------------

resource "aws_s3_bucket" "frontend" {
  bucket        = local.bucket_name
  force_destroy = true

  tags = {
    Project     = var.project_name
    Environment = "production"
  }
}

resource "aws_s3_bucket_website_configuration" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }
}

# Disable block public access settings for static website hosting
resource "aws_s3_bucket_public_access_block" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

# Public read policy for serving web traffic
resource "aws_s3_bucket_policy" "public_read" {
  bucket = aws_s3_bucket.frontend.id
  depends_on = [
    aws_s3_bucket_public_access_block.frontend
  ]

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.frontend.arn}/*"
      }
    ]
  })
}

# -----------------------------------------------------------------------------
# GitHub Repository & Deployment Secrets
# -----------------------------------------------------------------------------

resource "github_repository" "repo" {
  name        = var.github_repo_name
  description = "Frontend website for Sasha Fierce deployed to AWS S3"
  visibility  = "public"
  auto_init   = false
}

resource "github_actions_secret" "aws_access_key" {
  repository      = github_repository.repo.name
  secret_name     = "AWS_ACCESS_KEY_ID"
  plaintext_value = var.deploy_aws_access_key_id
}

resource "github_actions_secret" "aws_secret_key" {
  repository      = github_repository.repo.name
  secret_name     = "AWS_SECRET_ACCESS_KEY"
  plaintext_value = var.deploy_aws_secret_access_key
}

resource "github_actions_secret" "aws_region" {
  repository      = github_repository.repo.name
  secret_name     = "AWS_REGION"
  plaintext_value = var.aws_region
}

resource "github_actions_secret" "s3_bucket_name" {
  repository      = github_repository.repo.name
  secret_name     = "S3_BUCKET_NAME"
  plaintext_value = aws_s3_bucket.frontend.id
}