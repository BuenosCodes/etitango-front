/** @type {import('ts-jest').JestConfigWithTsJest}
 module.exports = {
 preset: 'ts-jest',
 testEnvironment: 'node',
 };
 */

module.exports = {
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.+(ts|tsx|js)', '**/?(*.)+(spec|test).+(ts|tsx|js)'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  }
};
