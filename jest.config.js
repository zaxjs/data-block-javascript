/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

const base = require('./jest.config.base')
const { name } = require('./package')

const config = {
  ...base,
  testEnvironment: 'jsdom',
  setupFiles: ['./__mocks__/client.js'],
  projects: [
    {
      displayName: name,
    },
  ],
}

module.exports = config
