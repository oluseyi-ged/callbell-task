import { MESSAGE_TYPES } from '../constants';

export const extractBotMessage = (text) => {
  if (!text) return '';

  if (text.includes(MESSAGE_TYPES.BOT_PREFIX)) {
    const parts = text.split(MESSAGE_TYPES.BOT_DELIMITER);
    return parts[0] || '';
  }

  return text;
};

export const formatMessageForDisplay = (message) => {
  if (!message?.text) return '';
  return extractBotMessage(message.text);
};

export const isFromBot = (message) => {
  return message?.text?.includes(MESSAGE_TYPES.BOT_PREFIX) || false;
};

export const isFromUser = (message) => {
  return !message?.uuid || message?.uuid?.length === 0;
};
