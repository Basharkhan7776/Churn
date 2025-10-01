#!/usr/bin/env bun

import { scaffoldProject } from './src/scaffold';
import type { ProjectOptions } from './src/types';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';

async function deepTest() {
  console.log(chalk.bold.blue('\n🔬 Deep Testing All Combinations\n'));

  const testCases: ProjectOptions[] = [
    // Test 1: Full feature TypeScript app
    {
      projectName: 'full-ts-app',
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
      targetDir: './full-ts-app'
    },
    // Test 2: Minimal JavaScript app
    {
      projectName: 'minimal-js-app',
      language: 'js',
      packageManager: 'npm',
      protocol: 'http',
      cors: false,
      orm: 'none',
      aliases: false,
      auth: 'none',
      testing: 'none',
      linting: false,
      docker: false,
      cicd: 'none',
      targetDir: './minimal-js-app'
    },
    // Test 3: TypeORM + MySQL
    {
      projectName: 'typeorm-mysql-app',
      language: 'ts',
      packageManager: 'yarn',
      protocol: 'http',
      cors: true,
      orm: 'typeorm',
      database: 'mysql',
      aliases: false,
      auth: 'session',
      testing: 'vitest',
      linting: true,
      docker: true,
      cicd: 'gitlab',
      targetDir: './typeorm-mysql-app'
    },
    // Test 4: Mongoose + MongoDB
    {
      projectName: 'mongoose-app',
      language: 'ts',
      packageManager: 'pnpm',
      protocol: 'http',
      cors: true,
      orm: 'mongoose',
      database: 'mongodb',
      aliases: true,
      auth: 'oauth',
      testing: 'jest',
      linting: true,
      docker: false,
      cicd: 'circleci',
      targetDir: './mongoose-app'
    },
    // Test 5: WebSocket with Sequelize
    {
      projectName: 'ws-sequelize-app',
      language: 'js',
      packageManager: 'yarn',
      protocol: 'ws',
      orm: 'sequelize',
      database: 'sqlite',
      aliases: false,
      auth: 'none',
      testing: 'none',
      linting: false,
      docker: true,
      cicd: 'none',
      targetDir: './ws-sequelize-app'
    }
  ];

  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;

  for (const options of testCases) {
    console.log(chalk.cyan(`\n📦 Testing: ${options.projectName}`));
    console.log(chalk.gray('─'.repeat(60)));

    try {
      // Clean up if exists
      if (await fs.pathExists(options.targetDir)) {
        await fs.remove(options.targetDir);
      }

      // Scaffold the project
      await scaffoldProject(options);

      // Deep validation
      const results = await validateProject(options);

      totalTests += results.total;
      passedTests += results.passed;
      failedTests += results.failed;

      if (results.failed === 0) {
        console.log(chalk.green(`  ✅ All checks passed (${results.passed}/${results.total})`));
      } else {
        console.log(chalk.red(`  ❌ Some checks failed (${results.passed}/${results.total})`));
        results.errors.forEach(err => console.log(chalk.red(`     - ${err}`)));
      }

      // Clean up
      await fs.remove(options.targetDir);

    } catch (error) {
      console.log(chalk.red(`  ❌ FAILED: ${error instanceof Error ? error.message : error}`));
      failedTests++;
      totalTests++;
    }
  }

  console.log(chalk.bold.blue('\n' + '='.repeat(60)));
  console.log(chalk.bold('\n📊 Deep Test Summary:\n'));
  console.log(chalk.white(`  Total Checks: ${totalTests}`));
  console.log(chalk.green(`  ✅ Passed: ${passedTests}`));
  if (failedTests > 0) {
    console.log(chalk.red(`  ❌ Failed: ${failedTests}`));
  }
  console.log();

  if (failedTests > 0) {
    process.exit(1);
  }
}

