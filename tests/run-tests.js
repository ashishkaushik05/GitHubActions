const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function runTests() {
  console.log('Starting security test suite...\n');

  try {
    // Install test dependencies
    console.log('Installing test dependencies...');
    execSync('npm install --save-dev jest supertest js-yaml', { stdio: 'inherit' });

    // Run unit tests
    console.log('\nRunning unit tests...');
    execSync('npx jest tests/unit --verbose', { stdio: 'inherit' });

    // Run integration tests
    console.log('\nRunning integration tests...');
    execSync('npx jest tests/integration --verbose', { stdio: 'inherit' });

    // Run security tests
    console.log('\nRunning security tests...');
    execSync('npx jest tests/security --verbose', { stdio: 'inherit' });

    console.log('\nAll tests completed successfully!');
  } catch (error) {
    console.error('\nTest suite failed:', error.message);
    process.exit(1);
  }
}

runTests(); 