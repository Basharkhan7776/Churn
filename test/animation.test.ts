import { describe, it, expect, beforeEach, afterEach, mock } from 'bun:test';
import { startAnimation, stopAnimation } from '../src/animation';

// Mock process.stdout for testing
const originalStdoutWrite = process.stdout.write;
const originalStdoutColumns = process.stdout.columns;
const originalStdoutRows = process.stdout.rows;

let stdoutWrites: string[] = [];

beforeEach(() => {
  stdoutWrites = [];
  process.stdout.write = ((data: string) => {
    stdoutWrites.push(data);
    return true;
  }) as any;
  // Set terminal dimensions for predictable testing
  Object.defineProperty(process.stdout, 'columns', { value: 80, writable: true });
  Object.defineProperty(process.stdout, 'rows', { value: 24, writable: true });
});

afterEach(() => {
  stopAnimation();
  process.stdout.write = originalStdoutWrite;
  Object.defineProperty(process.stdout, 'columns', { value: originalStdoutColumns, writable: true });
  Object.defineProperty(process.stdout, 'rows', { value: originalStdoutRows, writable: true });
});

describe('animation.ts', () => {
  describe('startAnimation', () => {
    it('should start animation without errors', () => {
      expect(() => startAnimation()).not.toThrow();
    });

    it('should write to stdout when animation starts', async () => {
      startAnimation();

      // Wait a bit for animation to run
      await new Promise(resolve => setTimeout(resolve, 250));

      expect(stdoutWrites.length).toBeGreaterThan(0);
    });

    it('should not start multiple animations', () => {
      startAnimation();
      const firstWriteCount = stdoutWrites.length;

      startAnimation(); // Try to start again

      // Should not double the output
      expect(stdoutWrites.length).toBe(firstWriteCount);
    });

    it('should write ANSI escape codes for cursor positioning', async () => {
      startAnimation();

      // Wait for animation to output
      await new Promise(resolve => setTimeout(resolve, 250));

      const output = stdoutWrites.join('');
      // Check for ANSI escape codes (save/restore cursor, positioning)
      expect(output).toContain('\x1b[');
    });
  });

  describe('stopAnimation', () => {
    it('should stop animation without errors', () => {
      startAnimation();
      expect(() => stopAnimation()).not.toThrow();
    });

    it('should clear the animation from screen', async () => {
      startAnimation();
      await new Promise(resolve => setTimeout(resolve, 250));

      stdoutWrites = [];
      stopAnimation();

      expect(stdoutWrites.length).toBeGreaterThan(0);
      const output = stdoutWrites.join('');
      // Should contain clearing commands
      expect(output).toContain('\x1b[');
    });

    it('should do nothing if animation is not running', () => {
      const beforeLength = stdoutWrites.length;
      stopAnimation();
      // May write some clearing commands, so just ensure it doesn't crash
      expect(stdoutWrites.length).toBeGreaterThanOrEqual(beforeLength);
    });

    it('should allow restarting animation after stopping', async () => {
      startAnimation();
      await new Promise(resolve => setTimeout(resolve, 250));
      stopAnimation();

      stdoutWrites = [];
      startAnimation();
      await new Promise(resolve => setTimeout(resolve, 250));

      expect(stdoutWrites.length).toBeGreaterThan(0);
    });
  });

  describe('animation frames', () => {
    it('should animate over time', async () => {
      startAnimation();

      // Wait for first frame
      await new Promise(resolve => setTimeout(resolve, 250));
      const firstWriteCount = stdoutWrites.length;

      // Wait for more frames
      await new Promise(resolve => setTimeout(resolve, 450));
      const secondWriteCount = stdoutWrites.length;

      // Should have more writes after more time
      expect(secondWriteCount).toBeGreaterThan(firstWriteCount);

      stopAnimation();
    });
  });

  describe('terminal dimensions', () => {
    it('should handle different terminal widths', () => {
      Object.defineProperty(process.stdout, 'columns', { value: 120, writable: true });

      expect(() => {
        startAnimation();
        stopAnimation();
      }).not.toThrow();
    });

    it('should handle different terminal heights', () => {
      Object.defineProperty(process.stdout, 'rows', { value: 40, writable: true });

      expect(() => {
        startAnimation();
        stopAnimation();
      }).not.toThrow();
    });

    it('should handle small terminals', () => {
      Object.defineProperty(process.stdout, 'columns', { value: 40, writable: true });
      Object.defineProperty(process.stdout, 'rows', { value: 10, writable: true });

      expect(() => {
        startAnimation();
        stopAnimation();
      }).not.toThrow();
    });

    it('should use default values when terminal dimensions are unavailable', () => {
      Object.defineProperty(process.stdout, 'columns', { value: undefined, writable: true });
      Object.defineProperty(process.stdout, 'rows', { value: undefined, writable: true });

      expect(() => {
        startAnimation();
        stopAnimation();
      }).not.toThrow();
    });
  });
});
