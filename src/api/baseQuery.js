import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { retry } from '@reduxjs/toolkit/query/react';
import { ENV } from '../config/env';
import { TIMEOUTS, RETRY_CONFIG } from '../constants';

const baseQueryWithAuth = fetchBaseQuery({
  baseUrl: ENV.API_URL,
  timeout: TIMEOUTS.API_REQUEST,
  prepareHeaders: (headers) => {
    const token = ENV.API_KEY;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

const baseQueryWithErrorHandling = async (args, api, extraOptions) => {
  const result = await baseQueryWithAuth(args, api, extraOptions);

  if (result.error) {
    const { status, data } = result.error;

    const errorMessage = data?.message || data?.error || 'An unexpected error occurred';

    return {
      ...result,
      error: {
        status,
        data: {
          message: errorMessage,
          originalError: data,
        },
      },
    };
  }

  return result;
};

const staggeredBaseQueryWithBailOut = retry(
  baseQueryWithErrorHandling,
  {
    maxRetries: RETRY_CONFIG.MAX_RETRIES,
    backoff: (attempt) => {
      return new Promise((resolve) => {
        setTimeout(resolve, RETRY_CONFIG.RETRY_DELAY * Math.pow(2, attempt));
      });
    },
  }
);

const shouldRetry = (error) => {
  if (!error?.status) return false;
  return RETRY_CONFIG.STATUS_CODES.includes(error.status);
};

export const baseQueryWithRetry = async (args, api, extraOptions) => {
  const result = await staggeredBaseQueryWithBailOut(args, api, extraOptions);

  if (result.error && !shouldRetry(result.error)) {
    return result;
  }

  return result;
};

export default baseQueryWithRetry;
