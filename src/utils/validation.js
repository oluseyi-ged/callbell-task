import { VALIDATION, ERROR_MESSAGES } from '../constants';

export const validateName = (name) => {
  if (!name || name.trim().length < VALIDATION.MIN_NAME_LENGTH) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.NAME_TOO_SHORT,
    };
  }

  if (name.length > VALIDATION.MAX_NAME_LENGTH) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.NAME_TOO_LONG,
    };
  }

  if (!VALIDATION.NAME_PATTERN.test(name)) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.NAME_INVALID_CHARS,
    };
  }

  return {
    isValid: true,
    error: null,
  };
};

export const sanitizeInput = (input) => {
  if (!input) return '';
  return input.trim();
};
