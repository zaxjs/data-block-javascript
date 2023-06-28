module.exports = {
  verbose: true,
  preset: 'ts-jest',
  roots: ['<rootDir>/src', '<rootDir>/__tests__'],
  testEnvironment: 'node',

  collectCoverage: true,
  coverageReporters: ['json-summary', 'clover', 'json', 'lcov', 'text'], // Default: ["clover", "json", "lcov", "text"]
  coveragePathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/coverage/', '<rootDir>/build/', '<rootDir>/dist/', '<rootDir>/lib/'],
  coverageDirectory: '<rootDir>/coverage/',
  collectCoverageFrom: ['<rootDir>/src/*.{ts,tsx}'],
  extensionsToTreatAsEsm: ['.ts'],
  coverageThreshold: {
    global: {
      statements: 95,
      branches: 75,
      functions: 95,
      lines: 95,
    },
  },
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.tsx?$': 'ts-jest',
  },
  globals: {
    window: {
      location: {},
      document: {},
    },
    document: {},
  },
  // transformIgnorePatterns: ['<rootDir>/node_modules)'],
  testPathIgnorePatterns: ['/node_modules/', '(/__tests__/.*|\\.(test|spec))\\.d.(jsx?|tsx?)$'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  // moduleNameMapper: {
  //   '@tarojs/taro': '@tarojs/taro/h5',
  // },
  // transform: {
  //   // '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  //   '^.+\\.esm.js?$': 'ts-jest',
  // },
  // transformIgnorePatterns: ['<rootDir>/node_modules/(?!@taro)'],
}
