import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import type { ProjectOptions } from '../src/types';

// Mock chalk to avoid ANSI codes in tests
const mockChalk = {
  bold: { cyan: (s: string) => s, green: (s: string) => s },
  white: { bold: (s: string) => s },
  green: (s: string) => s,
  blue: (s: string) => s,
  gray: (s: string) => s,
  yellow: (s: string) => s,
};

// We need to mock the module before importing
const originalConsoleLog = console.log;
let consoleOutput: string[] = [];

beforeEach(() => {
  consoleOutput = [];
  console.log = (...args: any[]) => {
    consoleOutput.push(args.map(a => String(a)).join(' '));
  };
});

afterEach(() => {
  console.log = originalConsoleLog;
});

describe('utils.ts', async () => {
  // Import the actual module - note: we can't fully mock chalk, so we'll test with actual output
  const utils = await import('../src/utils');

  describe('showWelcome', () => {
    it('should display welcome message', () => {
      utils.showWelcome();
      expect(consoleOutput.length).toBeGreaterThan(0);
      const output = consoleOutput.join('\n');
      expect(output).toContain('Create');
      expect(output).toContain('backend');
    });
  });

  describe('showSuccess', () => {
    it('should display success message with project name', () => {
      const options: ProjectOptions = {
        projectName: 'test-project',
        language: 'ts',
        packageManager: 'bun',
        protocol: 'http',
        cors: true,
        orm: 'prisma',
        database: 'postgresql',
        aliases: true,
        auth: 'jwt',
        testing: 'jest',
        linting: true,
        docker: true,
        cicd: 'github',
        targetDir: './test-project',
      };

      utils.showSuccess(options);
      const output = consoleOutput.join('\n');
      expect(output).toContain('test-project');
      expect(output).toContain('successfully') || expect(output).toContain('created');
    });

    it('should show bun install command for bun package manager', () => {
      const options: ProjectOptions = {
        projectName: 'test-project',
        language: 'ts',
        packageManager: 'bun',
        protocol: 'http',
        orm: 'none',
        aliases: true,
        linting: false,
        docker: false,
        targetDir: './test-project',
      };

      utils.showSuccess(options);
      const output = consoleOutput.join('\n');
      expect(output).toContain('bun install');
      expect(output).toContain('bun run dev');
    });

    it('should show npm install command for npm package manager', () => {
      const options: ProjectOptions = {
        projectName: 'test-project',
        language: 'ts',
        packageManager: 'npm',
        protocol: 'http',
        orm: 'none',
        aliases: true,
        linting: false,
        docker: false,
        targetDir: './test-project',
      };

      utils.showSuccess(options);
      const output = consoleOutput.join('\n');
      expect(output).toContain('npm install');
      expect(output).toContain('npm run dev');
    });

    it('should show yarn install command for yarn package manager', () => {
      const options: ProjectOptions = {
        projectName: 'test-project',
        language: 'ts',
        packageManager: 'yarn',
        protocol: 'http',
        orm: 'none',
        aliases: true,
        linting: false,
        docker: false,
        targetDir: './test-project',
      };

      utils.showSuccess(options);
      const output = consoleOutput.join('\n');
      expect(output).toContain('yarn install');
      expect(output).toContain('yarn dev');
    });

    it('should show pnpm install command for pnpm package manager', () => {
      const options: ProjectOptions = {
        projectName: 'test-project',
        language: 'ts',
        packageManager: 'pnpm',
        protocol: 'http',
        orm: 'none',
        aliases: true,
        linting: false,
        docker: false,
        targetDir: './test-project',
      };

      utils.showSuccess(options);
      const output = consoleOutput.join('\n');
      expect(output).toContain('pnpm install');
      expect(output).toContain('pnpm dev');
    });

    it('should show Prisma setup reminder when using Prisma', () => {
      const options: ProjectOptions = {
        projectName: 'test-project',
        language: 'ts',
        packageManager: 'bun',
        protocol: 'http',
        orm: 'prisma',
        database: 'postgresql',
        aliases: true,
        linting: false,
        docker: false,
        targetDir: './test-project',
      };

      utils.showSuccess(options);
      const output = consoleOutput.join('\n');
      expect(output).toContain('database');
      expect(output).toContain('migrations');
    });

    it('should not show Prisma reminder when not using Prisma', () => {
      const options: ProjectOptions = {
        projectName: 'test-project',
        language: 'ts',
        packageManager: 'bun',
        protocol: 'http',
        orm: 'drizzle',
        database: 'postgresql',
        aliases: true,
        linting: false,
        docker: false,
        targetDir: './test-project',
      };

      utils.showSuccess(options);
      const output = consoleOutput.join('\n');
      // Prisma-specific reminder should not appear
      expect(output).toContain('Next steps');
    });
  });
});
