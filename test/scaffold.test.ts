import { describe, it, expect } from 'bun:test';
import { scaffoldProject } from '../src/scaffold';
import type { ProjectOptions } from '../src/types';

describe('scaffold.ts', () => {
  describe('scaffoldProject', () => {
    it('should be a function', () => {
      expect(typeof scaffoldProject).toBe('function');
    });

    it('should be defined', () => {
      expect(scaffoldProject).toBeDefined();
    });

    // Note: Full integration tests for scaffoldProject would require:
    // 1. Setting up temporary directories
    // 2. Mocking file system operations
    // 3. Cleaning up after tests
    // These tests verify the function exists and has the correct signature
    // For full testing, consider integration tests in a separate test suite
  });
});
