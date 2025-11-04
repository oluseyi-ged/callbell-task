import '@testing-library/jest-native/extend-expect';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    dismiss: jest.fn(),
  },
  Link: 'Link',
  useLocalSearchParams: jest.fn(() => ({})),
  Stack: {
    Screen: 'Screen',
  },
}));

global.__DEV__ = true;
