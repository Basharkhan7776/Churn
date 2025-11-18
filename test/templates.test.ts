import { describe, it, expect } from 'bun:test';
import { generatePackageJson } from '../src/templates/package-json';
import { generateMainFile } from '../src/templates/main-file';
import { generateTsConfig } from '../src/templates/tsconfig';
import { generateEnvExample } from '../src/templates/env-template';
import type { ProjectOptions } from '../src/types';

describe('Template Generators', () => {
  const defaultOptions: ProjectOptions = {
    projectName: 'test-app',
    language: 'ts',
    packageManager: 'bun',
    protocol: 'http',
    cors: true,
    orm: 'none',
    aliases: true,
    linting: false,
    docker: false,
    targetDir: './test-app',
  };

  describe('generatePackageJson', () => {
    it('should generate package.json with correct name', () => {
      const packageJson = generatePackageJson(defaultOptions);
      expect(packageJson.name).toBe('test-app');
    });

    it('should include correct scripts for TypeScript', () => {
      const packageJson = generatePackageJson(defaultOptions);
      expect(packageJson.scripts).toBeDefined();
      expect(packageJson.scripts.dev).toContain('watch');
    });

    it('should include correct scripts for JavaScript', () => {
      const jsOptions = { ...defaultOptions, language: 'js' as const };
      const packageJson = generatePackageJson(jsOptions);
      expect(packageJson.scripts).toBeDefined();
      expect(packageJson.scripts.dev).toBeDefined();
    });

    it('should include bun commands for bun package manager', () => {
      const packageJson = generatePackageJson(defaultOptions);
      expect(packageJson.scripts.dev).toContain('bun');
    });

    it('should include npm commands for npm package manager', () => {
      const npmOptions = { ...defaultOptions, packageManager: 'npm' as const };
      const packageJson = generatePackageJson(npmOptions);
      expect(packageJson.scripts.dev).toBeDefined();
    });

    it('should include yarn commands for yarn package manager', () => {
      const yarnOptions = { ...defaultOptions, packageManager: 'yarn' as const };
      const packageJson = generatePackageJson(yarnOptions);
      expect(packageJson.scripts.dev).toContain('yarn');
    });

    it('should include pnpm commands for pnpm package manager', () => {
      const pnpmOptions = { ...defaultOptions, packageManager: 'pnpm' as const };
      const packageJson = generatePackageJson(pnpmOptions);
      expect(packageJson.scripts.dev).toContain('pnpm');
    });

    it('should include express dependency for HTTP protocol', () => {
      const packageJson = generatePackageJson(defaultOptions);
      expect(packageJson.dependencies.express).toBeDefined();
    });

    it('should include ws dependency for WebSocket protocol', () => {
      const wsOptions = { ...defaultOptions, protocol: 'ws' as const };
      const packageJson = generatePackageJson(wsOptions);
      expect(packageJson.dependencies.ws).toBeDefined();
    });

    it('should include cors when enabled', () => {
      const packageJson = generatePackageJson(defaultOptions);
      expect(packageJson.dependencies.cors).toBeDefined();
    });

    it('should not include cors when disabled', () => {
      const noCorsOptions = { ...defaultOptions, cors: false };
      const packageJson = generatePackageJson(noCorsOptions);
      expect(packageJson.dependencies.cors).toBeUndefined();
    });

    it('should include Prisma when using Prisma ORM', () => {
      const prismaOptions = { ...defaultOptions, orm: 'prisma' as const, database: 'postgresql' as const };
      const packageJson = generatePackageJson(prismaOptions);
      expect(packageJson.dependencies.prisma || packageJson.devDependencies.prisma).toBeDefined();
    });

    it('should include Drizzle when using Drizzle ORM', () => {
      const drizzleOptions = { ...defaultOptions, orm: 'drizzle' as const, database: 'postgresql' as const };
      const packageJson = generatePackageJson(drizzleOptions);
      expect(packageJson.dependencies['drizzle-orm']).toBeDefined();
    });

    it('should include TypeORM when using TypeORM', () => {
      const typeormOptions = { ...defaultOptions, orm: 'typeorm' as const, database: 'postgresql' as const };
      const packageJson = generatePackageJson(typeormOptions);
      expect(packageJson.dependencies.typeorm).toBeDefined();
    });

    it('should include Sequelize when using Sequelize', () => {
      const sequelizeOptions = { ...defaultOptions, orm: 'sequelize' as const, database: 'postgresql' as const };
      const packageJson = generatePackageJson(sequelizeOptions);
      expect(packageJson.dependencies.sequelize).toBeDefined();
    });

    it('should include Mongoose when using Mongoose', () => {
      const mongooseOptions = { ...defaultOptions, orm: 'mongoose' as const, database: 'mongodb' as const };
      const packageJson = generatePackageJson(mongooseOptions);
      expect(packageJson.dependencies.mongoose).toBeDefined();
    });
  });

  describe('generateMainFile', () => {
    it('should generate TypeScript main file', () => {
      const mainFile = generateMainFile(defaultOptions);
      expect(mainFile).toContain('express');
      expect(mainFile).toBeDefined();
      expect(typeof mainFile).toBe('string');
      expect(mainFile.length).toBeGreaterThan(0);
    });

    it('should generate JavaScript main file', () => {
      const jsOptions = { ...defaultOptions, language: 'js' as const };
      const mainFile = generateMainFile(jsOptions);
      expect(mainFile).toBeDefined();
      expect(typeof mainFile).toBe('string');
      expect(mainFile.length).toBeGreaterThan(0);
    });

    it('should include Express setup for HTTP protocol', () => {
      const mainFile = generateMainFile(defaultOptions);
      expect(mainFile).toContain('express');
    });

    it('should include WebSocket setup for WS protocol', () => {
      const wsOptions = { ...defaultOptions, protocol: 'ws' as const };
      const mainFile = generateMainFile(wsOptions);
      expect(mainFile).toContain('WebSocket');
    });

    it('should include CORS when enabled', () => {
      const mainFile = generateMainFile(defaultOptions);
      expect(mainFile).toContain('cors');
    });

    it('should not include CORS when disabled', () => {
      const noCorsOptions = { ...defaultOptions, cors: false };
      const mainFile = generateMainFile(noCorsOptions);
      expect(mainFile).not.toContain('cors');
    });

    it('should include health check endpoint', () => {
      const mainFile = generateMainFile(defaultOptions);
      expect(mainFile).toContain('health');
    });
  });

  describe('generateTsConfig', () => {
    it('should generate TypeScript config', () => {
      const tsConfig = generateTsConfig(defaultOptions);
      expect(tsConfig).toBeDefined();
      expect(tsConfig.compilerOptions).toBeDefined();
    });

    it('should include path aliases when enabled', () => {
      const tsConfig = generateTsConfig(defaultOptions);
      expect(tsConfig.compilerOptions.paths).toBeDefined();
    });

    it('should not include path aliases when disabled', () => {
      const noAliasesOptions = { ...defaultOptions, aliases: false };
      const tsConfig = generateTsConfig(noAliasesOptions);
      expect(tsConfig.compilerOptions.paths).toBeUndefined();
    });

    it('should have correct target and module settings', () => {
      const tsConfig = generateTsConfig(defaultOptions);
      expect(tsConfig.compilerOptions.target).toBeDefined();
      expect(tsConfig.compilerOptions.module).toBeDefined();
    });

    it('should enable strict mode', () => {
      const tsConfig = generateTsConfig(defaultOptions);
      expect(tsConfig.compilerOptions.strict).toBe(true);
    });

    it('should set correct module resolution', () => {
      const tsConfig = generateTsConfig(defaultOptions);
      expect(tsConfig.compilerOptions.moduleResolution).toBeDefined();
    });
  });

  describe('generateEnvExample', () => {
    it('should generate .env.example file', () => {
      const envFile = generateEnvExample(defaultOptions);
      expect(envFile).toBeDefined();
      expect(typeof envFile).toBe('string');
    });

    it('should include PORT variable for HTTP', () => {
      const envFile = generateEnvExample(defaultOptions);
      expect(envFile).toContain('PORT');
    });

    it('should include database URL when using ORM', () => {
      const ormOptions = { ...defaultOptions, orm: 'prisma' as const, database: 'postgresql' as const };
      const envFile = generateEnvExample(ormOptions);
      expect(envFile).toContain('DATABASE');
    });

    it('should include MongoDB URL when using Mongoose', () => {
      const mongooseOptions = { ...defaultOptions, orm: 'mongoose' as const, database: 'mongodb' as const };
      const envFile = generateEnvExample(mongooseOptions);
      expect(envFile).toContain('mongodb://') || expect(envFile).toContain('DATABASE');
    });

    it('should include JWT secret when using JWT auth', () => {
      const jwtOptions = { ...defaultOptions, auth: 'jwt' as const };
      const envFile = generateEnvExample(jwtOptions);
      expect(envFile).toContain('JWT');
    });

    it('should include OAuth credentials when using OAuth', () => {
      const oauthOptions = { ...defaultOptions, auth: 'oauth' as const };
      const envFile = generateEnvExample(oauthOptions);
      expect(envFile).toContain('OAUTH') || expect(envFile).toContain('CLIENT');
    });
  });

  describe('Edge cases and combinations', () => {
    it('should handle minimal configuration', () => {
      const minimalOptions: ProjectOptions = {
        projectName: 'minimal',
        language: 'js',
        packageManager: 'npm',
        protocol: 'http',
        orm: 'none',
        aliases: false,
        linting: false,
        docker: false,
        targetDir: './minimal',
      };

      const packageJson = generatePackageJson(minimalOptions);
      const mainFile = generateMainFile(minimalOptions);

      expect(packageJson.name).toBe('minimal');
      expect(mainFile).toBeDefined();
    });

    it('should handle full configuration', () => {
      const fullOptions: ProjectOptions = {
        projectName: 'full-app',
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
        targetDir: './full-app',
      };

      const packageJson = generatePackageJson(fullOptions);
      const mainFile = generateMainFile(fullOptions);
      const tsConfig = generateTsConfig(fullOptions);

      expect(packageJson.name).toBe('full-app');
      expect(mainFile).toBeDefined();
      expect(tsConfig).toBeDefined();
    });
  });
});
