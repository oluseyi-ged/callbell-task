export const TIMEOUTS = {
  API_REQUEST: 30000,
  RETRY_DELAY: 1000,
  DEBOUNCE_INPUT: 300,
};

export const CACHE_TIMES = {
  CONVERSATIONS: 60,
  MESSAGES: 30,
  CONTACTS: 120,
};

export const RETRY_CONFIG = {
  MAX_RETRIES: 3,
  STATUS_CODES: [408, 429, 500, 502, 503, 504],
};

export const NAVIGATION = {
  DISMISS_TO_ROOT: 2,
};

export const MESSAGE_TYPES = {
  BOT_PREFIX: 'Bot',
  BOT_DELIMITER: ':',
};

export const LIST_CONFIG = {
  INITIAL_RENDER: 10,
  MAX_TO_RENDER_PER_BATCH: 5,
  WINDOW_SIZE: 10,
  UPDATE_CELLS_BATCH_PERIOD: 50,
};

export const VALIDATION = {
  MIN_NAME_LENGTH: 1,
  MAX_NAME_LENGTH: 100,
  NAME_PATTERN: /^[a-zA-Z0-9\s\-_.]+$/,
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network connection failed. Please check your internet connection.',
  API_ERROR: 'An error occurred. Please try again.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  NAME_TOO_SHORT: 'Name must be at least 1 character long.',
  NAME_TOO_LONG: 'Name must not exceed 100 characters.',
  NAME_INVALID_CHARS: 'Name contains invalid characters.',
};

export const SUCCESS_MESSAGES = {
  NAME_UPDATED: 'Name updated successfully',
  MESSAGE_SENT: 'Message sent successfully',
  CONVERSATION_DELETED: 'Conversation deleted',
};
