variable "aws_region" {
  type        = string
  default     = "ca-central-1"
  description = "AWS deployment region"
}

variable "aws_profile" {
  type        = string
  default     = "sasha-deploy"
  description = "Named AWS CLI profile"
}

variable "project_name" {
  type        = string
  default     = "sasha-fierce-frontend"
  description = "Base project name for resource tagging and S3 bucket naming"
}

variable "github_repo_name" {
  type        = string
  default     = "samplewebinyfe"
  description = "Name of the GitHub repository"
}

variable "github_token" {
  type        = string
  sensitive   = true
  description = "GitHub Personal Access Token with repo scope"
}

variable "deploy_aws_access_key_id" {
  type        = string
  sensitive   = true
  description = "AWS Access Key ID for GitHub Actions CI/CD (from management account)"
}

variable "deploy_aws_secret_access_key" {
  type        = string
  sensitive   = true
  description = "AWS Secret Access Key for GitHub Actions CI/CD (from management account)"
}

variable "role_to_assume" {
  type        = string
  description = "ARN of the IAM role to assume for cross-account access (OrganizationAccountAccessRole)"
}