#!/usr/bin/env bun

import { scaffoldProject } from './src/scaffold';
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';

async function verifyCORS() {
  console.log(chalk.bold.blue('\n🔍 Verifying CORS Optional Feature\n'));

  // Test 1: With CORS enabled
  console.log(chalk.cyan('Test 1: Creating project WITH CORS...'));
  const withCorsDir = './test-with-cors';

  await scaffoldProject({
    projectName: 'test-with-cors',
    language: 'ts',
    packageManager: 'bun',
    protocol: 'http',
    cors: true,
    orm: 'none',
    aliases: false,
    targetDir: withCorsDir
  });

  const withCorsIndex = await fs.readFile(path.join(withCorsDir, 'src/index.ts'), 'utf-8');
  const withCorsPackage = await fs.readJson(path.join(withCorsDir, 'package.json'));
  const withCorsEnv = await fs.readFile(path.join(withCorsDir, '.env.example'), 'utf-8');

  const hasCorsImport = withCorsIndex.includes("import cors from 'cors'");
  const hasCorsMiddleware = withCorsIndex.includes('app.use(cors())');
  const hasCorsDep = 'cors' in (withCorsPackage.dependencies || {});
  const hasCorsTypesDep = '@types/cors' in (withCorsPackage.devDependencies || {});
  const hasCorsEnv = withCorsEnv.includes('CORS_ORIGIN');

  console.log(chalk.gray('  - CORS import in index.ts:'), hasCorsImport ? chalk.green('✓') : chalk.red('✗'));
  console.log(chalk.gray('  - CORS middleware in index.ts:'), hasCorsMiddleware ? chalk.green('✓') : chalk.red('✗'));
  console.log(chalk.gray('  - CORS in dependencies:'), hasCorsDep ? chalk.green('✓') : chalk.red('✗'));
  console.log(chalk.gray('  - @types/cors in devDependencies:'), hasCorsTypesDep ? chalk.green('✓') : chalk.red('✗'));
  console.log(chalk.gray('  - CORS config in .env.example:'), hasCorsEnv ? chalk.green('✓') : chalk.red('✗'));

  const withCorsPass = hasCorsImport && hasCorsMiddleware && hasCorsDep && hasCorsTypesDep && hasCorsEnv;

  // Test 2: Without CORS
  console.log(chalk.cyan('\nTest 2: Creating project WITHOUT CORS...'));
  const withoutCorsDir = './test-without-cors';

  await scaffoldProject({
    projectName: 'test-without-cors',
    language: 'ts',
    packageManager: 'bun',
    protocol: 'http',
    cors: false,
    orm: 'none',
    aliases: false,
    targetDir: withoutCorsDir
  });

  const withoutCorsIndex = await fs.readFile(path.join(withoutCorsDir, 'src/index.ts'), 'utf-8');
  const withoutCorsPackage = await fs.readJson(path.join(withoutCorsDir, 'package.json'));
  const withoutCorsEnv = await fs.readFile(path.join(withoutCorsDir, '.env.example'), 'utf-8');

  const noCorsImport = !withoutCorsIndex.includes("import cors from 'cors'");
  const noCorsMiddleware = !withoutCorsIndex.includes('app.use(cors())');
  const noCorsDep = !('cors' in (withoutCorsPackage.dependencies || {}));
  const noCorsTypesDep = !('@types/cors' in (withoutCorsPackage.devDependencies || {}));
  const noCorsEnv = !withoutCorsEnv.includes('CORS_ORIGIN');

  console.log(chalk.gray('  - No CORS import in index.ts:'), noCorsImport ? chalk.green('✓') : chalk.red('✗'));
  console.log(chalk.gray('  - No CORS middleware in index.ts:'), noCorsMiddleware ? chalk.green('✓') : chalk.red('✗'));
  console.log(chalk.gray('  - No CORS in dependencies:'), noCorsDep ? chalk.green('✓') : chalk.red('✗'));
  console.log(chalk.gray('  - No @types/cors in devDependencies:'), noCorsTypesDep ? chalk.green('✓') : chalk.red('✗'));
  console.log(chalk.gray('  - No CORS config in .env.example:'), noCorsEnv ? chalk.green('✓') : chalk.red('✗'));

  const withoutCorsPass = noCorsImport && noCorsMiddleware && noCorsDep && noCorsTypesDep && noCorsEnv;

  // Clean up
  await fs.remove(withCorsDir);
  await fs.remove(withoutCorsDir);

  // Summary
  console.log(chalk.bold.blue('\n' + '='.repeat(60)));
  console.log(chalk.bold('\n📊 CORS Verification Summary:\n'));
  console.log(chalk.gray('  Test 1 (WITH CORS):'), withCorsPass ? chalk.green('✅ PASSED') : chalk.red('❌ FAILED'));
  console.log(chalk.gray('  Test 2 (WITHOUT CORS):'), withoutCorsPass ? chalk.green('✅ PASSED') : chalk.red('❌ FAILED'));
  console.log();

  if (withCorsPass && withoutCorsPass) {
    console.log(chalk.green.bold('🎉 All CORS tests passed!'));
    process.exit(0);
  } else {
    console.log(chalk.red.bold('❌ Some CORS tests failed'));
    process.exit(1);
  }
}

verifyCORS().catch(console.error);