async function validateProject(options: ProjectOptions) {
  const errors: string[] = [];
  let total = 0;
  let passed = 0;

  // Check basic files
  const basicFiles = ['package.json', '.gitignore', 'README.md', '.env.example'];
  for (const file of basicFiles) {
    total++;
    const exists = await fs.pathExists(path.join(options.targetDir, file));
    if (exists) passed++;
    else errors.push(`Missing ${file}`);
  }

  // Check language-specific files
  if (options.language === 'ts') {
    total++;
    if (await fs.pathExists(path.join(options.targetDir, 'tsconfig.json'))) passed++;
    else errors.push('Missing tsconfig.json');

    total++;
    if (await fs.pathExists(path.join(options.targetDir, 'src/index.ts'))) passed++;
    else errors.push('Missing src/index.ts');
  } else {
    total++;
    if (await fs.pathExists(path.join(options.targetDir, 'index.js'))) passed++;
    else errors.push('Missing index.js');
  }

  // Check package.json content
  const pkgJson = await fs.readJson(path.join(options.targetDir, 'package.json'));

  // Check protocol dependencies
  if (options.protocol === 'http') {
    total++;
    if (pkgJson.dependencies.express) passed++;
    else errors.push('Missing express dependency');

    if (options.cors) {
      total++;
      if (pkgJson.dependencies.cors) passed++;
      else errors.push('Missing cors dependency (CORS enabled)');
    } else {
      total++;
      if (!pkgJson.dependencies.cors) passed++;
      else errors.push('Unexpected cors dependency (CORS disabled)');
    }
  } else if (options.protocol === 'ws') {
    total++;
    if (pkgJson.dependencies.ws) passed++;
    else errors.push('Missing ws dependency');
  }

  // Check ORM dependencies
  if (options.orm !== 'none') {
    total++;
    const ormPackages = {
      prisma: '@prisma/client',
      drizzle: 'drizzle-orm',
      typeorm: 'typeorm',
      sequelize: 'sequelize',
      mongoose: 'mongoose'
    };
    const expectedPkg = ormPackages[options.orm];
    if (pkgJson.dependencies[expectedPkg]) passed++;
    else errors.push(`Missing ${expectedPkg} dependency`);
  }

  // Check auth files
  if (options.auth && options.auth !== 'none') {
    total++;
    const authFile = path.join(options.targetDir, `src/auth/${options.auth}.ts`);
    if (await fs.pathExists(authFile)) passed++;
    else errors.push(`Missing auth file: src/auth/${options.auth}.ts`);
  }

  // Check testing files
  if (options.testing && options.testing !== 'none') {
    total++;
    const testFile = path.join(options.targetDir, `__tests__/api.test.${options.language === 'ts' ? 'ts' : 'js'}`);
    if (await fs.pathExists(testFile)) passed++;
    else errors.push('Missing test file');
  }

  // Check linting files
  if (options.linting) {
    total++;
    if (await fs.pathExists(path.join(options.targetDir, '.eslintrc.json'))) passed++;
    else errors.push('Missing .eslintrc.json');

    total++;
    if (await fs.pathExists(path.join(options.targetDir, '.prettierrc'))) passed++;
    else errors.push('Missing .prettierrc');
  }

  // Check Docker files
  if (options.docker) {
    total++;
    if (await fs.pathExists(path.join(options.targetDir, 'Dockerfile'))) passed++;
    else errors.push('Missing Dockerfile');

    total++;
    if (await fs.pathExists(path.join(options.targetDir, 'docker-compose.yml'))) passed++;
    else errors.push('Missing docker-compose.yml');
  }

  // Check CI/CD files
  if (options.cicd && options.cicd !== 'none') {
    total++;
    const cicdFiles = {
      github: '.github/workflows/ci-cd.yml',
      gitlab: '.gitlab-ci.yml',
      circleci: '.circleci/config.yml'
    };
    const cicdFile = cicdFiles[options.cicd];
    if (await fs.pathExists(path.join(options.targetDir, cicdFile))) passed++;
    else errors.push(`Missing ${cicdFile}`);
  }

  return { total, passed, failed: total - passed, errors };
}

deepTest().catch(console.error);
