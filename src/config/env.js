import { CALLBELL_API_URL, CALLBELL_API_KEY } from '@env';

const validateEnvVariables = () => {
  const required = {
    CALLBELL_API_URL,
    CALLBELL_API_KEY,
  };

  const missing = Object.entries(required)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env file and ensure all required variables are set.'
    );
  }
};

validateEnvVariables();

export const ENV = {
  API_URL: CALLBELL_API_URL,
  API_KEY: CALLBELL_API_KEY,
  isDevelopment: __DEV__,
};
