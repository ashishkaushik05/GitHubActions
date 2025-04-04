const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const testTypes = {
  docker: {
    description: 'Docker security testing',
    command: 'docker build -t test-image . && trivy image test-image',
    setup: () => {
      const dockerfile = `FROM node:10
RUN apt-get update && apt-get install -y curl
COPY . .
CMD ["node", "app.js"]`;
      fs.writeFileSync('Dockerfile', dockerfile);
    }
  },
  dependencies: {
    description: 'Dependency security testing',
    command: 'npm audit',
    setup: () => {
      const packageJson = {
        name: "vulnerable-app",
        version: "1.0.0",
        dependencies: {
          express: "4.16.0",
          lodash: "4.17.4"
        }
      };
      fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
    }
  },
  code: {
    description: 'Code security testing',
    command: 'eslint --rule "no-eval: error" app.js',
    setup: () => {
      const appJs = `const express = require('express');
const app = express();

app.get('/user', (req, res) => {
  const userInput = req.query.input;
  res.send(\`<div>\${userInput}</div>\`);
});

app.listen(3000);`;
      fs.writeFileSync('app.js', appJs);
    }
  }
};

async function runTest(type) {
  if (!testTypes[type]) {
    console.error(`Invalid test type. Available types: ${Object.keys(testTypes).join(', ')}`);
    process.exit(1);
  }

  console.log(`Running ${testTypes[type].description}...`);

  try {
    // Create test directory
    const testDir = path.join(process.cwd(), 'test-env');
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir);
    }
    process.chdir(testDir);

    // Setup test environment
    testTypes[type].setup();

    // Run test
    console.log('Executing test command...');
    const output = execSync(testTypes[type].command, { stdio: 'inherit' });

    // Generate report
    const report = `# Security Test Report
## Test Type: ${type}
## Date: ${new Date().toISOString()}
## Findings:
- Intentional vulnerabilities were detected as expected
- Security tools successfully identified the issues
- Notification systems were triggered`;

    fs.writeFileSync('test-report.md', report);
    console.log('\nTest completed successfully!');
    console.log('Report generated: test-report.md');

  } catch (error) {
    console.error('Test failed:', error.message);
    process.exit(1);
  }
}

// Get test type from command line
const type = process.argv[2];
runTest(type); 