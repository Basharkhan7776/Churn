import { describe, it, expect } from 'bun:test';
import { generatePackageJson } from '../src/templates/package-json';
import type { ProjectOptions } from '../src/types';

describe('generatePackageJson', () => {
  const baseOptions: ProjectOptions = {
    projectName: 'test-project',
    language: 'ts',
    packageManager: 'bun',
    protocol: 'http',
    orm: 'prisma',
    aliases: true,
    targetDir: './test-project'
  };

  it('should generate package.json with correct name', () => {
    const result = generatePackageJson(baseOptions);
    
    expect(result.name).toBe('test-project');
  });

  it('should include TypeScript dependencies when language is ts', () => {
    const result = generatePackageJson(baseOptions);
    
    expect(result.devDependencies).toHaveProperty('typescript');
    if (baseOptions.packageManager === 'bun') {
      expect(result.devDependencies).toHaveProperty('bun-types');
    } else {
      expect(result.devDependencies).toHaveProperty('@types/bun');
    }
  });

  it('should not include TypeScript dependencies when language is js', () => {
    const jsOptions = { ...baseOptions, language: 'js' as const };
    const result = generatePackageJson(jsOptions);
    
    expect(result.devDependencies).not.toHaveProperty('typescript');
    expect(result.devDependencies).not.toHaveProperty('@types/bun');
  });

  it('should include Prisma dependencies when orm is prisma', () => {
    const result = generatePackageJson(baseOptions);
    
    expect(result.dependencies).toHaveProperty('@prisma/client');
    expect(result.devDependencies).toHaveProperty('prisma');
  });

  it('should not include Prisma dependencies when orm is none', () => {
    const noPrismaOptions = { ...baseOptions, orm: 'none' as const };
    const result = generatePackageJson(noPrismaOptions);
    
    expect(result.dependencies).not.toHaveProperty('@prisma/client');
    expect(result.devDependencies).not.toHaveProperty('prisma');
  });

  it('should include HTTP dependencies when protocol is http', () => {
    const result = generatePackageJson(baseOptions);
    
    expect(result.dependencies).toHaveProperty('express');
    expect(result.dependencies).toHaveProperty('cors');
  });

  it('should include WebSocket dependencies when protocol is ws', () => {
    const wsOptions = { ...baseOptions, protocol: 'ws' as const };
    const result = generatePackageJson(wsOptions);
    
    expect(result.dependencies).toHaveProperty('ws');
  });

  it('should include path alias configuration when aliases is true and language is ts', () => {
    const result = generatePackageJson(baseOptions);
    
    expect(result.devDependencies).toHaveProperty('tsc-alias');
  });

  it('should not include path alias configuration when aliases is false', () => {
    const noAliasesOptions = { ...baseOptions, aliases: false };
    const result = generatePackageJson(noAliasesOptions);
    
    expect(result.devDependencies).not.toHaveProperty('tsc-alias');
  });

  it('should include correct scripts', () => {
    const result = generatePackageJson(baseOptions);
    
    expect(result.scripts).toHaveProperty('dev');
    expect(result.scripts).toHaveProperty('build');
    expect(result.scripts).toHaveProperty('start');
    expect(result.scripts).toHaveProperty('test');
  });

  it('should include Prisma scripts when using Prisma', () => {
    const result = generatePackageJson(baseOptions);
    
    expect(result.scripts).toHaveProperty('db:generate');
    expect(result.scripts).toHaveProperty('db:push');
    expect(result.scripts).toHaveProperty('db:migrate');
    expect(result.scripts).toHaveProperty('db:studio');
  });

  it('should not include Prisma scripts when not using Prisma', () => {
    const noPrismaOptions = { ...baseOptions, orm: 'none' as const };
    const result = generatePackageJson(noPrismaOptions);
    
    expect(result.scripts).not.toHaveProperty('db:generate');
    expect(result.scripts).not.toHaveProperty('db:push');
    expect(result.scripts).not.toHaveProperty('db:migrate');
    expect(result.scripts).not.toHaveProperty('db:studio');
  });

  it('should include correct main entry point for TypeScript', () => {
    const result = generatePackageJson(baseOptions);
    
    expect(result.main).toBe('dist/index.js');
  });

  it('should include correct main entry point for JavaScript', () => {
    const jsOptions = { ...baseOptions, language: 'js' as const };
    const result = generatePackageJson(jsOptions);
    
    expect(result.main).toBe('index.js');
  });

  it('should include correct type field for TypeScript', () => {
    const result = generatePackageJson(baseOptions);
    
    expect(result.type).toBe('module');
  });

  it('should include correct type field for JavaScript', () => {
    const jsOptions = { ...baseOptions, language: 'js' as const };
    const result = generatePackageJson(jsOptions);
    
    expect(result.type).toBe('module');
  });

  it('should include bun as a dependency only when using bun', () => {
    const result = generatePackageJson(baseOptions);
    
    expect(result.dependencies).toHaveProperty('bun');
  });

  it('should not include bun as a dependency when using npm', () => {
    const npmOptions = { ...baseOptions, packageManager: 'npm' as const };
    const result = generatePackageJson(npmOptions);
    
    expect(result.dependencies).not.toHaveProperty('bun');
  });

  it('should include tsx for non-bun package managers with TypeScript', () => {
    const npmOptions = { ...baseOptions, packageManager: 'npm' as const };
    const result = generatePackageJson(npmOptions);
    
    expect(result.devDependencies).toHaveProperty('tsx');
  });

  it('should not include tsx for bun package manager with TypeScript', () => {
    const result = generatePackageJson(baseOptions);
    
    expect(result.devDependencies).not.toHaveProperty('tsx');
  });

  it('should include correct description for TypeScript', () => {
    const result = generatePackageJson(baseOptions);
    
    expect(result.description).toContain('TypeScript');
  });

  it('should include correct description for JavaScript', () => {
    const jsOptions = { ...baseOptions, language: 'js' as const };
    const result = generatePackageJson(jsOptions);
    
    expect(result.description).toContain('JavaScript');
  });

  it('should include @types/express and @types/cors in devDependencies when using TypeScript and HTTP', () => {
    const result = generatePackageJson({ ...baseOptions, language: 'ts', protocol: 'http' });
    expect(result.devDependencies).toHaveProperty('@types/express');
    expect(result.devDependencies).toHaveProperty('@types/cors');
  });

  it('should include @types/ws in devDependencies when using TypeScript and WebSocket', () => {
    const result = generatePackageJson({ ...baseOptions, language: 'ts', protocol: 'ws' });
    expect(result.devDependencies).toHaveProperty('@types/ws');
  });

  it('should set rootDir to src and outDir to dist in build script for yarn', () => {
    const yarnOptions = { ...baseOptions, packageManager: 'yarn' as const };
    const result = generatePackageJson(yarnOptions);
    expect(result.scripts.build).toContain('--rootDir src --outDir dist');
  });

  it('should set rootDir to src and outDir to dist in build script for pnpm', () => {
    const pnpmOptions = { ...baseOptions, packageManager: 'pnpm' as const };
    const result = generatePackageJson(pnpmOptions);
    expect(result.scripts.build).toContain('--rootDir src --outDir dist');
  });

  it('should set rootDir to src and outDir to dist in build script for npm', () => {
    const npmOptions = { ...baseOptions, packageManager: 'npm' as const };
    const result = generatePackageJson(npmOptions);
    expect(result.scripts.build).toContain('--rootDir src --outDir dist');
  });
}); 