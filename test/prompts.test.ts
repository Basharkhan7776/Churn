import { describe, it, expect, beforeEach, afterEach, mock } from 'bun:test';
import { promptUser } from '../src/prompts';
import type { ProjectOptions } from '../src/types';

// Mock the prompts package
const mockPrompts = mock(() => Promise.resolve({}));
mock.module('prompts', () => ({
  default: mockPrompts
}));

describe('promptUser', () => {
  let originalConsoleLog: typeof console.log;
  let consoleOutput: string[] = [];

  beforeEach(() => {
    originalConsoleLog = console.log;
    consoleOutput = [];
    console.log = (...args: any[]) => {
      consoleOutput.push(args.join(' '));
    };
    mockPrompts.mockClear();
  });

  afterEach(() => {
    console.log = originalConsoleLog;
    consoleOutput = [];
  });

  it('should return null when user cancels', async () => {
    // Mock prompts to return empty response (cancelled)
    mockPrompts.mockImplementation(() => Promise.resolve({}));

    const result = await promptUser();
    expect(result).toBeNull();
  });

  it('should return valid project options for TypeScript with Bun', async () => {
    const mockResponse = {
      projectName: 'test-project',
      language: 'ts',
      packageManager: 'bun',
      protocol: 'http',
      orm: 'prisma',
      aliases: true
    };

    mockPrompts.mockImplementation(() => Promise.resolve(mockResponse));

    const result = await promptUser();
    
    expect(result).toEqual({
      projectName: 'test-project',
      language: 'ts',
      packageManager: 'bun',
      protocol: 'http',
      orm: 'prisma',
      aliases: true,
      targetDir: './test-project'
    });
  });

  it('should return valid project options for JavaScript with npm', async () => {
    const mockResponse = {
      projectName: 'js-project',
      language: 'js',
      packageManager: 'npm',
      protocol: 'ws',
      orm: 'none',
      aliases: false
    };

    mockPrompts.mockImplementation(() => Promise.resolve(mockResponse));

    const result = await promptUser();
    
    expect(result).toEqual({
      projectName: 'js-project',
      language: 'js',
      packageManager: 'npm',
      protocol: 'ws',
      orm: 'none',
      aliases: false,
      targetDir: './js-project'
    });
  });

  it('should handle project name validation', async () => {
    // Test with invalid project name
    const mockResponse = {
      projectName: 'Invalid Name!',
      language: 'ts',
      packageManager: 'bun',
      protocol: 'http',
      orm: 'prisma',
      aliases: true
    };

    mockPrompts.mockImplementation(() => Promise.resolve(mockResponse));

    const result = await promptUser();
    
    // Should still return the result as validation is handled by prompts library
    expect(result).toBeTruthy();
    expect(result?.projectName).toBe('Invalid Name!');
  });

  it('should handle empty project name', async () => {
    const mockResponse = {
      projectName: '',
      language: 'ts',
      packageManager: 'bun',
      protocol: 'http',
      orm: 'prisma',
      aliases: true
    };

    mockPrompts.mockImplementation(() => Promise.resolve(mockResponse));

    const result = await promptUser();
    expect(result).toBeNull();
  });

  it('should display welcome message', async () => {
    const mockResponse = {
      projectName: 'test-project',
      language: 'ts',
      packageManager: 'bun',
      protocol: 'http',
      orm: 'prisma',
      aliases: true
    };

    mockPrompts.mockImplementation(() => Promise.resolve(mockResponse));

    await promptUser();
    
    expect(consoleOutput.some(output => output.includes("Let's create your Churn backend project"))).toBe(true);
  });
}); 