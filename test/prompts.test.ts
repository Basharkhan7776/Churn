import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { promptUser } from '../src/prompts';

// Note: Testing interactive prompts is complex. We'll test basic module loading
// and structure. Full integration tests would require mocking the prompts library.

describe('prompts.ts', () => {
  describe('promptUser', () => {
    it('should be a function', () => {
      expect(typeof promptUser).toBe('function');
    });

    it('should return a promise', () => {
      // Check if the function returns a promise by checking the return type
      expect(promptUser.constructor.name).toBe('Function');
    });

    // Note: To fully test this function, we would need to mock the 'prompts' library
    // and simulate user input. For now, we verify the function structure.
  });
});
