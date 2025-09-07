/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(e2e).js'],
  globalSetup: '<rootDir>/e2e/setup.js',
  globalTeardown: '<rootDir>/e2e/teardown.js',
  testTimeout: 120000,
  rootDir: '..'
};
