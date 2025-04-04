# Security-Focused CI/CD Pipeline

A comprehensive security pipeline for web applications using GitHub Actions, incorporating multiple security scanning tools and automated notifications.

## Features

- Docker image security scanning with Trivy
- Dependency vulnerability scanning
- Code security analysis
- Automated security notifications (Email & Slack)
- Security test suite
- Detailed reporting

## Prerequisites

1. **GitHub Repository**
   - Create a new repository
   - Enable GitHub Actions
   - Set up required secrets

2. **Required Secrets**
   ```bash
   SLACK_BOT_TOKEN          # Slack bot token for notifications
   EMAIL_USERNAME           # Gmail address for notifications
   EMAIL_PASSWORD           # Gmail app password
   SECURITY_TEAM_EMAIL      # Security team email list
   ```

3. **Local Development**
   - Docker
   - Node.js
   - npm

## Quick Start

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. **Set Up Secrets**
   ```bash
   # In GitHub repository settings:
   Settings -> Secrets and variables -> Actions
   # Add all required secrets
   ```

3. **Run Security Tests**
   ```bash
   # Test Docker security
   npm run test:security docker

   # Test dependencies
   npm run test:security dependencies

   # Test code security
   npm run test:security code
   ```

## Workflows

### 1. Docker Security Scan
- Triggers on Dockerfile changes
- Scans for vulnerabilities using Trivy
- Generates HTML and SARIF reports
- Sends notifications for critical issues

### 2. Security Test Suite
- Manual trigger with test type selection
- Tests different vulnerability types
- Generates test reports
- Validates notification systems

## Security Tools

1. **Trivy**
   - Container image scanning
   - OS package analysis
   - Dependency scanning

2. **npm audit**
   - Dependency vulnerability scanning
   - Automatic updates

3. **ESLint**
   - Code security analysis
   - Best practices enforcement

## Testing the Pipeline

1. **Manual Testing**
   ```bash
   # Run specific test type
   npm run test:security <type>
   # Available types: docker, dependencies, code
   ```

2. **GitHub Actions Testing**
   - Navigate to Actions tab
   - Select "Security Test Suite"
   - Choose test type
   - Run workflow

3. **Verify Notifications**
   - Check email inbox
   - Verify Slack channel
   - Review GitHub issues

## Security Reports

Reports are generated in multiple formats:
- SARIF for GitHub integration
- HTML for human-readable format
- Markdown for documentation

## Best Practices

1. **Docker Security**
   - Use minimal base images
   - Regular updates
   - Non-root user
   - Multi-stage builds

2. **Dependencies**
   - Regular audits
   - Automatic updates
   - Version pinning

3. **Code Security**
   - Input validation
   - Secure headers
   - XSS prevention
   - CSRF protection

## Troubleshooting

1. **Common Issues**
   ```bash
   # Check workflow logs
   gh run view <run-id>

   # Test email configuration
   npm run test:email

   # Verify Slack integration
   npm run test:slack
   ```

2. **Debugging Steps**
   - Check workflow logs
   - Verify secrets
   - Test notifications
   - Review reports

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes
4. Run security tests
5. Submit pull request

## Support

For issues and feature requests, please use the GitHub issue tracker. 