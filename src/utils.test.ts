import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { showWelcome, showSuccess } from './utils';
import type { ProjectOptions } from './types';

describe('utils', () => {
  let originalConsoleLog: typeof console.log;
  let consoleOutput: string[] = [];

  beforeEach(() => {
    originalConsoleLog = console.log;
    consoleOutput = [];
    console.log = (...args: any[]) => {
      consoleOutput.push(args.join(' '));
    };
  });

  afterEach(() => {
    console.log = originalConsoleLog;
    consoleOutput = [];
  });

  describe('showWelcome', () => {
    it('should display welcome message', () => {
      showWelcome();
      
      const output = consoleOutput.join(' ');
      expect(output).toContain('Create Churn CLI');
      expect(output).toContain('Create customizable backend projects');
    });

    it('should include emoji and formatting', () => {
      showWelcome();
      
      const output = consoleOutput.join(' ');
      expect(output).toContain('🚀');
      expect(output).toContain('╔');
      expect(output).toContain('╗');
    });
  });

  describe('showSuccess', () => {
    const mockOptions: ProjectOptions = {
      projectName: 'test-project',
      language: 'ts',
      packageManager: 'bun',
      protocol: 'http',
      orm: 'prisma',
      aliases: true,
      targetDir: './test-project'
    };

    it('should display success message with project name', () => {
      showSuccess(mockOptions);
      
      const output = consoleOutput.join(' ');
      expect(output).toContain('Project Created!');
      expect(output).toContain('test-project');
      expect(output).toContain('✅');
    });

    it('should show correct install command for bun', () => {
      showSuccess(mockOptions);
      
      const output = consoleOutput.join(' ');
      expect(output).toContain('bun install');
    });

    it('should show correct start command for bun', () => {
      showSuccess(mockOptions);
      
      const output = consoleOutput.join(' ');
      expect(output).toContain('bun run dev');
    });

    it('should show correct install command for yarn', () => {
      const yarnOptions = { ...mockOptions, packageManager: 'yarn' as const };
      showSuccess(yarnOptions);
      
      const output = consoleOutput.join(' ');
      expect(output).toContain('yarn install');
    });

    it('should show correct start command for yarn', () => {
      const yarnOptions = { ...mockOptions, packageManager: 'yarn' as const };
      showSuccess(yarnOptions);
      
      const output = consoleOutput.join(' ');
      expect(output).toContain('yarn dev');
    });

    it('should show correct install command for pnpm', () => {
      const pnpmOptions = { ...mockOptions, packageManager: 'pnpm' as const };
      showSuccess(pnpmOptions);
      
      const output = consoleOutput.join(' ');
      expect(output).toContain('pnpm install');
    });

    it('should show correct start command for pnpm', () => {
      const pnpmOptions = { ...mockOptions, packageManager: 'pnpm' as const };
      showSuccess(pnpmOptions);
      
      const output = consoleOutput.join(' ');
      expect(output).toContain('pnpm dev');
    });

    it('should show correct install command for npm', () => {
      const npmOptions = { ...mockOptions, packageManager: 'npm' as const };
      showSuccess(npmOptions);
      
      const output = consoleOutput.join(' ');
      expect(output).toContain('npm install');
    });

    it('should show correct start command for npm', () => {
      const npmOptions = { ...mockOptions, packageManager: 'npm' as const };
      showSuccess(npmOptions);
      
      const output = consoleOutput.join(' ');
      expect(output).toContain('npm run dev');
    });

    it('should show Prisma-specific instructions when using Prisma', () => {
      showSuccess(mockOptions);
      
      const output = consoleOutput.join(' ');
      expect(output).toContain('database connection');
      expect(output).toContain('database migrations');
    });

    it('should not show Prisma instructions when not using Prisma', () => {
      const noPrismaOptions = { ...mockOptions, orm: 'none' as const };
      showSuccess(noPrismaOptions);
      
      const output = consoleOutput.join(' ');
      expect(output).not.toContain('database connection');
      expect(output).not.toContain('database migrations');
    });

    it('should show project structure information', () => {
      showSuccess(mockOptions);
      
      const output = consoleOutput.join(' ');
      expect(output).toContain('Project structure:');
      expect(output).toContain('./test-project/');
    });

    it('should show next steps', () => {
      showSuccess(mockOptions);
      
      const output = consoleOutput.join(' ');
      expect(output).toContain('Next steps:');
      expect(output).toContain('cd test-project');
    });

    it('should show documentation link', () => {
      showSuccess(mockOptions);
      
      const output = consoleOutput.join(' ');
      expect(output).toContain('Documentation:');
      expect(output).toContain('https://github.com/your-org/churn');
    });
  });
}); 