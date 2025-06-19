import { describe, it, expect, beforeEach, afterEach, mock } from 'bun:test';
import type { ProjectOptions } from '../src/types';

// Mock fs-extra before importing
const mockFs = {
  ensureDir: mock(() => Promise.resolve()),
  writeJson: mock(() => Promise.resolve()),
  writeFile: mock(() => Promise.resolve())
};

mock.module('fs-extra', () => ({
  default: mockFs
}));

// Mock child_process before importing
const mockExecSync = mock(() => {});
mock.module('child_process', () => ({
  execSync: mockExecSync
}));

// Import after mocking
import { scaffoldProject } from '../src/scaffold';

describe('scaffoldProject', () => {
  let originalConsoleLog: typeof console.log;
  let originalProcessChdir: typeof process.chdir;
  let consoleOutput: string[] = [];

  beforeEach(() => {
    originalConsoleLog = console.log;
    originalProcessChdir = process.chdir;
    consoleOutput = [];
    console.log = (...args: any[]) => {
      consoleOutput.push(args.join(' '));
    };
    process.chdir = mock(() => {});
    
    // Clear all mocks
    mockFs.ensureDir.mockClear();
    mockFs.writeJson.mockClear();
    mockFs.writeFile.mockClear();
    mockExecSync.mockClear();
  });

  afterEach(() => {
    console.log = originalConsoleLog;
    process.chdir = originalProcessChdir;
    consoleOutput = [];
  });

  const mockOptions: ProjectOptions = {
    projectName: 'test-project',
    language: 'ts',
    packageManager: 'bun',
    protocol: 'http',
    orm: 'prisma',
    aliases: true,
    targetDir: './test-project'
  };

  it('should create project directory', async () => {
    await scaffoldProject(mockOptions);
    
    expect(mockFs.ensureDir).toHaveBeenCalledWith('./test-project');
  });

  it('should generate package.json', async () => {
    await scaffoldProject(mockOptions);
    
    expect(mockFs.writeJson).toHaveBeenCalledWith(
      expect.stringContaining('package.json'),
      expect.any(Object),
      { spaces: 2 }
    );
  });

  it('should generate TypeScript main file when language is ts', async () => {
    await scaffoldProject(mockOptions);
    
    expect(mockFs.writeFile).toHaveBeenCalledWith(
      expect.stringContaining('index.ts'),
      expect.any(String)
    );
  });

  it('should generate JavaScript main file when language is js', async () => {
    const jsOptions = { ...mockOptions, language: 'js' as const };
    await scaffoldProject(jsOptions);
    
    expect(mockFs.writeFile).toHaveBeenCalledWith(
      expect.stringContaining('index.js'),
      expect.any(String)
    );
  });

  it('should generate tsconfig.json when using TypeScript', async () => {
    await scaffoldProject(mockOptions);
    
    expect(mockFs.writeJson).toHaveBeenCalledWith(
      expect.stringContaining('tsconfig.json'),
      expect.any(Object),
      { spaces: 2 }
    );
  });

  it('should generate Prisma schema when using Prisma', async () => {
    await scaffoldProject(mockOptions);
    
    expect(mockFs.ensureDir).toHaveBeenCalledWith(expect.stringContaining('prisma'));
    expect(mockFs.writeFile).toHaveBeenCalledWith(
      expect.stringContaining('schema.prisma'),
      expect.any(String)
    );
  });

  it('should not generate Prisma schema when not using Prisma', async () => {
    const noPrismaOptions = { ...mockOptions, orm: 'none' as const };
    await scaffoldProject(noPrismaOptions);
    
    const writeFileCalls = mockFs.writeFile.mock.calls;
    const prismaCall = writeFileCalls.find((call: any[]) => 
      call[0].includes('schema.prisma')
    );
    expect(prismaCall).toBeUndefined();
  });

  it('should generate .gitignore', async () => {
    await scaffoldProject(mockOptions);
    
    expect(mockFs.writeFile).toHaveBeenCalledWith(
      expect.stringContaining('.gitignore'),
      expect.any(String)
    );
  });

  it('should generate README.md', async () => {
    await scaffoldProject(mockOptions);
    
    expect(mockFs.writeFile).toHaveBeenCalledWith(
      expect.stringContaining('README.md'),
      expect.any(String)
    );
  });

  it('should initialize bun package manager', async () => {
    await scaffoldProject(mockOptions);
    
    expect(process.chdir).toHaveBeenCalledWith('./test-project');
  });

  it('should display progress messages', async () => {
    await scaffoldProject(mockOptions);
    
    const output = consoleOutput.join(' ');
    expect(output).toContain('Creating your project');
    expect(output).toContain('Project scaffolding completed');
  });

  it('should handle directory creation errors', async () => {
    const error = new Error('Permission denied');
    mockFs.ensureDir.mockImplementation(() => Promise.reject(error));
    
    await expect(scaffoldProject(mockOptions)).rejects.toThrow('Failed to create project directory');
  });

  it('should handle file generation errors', async () => {
    // Reset ensureDir mock to succeed
    mockFs.ensureDir.mockImplementation(() => Promise.resolve());
    
    const error = new Error('Disk full');
    mockFs.writeJson.mockImplementation(() => Promise.reject(error));
    
    await expect(scaffoldProject(mockOptions)).rejects.toThrow('Failed to generate project files');
  });
}); 