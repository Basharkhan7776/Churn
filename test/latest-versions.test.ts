import { describe, it, expect } from 'bun:test';
import { generatePackageJson } from '../src/templates/package-json';
import type { ProjectOptions } from '../src/types';

describe('Latest Versions Check', () => {
  const testConfigurations: Array<{ name: string; options: ProjectOptions }> = [
    {
      name: 'TypeScript with Express and Prisma',
      options: {
        projectName: 'test-app',
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
        docker: false,
        targetDir: './test-app',
      },
    },
    {
      name: 'TypeScript with WebSocket and Drizzle',
      options: {
        projectName: 'ws-app',
        language: 'ts',
        packageManager: 'npm',
        protocol: 'ws',
        orm: 'drizzle',
        database: 'postgresql',
        aliases: true,
        auth: 'session',
        testing: 'vitest',
        linting: true,
        docker: false,
        targetDir: './ws-app',
      },
    },
    {
      name: 'JavaScript with Express and MongoDB',
      options: {
        projectName: 'mongo-app',
        language: 'js',
        packageManager: 'yarn',
        protocol: 'http',
        cors: true,
        orm: 'mongoose',
        database: 'mongodb',
        aliases: false,
        auth: 'oauth',
        testing: 'none',
        linting: false,
        docker: false,
        targetDir: './mongo-app',
      },
    },
    {
      name: 'TypeScript with TypeORM',
      options: {
        projectName: 'typeorm-app',
        language: 'ts',
        packageManager: 'pnpm',
        protocol: 'http',
        orm: 'typeorm',
        database: 'mysql',
        aliases: true,
        linting: true,
        docker: false,
        targetDir: './typeorm-app',
      },
    },
    {
      name: 'TypeScript with Sequelize',
      options: {
        projectName: 'sequelize-app',
        language: 'ts',
        packageManager: 'bun',
        protocol: 'http',
        orm: 'sequelize',
        database: 'postgresql',
        aliases: true,
        linting: true,
        docker: false,
        targetDir: './sequelize-app',
      },
    },
  ];

  testConfigurations.forEach(({ name, options }) => {
    describe(name, () => {
      it('should use "latest" for all dependencies', () => {
        const packageJson = generatePackageJson(options);

        // Check all dependencies
        if (packageJson.dependencies) {
          Object.entries(packageJson.dependencies).forEach(([pkg, version]) => {
            expect(version).toBe('latest');
          });
        }

        // Check all devDependencies
        if (packageJson.devDependencies) {
          Object.entries(packageJson.devDependencies).forEach(([pkg, version]) => {
            expect(version).toBe('latest');
          });
        }
      });

      it('should not have any semver version strings', () => {
        const packageJson = generatePackageJson(options);
        const jsonString = JSON.stringify(packageJson);

        // Check for common semver patterns
        expect(jsonString).not.toContain('^');
        expect(jsonString).not.toContain('~');
        // Allow version numbers in other contexts (like node version in scripts)
        // but check that dependencies specifically use "latest"

        const allVersions = [
          ...Object.values(packageJson.dependencies || {}),
          ...Object.values(packageJson.devDependencies || {}),
        ];

        allVersions.forEach((version) => {
          expect(version).toBe('latest');
        });
      });

      it('should generate valid package.json structure', () => {
        const packageJson = generatePackageJson(options);

        expect(packageJson.name).toBeDefined();
        expect(packageJson.version).toBeDefined();
        expect(packageJson.scripts).toBeDefined();
        expect(packageJson.dependencies).toBeDefined();
      });
    });
  });

  describe('All ORMs use latest versions', () => {
    const orms: Array<{ orm: ProjectOptions['orm']; database?: ProjectOptions['database'] }> = [
      { orm: 'none' },
      { orm: 'prisma', database: 'postgresql' },
      { orm: 'drizzle', database: 'postgresql' },
      { orm: 'typeorm', database: 'postgresql' },
      { orm: 'sequelize', database: 'postgresql' },
      { orm: 'mongoose', database: 'mongodb' },
    ];

    orms.forEach(({ orm, database }) => {
      it(`should use latest versions for ${orm}`, () => {
        const options: ProjectOptions = {
          projectName: 'test',
          language: 'ts',
          packageManager: 'bun',
          protocol: 'http',
          orm,
          database,
          aliases: true,
          linting: false,
          docker: false,
          targetDir: './test',
        };

        const packageJson = generatePackageJson(options);
        const allVersions = [
          ...Object.values(packageJson.dependencies || {}),
          ...Object.values(packageJson.devDependencies || {}),
        ];

        allVersions.forEach((version) => {
          expect(version).toBe('latest');
        });
      });
    });
  });

  describe('All authentication methods use latest versions', () => {
    const authMethods: Array<ProjectOptions['auth']> = ['none', 'jwt', 'session', 'oauth'];

    authMethods.forEach((auth) => {
      it(`should use latest versions for ${auth} auth`, () => {
        const options: ProjectOptions = {
          projectName: 'test',
          language: 'ts',
          packageManager: 'bun',
          protocol: 'http',
          orm: 'none',
          aliases: true,
          auth,
          linting: false,
          docker: false,
          targetDir: './test',
        };

        const packageJson = generatePackageJson(options);
        const allVersions = [
          ...Object.values(packageJson.dependencies || {}),
          ...Object.values(packageJson.devDependencies || {}),
        ];

        allVersions.forEach((version) => {
          expect(version).toBe('latest');
        });
      });
    });
  });

  describe('All testing frameworks use latest versions', () => {
    const testingFrameworks: Array<ProjectOptions['testing']> = ['none', 'jest', 'vitest'];

    testingFrameworks.forEach((testing) => {
      it(`should use latest versions for ${testing}`, () => {
        const options: ProjectOptions = {
          projectName: 'test',
          language: 'ts',
          packageManager: 'bun',
          protocol: 'http',
          orm: 'none',
          aliases: true,
          testing,
          linting: false,
          docker: false,
          targetDir: './test',
        };

        const packageJson = generatePackageJson(options);
        const allVersions = [
          ...Object.values(packageJson.dependencies || {}),
          ...Object.values(packageJson.devDependencies || {}),
        ];

        allVersions.forEach((version) => {
          expect(version).toBe('latest');
        });
      });
    });
  });
});
