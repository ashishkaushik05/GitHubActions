const fs = require('fs');
const path = require('path');

describe('OWASP ZAP Security Tests', () => {
  const zapRulesFile = '.zap/rules.tsv';
  const workflowFile = '.github/workflows/owasp-zap.yml';

  it('should have ZAP rules file', () => {
    expect(fs.existsSync(zapRulesFile)).toBe(true);
  });

  it('should have valid rules format', () => {
    const content = fs.readFileSync(zapRulesFile, 'utf8');
    const lines = content.split('\n').filter(line => line.trim());
    
    lines.forEach(line => {
      const [ruleId, action, description] = line.split('\t');
      expect(ruleId).toMatch(/^\d+$/);
      expect(['IGNORE', 'FAIL', 'WARN']).toContain(action);
      expect(description).toBeDefined();
    });
  });

  it('should have proper workflow configuration', () => {
    const content = fs.readFileSync(workflowFile, 'utf8');
    
    // Check for required steps
    expect(content).toContain('Run OWASP ZAP Baseline Scan');
    expect(content).toContain('Upload ZAP Report');
    expect(content).toContain('Check for Critical Vulnerabilities');
    
    // Check for proper target configuration
    expect(content).toContain('target: \'http://localhost:3000\'');
    
    // Check for report generation
    expect(content).toContain('zap-report.html');
    expect(content).toContain('zap-report.json');
    expect(content).toContain('zap-report.md');
  });

  it('should have proper vulnerability handling', () => {
    const content = fs.readFileSync(workflowFile, 'utf8');
    
    // Check for critical vulnerability checks
    expect(content).toContain('CRITICAL_VULNERABILITIES');
    expect(content).toContain('riskcode == "3"');
    
    // Check for notification steps
    expect(content).toContain('Send Slack Notification');
    expect(content).toContain('Create GitHub Issue');
  });
}); 