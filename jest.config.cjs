const os = require('os');
const path = require('path');

/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  cacheDirectory: path.join(os.tmpdir(), 'jest_linkscape_cache'),
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': [
      '@swc/jest',
      {
        sourceMaps: true,
        jsc: {
          target: 'es2020',
          parser: { syntax: 'typescript', tsx: true, decorators: false },
          transform: { react: { runtime: 'automatic', development: false } }
        },
        module: { type: 'commonjs' }
      }
    ]
  },
  transformIgnorePatterns: ['/node_modules/(?!(cheerio|enzyme)/)'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
};
