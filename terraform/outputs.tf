output "s3_bucket_name" {
  value       = aws_s3_bucket.frontend.id
  description = "Name of the created S3 bucket"
}

output "website_endpoint" {
  value       = "http://${aws_s3_bucket_website_configuration.frontend.website_endpoint}"
  description = "Public static website URL"
}

output "github_repository_url" {
  value       = github_repository.repo.html_url
  description = "URL of the created GitHub repository"
}

output "github_clone_ssh" {
  value       = github_repository.repo.ssh_clone_url
  description = "SSH clone URL"
}