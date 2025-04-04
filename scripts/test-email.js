const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

async function sendTestEmail() {
  // Create test email content
  const emailContent = {
    subject: 'Security Test Email',
    text: 'This is a test email from the security pipeline.',
    html: `
      <h2>Security Test Email</h2>
      <p>This is a test email from the security pipeline.</p>
      <h3>Test Details:</h3>
      <ul>
        <li>Date: ${new Date().toISOString()}</li>
        <li>Test Type: Email Configuration</li>
        <li>Status: Testing</li>
      </ul>
      <p>If you receive this email, the email notification system is working correctly.</p>
    `
  };

  // Create transporter
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  try {
    // Send test email
    const info = await transporter.sendMail({
      from: `"Security Pipeline" <${process.env.EMAIL_USERNAME}>`,
      to: process.env.SECURITY_TEAM_EMAIL,
      subject: emailContent.subject,
      text: emailContent.text,
      html: emailContent.html
    });

    console.log('Test email sent successfully!');
    console.log('Message ID:', info.messageId);
    
    // Generate test report
    const report = `# Email Test Report
## Date: ${new Date().toISOString()}
## Status: Success
## Details:
- Message ID: ${info.messageId}
- Recipients: ${process.env.SECURITY_TEAM_EMAIL}
- Test completed successfully`;

    fs.writeFileSync('email-test-report.md', report);
    console.log('Test report generated: email-test-report.md');

  } catch (error) {
    console.error('Failed to send test email:', error);
    
    // Generate error report
    const report = `# Email Test Report
## Date: ${new Date().toISOString()}
## Status: Failed
## Error Details:
${error.message}

## Troubleshooting Steps:
1. Verify EMAIL_USERNAME and EMAIL_PASSWORD environment variables
2. Check if Gmail account has 2-Step Verification enabled
3. Verify the App Password is correct
4. Check if SECURITY_TEAM_EMAIL is properly set`;

    fs.writeFileSync('email-test-report.md', report);
    console.log('Error report generated: email-test-report.md');
    process.exit(1);
  }
}

// Check for required environment variables
const requiredEnvVars = ['EMAIL_USERNAME', 'EMAIL_PASSWORD', 'SECURITY_TEAM_EMAIL'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('Missing required environment variables:', missingVars.join(', '));
  console.error('Please set these variables before running the test');
  process.exit(1);
}

sendTestEmail(); 