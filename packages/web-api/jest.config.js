module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  cacheDirectory: '.jest-cache',
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '<rootDir>/packages/(?:.+?)/lib/',
  ],
  coverageDirectory: '.jest-coverage',
  coveragePathIgnorePatterns: ['<rootDir>/packages/(?:.+?)/lib/'],
  coverageReporters: ['html', 'text'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
};
