import {
  extractBotMessage,
  formatMessageForDisplay,
  isFromBot,
  isFromUser,
} from './messageUtils';

describe('messageUtils', () => {
  describe('extractBotMessage', () => {
    it('should extract bot message prefix', () => {
      const text = 'Bot: This is a bot message';
      expect(extractBotMessage(text)).toBe('Bot');
    });

    it('should return full text if not a bot message', () => {
      const text = 'This is a regular message';
      expect(extractBotMessage(text)).toBe(text);
    });

    it('should handle empty string', () => {
      expect(extractBotMessage('')).toBe('');
    });

    it('should handle null', () => {
      expect(extractBotMessage(null)).toBe('');
    });

    it('should handle undefined', () => {
      expect(extractBotMessage(undefined)).toBe('');
    });

    it('should handle bot message without content after colon', () => {
      const text = 'Bot:';
      expect(extractBotMessage(text)).toBe('Bot');
    });

    it('should handle multiple colons', () => {
      const text = 'Bot: Message: with: colons';
      expect(extractBotMessage(text)).toBe('Bot');
    });
  });

  describe('formatMessageForDisplay', () => {
    it('should format bot message for display', () => {
      const message = {
        text: 'Bot: Automated response',
      };
      expect(formatMessageForDisplay(message)).toBe('Bot');
    });

    it('should format regular message for display', () => {
      const message = {
        text: 'Hello there',
      };
      expect(formatMessageForDisplay(message)).toBe('Hello there');
    });

    it('should handle message without text', () => {
      const message = {};
      expect(formatMessageForDisplay(message)).toBe('');
    });

    it('should handle null message', () => {
      expect(formatMessageForDisplay(null)).toBe('');
    });

    it('should handle undefined message', () => {
      expect(formatMessageForDisplay(undefined)).toBe('');
    });
  });

  describe('isFromBot', () => {
    it('should return true for bot messages', () => {
      const message = {
        text: 'Bot: Automated message',
      };
      expect(isFromBot(message)).toBe(true);
    });

    it('should return false for regular messages', () => {
      const message = {
        text: 'Hello',
      };
      expect(isFromBot(message)).toBe(false);
    });

    it('should return false for empty message', () => {
      const message = {
        text: '',
      };
      expect(isFromBot(message)).toBe(false);
    });

    it('should return false for null message', () => {
      expect(isFromBot(null)).toBe(false);
    });

    it('should return false for undefined message', () => {
      expect(isFromBot(undefined)).toBe(false);
    });
  });

  describe('isFromUser', () => {
    it('should return true for messages without uuid', () => {
      const message = {
        text: 'Hello',
      };
      expect(isFromUser(message)).toBe(true);
    });

    it('should return true for messages with empty uuid', () => {
      const message = {
        text: 'Hello',
        uuid: '',
      };
      expect(isFromUser(message)).toBe(true);
    });

    it('should return false for messages with uuid', () => {
      const message = {
        text: 'Hello',
        uuid: 'test-uuid-123',
      };
      expect(isFromUser(message)).toBe(false);
    });

    it('should return true for null message', () => {
      expect(isFromUser(null)).toBe(true);
    });

    it('should return true for undefined message', () => {
      expect(isFromUser(undefined)).toBe(true);
    });
  });
});
