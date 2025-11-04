module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)',
  ],
  testPathIgnorePatterns: ['/node_modules/', '/e2e/'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/**/*.test.{js,jsx}',
    '!src/store/index.js',
    '!src/providers/**',
    '!src/api/**',
    '!src/components/**',
    '!src/config/**',
    '!**/node_modules/**',
  ],
  coverageThreshold: {
    './src/store/conversationsSlice.js': {
      statements: 80,
      branches: 60,
      functions: 60,
      lines: 85,
    },
    './src/utils/*.js': {
      statements: 100,
      branches: 91,
      functions: 100,
      lines: 100,
    },
    './src/hooks/*.js': {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100,
    },
  },
};
