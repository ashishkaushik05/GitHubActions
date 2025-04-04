const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

describe('Security Workflow Integration Tests', () => {
  const workflowsDir = '.github/workflows';
  const requiredWorkflows = [
    'sonarqube.yml',
    'snyk.yml',
    'owasp-zap.yml'
  ];

  it('should have all required workflow files', () => {
    const files = fs.readdirSync(workflowsDir);
    requiredWorkflows.forEach(workflow => {
      expect(files).toContain(workflow);
    });
  });

  it('should have valid YAML syntax in workflow files', () => {
    requiredWorkflows.forEach(workflow => {
      const filePath = path.join(workflowsDir, workflow);
      const content = fs.readFileSync(filePath, 'utf8');
      // Basic YAML validation
      expect(() => {
        require('js-yaml').load(content);
      }).not.toThrow();
    });
  });

  it('should have required secrets in workflow files', () => {
    const secrets = [
      'SNYK_TOKEN',
      'SONAR_TOKEN',
      'SONAR_HOST_URL',
      'SLACK_BOT_TOKEN'
    ];

    requiredWorkflows.forEach(workflow => {
      const filePath = path.join(workflowsDir, workflow);
      const content = fs.readFileSync(filePath, 'utf8');
      secrets.forEach(secret => {
        if (workflow !== 'owasp-zap.yml' || secret !== 'SONAR_TOKEN') {
          expect(content).toContain(`${{ secrets.${secret} }}`);
        }
      });
    });
  });

  it('should have proper triggers in workflow files', () => {
    requiredWorkflows.forEach(workflow => {
      const filePath = path.join(workflowsDir, workflow);
      const content = fs.readFileSync(filePath, 'utf8');
      expect(content).toContain('push:');
      expect(content).toContain('pull_request:');
    });
  });
}); 