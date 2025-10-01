#!/usr/bin/env bun

import { scaffoldProject } from './src/scaffold';
import type { ProjectOptions } from './src/types';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';

async function testCLI() {
  console.log(chalk.bold.blue('\n🧪 Testing Create Churn CLI\n'));

  const testCases: Array<{ name: string; options: ProjectOptions }> = [
    {
      name: 'TypeScript + Bun + HTTP + CORS + Drizzle + PostgreSQL + JWT + Jest + Linting + Docker + GitHub Actions',
      options: {
        projectName: 'test-drizzle-app',
        language: 'ts',
        packageManager: 'bun',
        protocol: 'http',
        cors: true,
        orm: 'drizzle',
        database: 'postgresql',
        aliases: true,
        auth: 'jwt',
        testing: 'jest',
        linting: true,
        docker: true,
        cicd: 'github',
        targetDir: './test-drizzle-app'
      }
    },
    {
      name: 'TypeScript + npm + HTTP (no CORS) + TypeORM + MySQL + OAuth + Vitest',
      options: {
        projectName: 'test-typeorm-app',
        language: 'ts',
        packageManager: 'npm',
        protocol: 'http',
        cors: false,
        orm: 'typeorm',
        database: 'mysql',
        aliases: false,
        auth: 'oauth',
        testing: 'vitest',
        linting: false,
        docker: false,
        cicd: 'none',
        targetDir: './test-typeorm-app'
      }
    },
    {
      name: 'JavaScript + yarn + WebSocket + Sequelize + SQLite + Session',
      options: {
        projectName: 'test-sequelize-app',
        language: 'js',
        packageManager: 'yarn',
        protocol: 'ws',
        orm: 'sequelize',
        database: 'sqlite',
        aliases: false,
        auth: 'session',
        testing: 'none',
        linting: true,
        docker: true,
        cicd: 'gitlab',
        targetDir: './test-sequelize-app'
      }
    },
    {
      name: 'TypeScript + pnpm + HTTP + CORS + Mongoose + MongoDB',
      options: {
        projectName: 'test-mongoose-app',
        language: 'ts',
        packageManager: 'pnpm',
        protocol: 'http',
        cors: true,
        orm: 'mongoose',
        database: 'mongodb',
        aliases: true,
        auth: 'none',
        testing: 'vitest',
        linting: true,
        docker: false,
        cicd: 'circleci',
        targetDir: './test-mongoose-app'
      }
    },
    {
      name: 'TypeScript + Bun + HTTP + CORS + Prisma (Original)',
      options: {
        projectName: 'test-prisma-app',
        language: 'ts',
        packageManager: 'bun',
        protocol: 'http',
        cors: true,
        orm: 'prisma',
        aliases: true,
        auth: 'jwt',
        testing: 'jest',
        linting: true,
        docker: true,
        cicd: 'github',
        targetDir: './test-prisma-app'
      }
    }
  ];

  let passedTests = 0;
  let failedTests = 0;

  for (const testCase of testCases) {
    console.log(chalk.cyan(`\n📦 Testing: ${testCase.name}`));
    console.log(chalk.gray('─'.repeat(60)));

    try {
      // Clean up if exists
      if (await fs.pathExists(testCase.options.targetDir)) {
        await fs.remove(testCase.options.targetDir);
      }

      // Scaffold the project (without installing dependencies to speed up)
      await scaffoldProject(testCase.options);

      // Verify generated files
      const requiredFiles = [
        'package.json',
        '.gitignore',
        'README.md',
        '.env.example'
      ];

      if (testCase.options.language === 'ts') {
        requiredFiles.push('tsconfig.json');
        requiredFiles.push('src/index.ts');
      } else {
        requiredFiles.push('index.js');
      }

      // Check ORM-specific files
      if (testCase.options.orm === 'prisma') {
        requiredFiles.push('prisma/schema.prisma');
      } else if (testCase.options.orm === 'drizzle') {
        requiredFiles.push('src/db/schema.ts');
        requiredFiles.push('drizzle.config.ts');
      } else if (testCase.options.orm === 'typeorm') {
        requiredFiles.push('src/config/database.ts');
        requiredFiles.push('src/entities/User.ts');
      } else if (testCase.options.orm === 'sequelize') {
        requiredFiles.push('src/config/database.ts');
        requiredFiles.push('src/models/User.ts');
      } else if (testCase.options.orm === 'mongoose') {
        requiredFiles.push('src/config/database.ts');
        requiredFiles.push('src/models/User.ts');
      }

      // Check auth files
      if (testCase.options.auth && testCase.options.auth !== 'none') {
        requiredFiles.push(`src/auth/${testCase.options.auth}.ts`);
      }

      // Check testing files
      if (testCase.options.testing && testCase.options.testing !== 'none') {
        requiredFiles.push('__tests__/api.test.' + (testCase.options.language === 'ts' ? 'ts' : 'js'));
      }

      // Check linting files
      if (testCase.options.linting) {
        requiredFiles.push('.eslintrc.json');
        requiredFiles.push('.prettierrc');
      }

      // Check Docker files
      if (testCase.options.docker) {
        requiredFiles.push('Dockerfile');
        requiredFiles.push('docker-compose.yml');
        requiredFiles.push('.dockerignore');
      }

      // Check CI/CD files
      if (testCase.options.cicd === 'github') {
        requiredFiles.push('.github/workflows/ci-cd.yml');
      } else if (testCase.options.cicd === 'gitlab') {
        requiredFiles.push('.gitlab-ci.yml');
      } else if (testCase.options.cicd === 'circleci') {
        requiredFiles.push('.circleci/config.yml');
      }

      let missingFiles: string[] = [];
      for (const file of requiredFiles) {
        const filePath = path.join(testCase.options.targetDir, file);
        if (!await fs.pathExists(filePath)) {
          missingFiles.push(file);
        }
      }

      if (missingFiles.length > 0) {
        console.log(chalk.red(`  ❌ FAILED: Missing files:`));
        missingFiles.forEach(file => console.log(chalk.red(`     - ${file}`)));
        failedTests++;
      } else {
        console.log(chalk.green(`  ✅ PASSED: All files generated correctly`));

        // Verify package.json content
        const pkgJson = await fs.readJson(path.join(testCase.options.targetDir, 'package.json'));
        console.log(chalk.gray(`     Name: ${pkgJson.name}`));
        console.log(chalk.gray(`     Dependencies: ${Object.keys(pkgJson.dependencies || {}).length}`));
        console.log(chalk.gray(`     DevDependencies: ${Object.keys(pkgJson.devDependencies || {}).length}`));

        passedTests++;
      }

      // Clean up test directory
      await fs.remove(testCase.options.targetDir);

    } catch (error) {
      console.log(chalk.red(`  ❌ FAILED: ${error instanceof Error ? error.message : error}`));
      failedTests++;
    }
  }

  console.log(chalk.bold.blue('\n' + '='.repeat(60)));
  console.log(chalk.bold(`\n📊 Test Summary:`));
  console.log(chalk.green(`  ✅ Passed: ${passedTests}/${testCases.length}`));
  if (failedTests > 0) {
    console.log(chalk.red(`  ❌ Failed: ${failedTests}/${testCases.length}`));
  }
  console.log();

  if (failedTests > 0) {
    process.exit(1);
  }
}

testCLI().catch(console.error);
