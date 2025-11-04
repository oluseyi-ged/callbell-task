import { validateName, sanitizeInput } from './validation';
import { ERROR_MESSAGES } from '../constants';

describe('validation utilities', () => {
  describe('validateName', () => {
    it('should validate a correct name', () => {
      const result = validateName('John Doe');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should reject empty name', () => {
      const result = validateName('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(ERROR_MESSAGES.NAME_TOO_SHORT);
    });

    it('should reject name with only spaces', () => {
      const result = validateName('   ');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(ERROR_MESSAGES.NAME_TOO_SHORT);
    });

    it('should reject name that is too long', () => {
      const longName = 'a'.repeat(101);
      const result = validateName(longName);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(ERROR_MESSAGES.NAME_TOO_LONG);
    });

    it('should accept name at max length', () => {
      const maxName = 'a'.repeat(100);
      const result = validateName(maxName);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should accept name with valid characters', () => {
      const validNames = [
        'John_Doe',
        'Jane-Smith',
        'User123',
        'Test Name',
        'Name.Surname',
      ];

      validNames.forEach((name) => {
        const result = validateName(name);
        expect(result.isValid).toBe(true);
      });
    });

    it('should reject name with invalid characters', () => {
      const invalidNames = ['John@Doe', 'Jane#Smith', 'Test!Name', 'User$123'];

      invalidNames.forEach((name) => {
        const result = validateName(name);
        expect(result.isValid).toBe(false);
        expect(result.error).toBe(ERROR_MESSAGES.NAME_INVALID_CHARS);
      });
    });

    it('should handle null input', () => {
      const result = validateName(null);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(ERROR_MESSAGES.NAME_TOO_SHORT);
    });

    it('should handle undefined input', () => {
      const result = validateName(undefined);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(ERROR_MESSAGES.NAME_TOO_SHORT);
    });
  });

  describe('sanitizeInput', () => {
    it('should trim whitespace', () => {
      expect(sanitizeInput('  John Doe  ')).toBe('John Doe');
    });

    it('should handle empty string', () => {
      expect(sanitizeInput('')).toBe('');
    });

    it('should handle only spaces', () => {
      expect(sanitizeInput('     ')).toBe('');
    });

    it('should handle null', () => {
      expect(sanitizeInput(null)).toBe('');
    });

    it('should handle undefined', () => {
      expect(sanitizeInput(undefined)).toBe('');
    });

    it('should not modify already clean input', () => {
      expect(sanitizeInput('JohnDoe')).toBe('JohnDoe');
    });
  });
});
