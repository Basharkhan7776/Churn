import chalk from 'chalk';
import type { ProjectOptions } from './types';

export function showWelcome() {
  console.log(chalk.bold.cyan(`
   ______                __          ________
  / ____/_______  ____ _/ /____     / ____/ /_  __  ___________
 / /   / ___/ _ \\/ __ \`/ __/ _ \\   / /   / __ \\/ / / / ___/ __ \\
/ /___/ /  /  __/ /_/ / /_/  __/  / /___/ / / / /_/ / /  / / / /
\\____/_/   \\___/\\__,_/\\__/\\___/   \\____/_/ /_/\\__,_/_/  /_/ /_/
  `));
  console.log(chalk.white.bold('           Create customizable backend projects with ease!\n'));
}

export function showSuccess(options: ProjectOptions) {
  console.log(chalk.bold.green(`
 ____                              _
/ ___| _   _  ___ ___ ___  ___ ___| |
\\___ \\| | | |/ __/ __/ _ \\/ __/ __| |
 ___) | |_| | (_| (_|  __/\\__ \\__ \\_|
|____/ \\__,_|\\___\\___\\___||___/___(_)
  `));

  console.log(chalk.green(`\n[+] Your Churn backend project "${options.projectName}" has been created successfully!\n`));

  console.log(chalk.blue('[*] Project structure:'));
  console.log(chalk.gray(`    ${options.targetDir}/\n`));

  console.log(chalk.blue('[>] Next steps:'));
  console.log(chalk.white(`    1. cd ${options.projectName}`));
  console.log(chalk.white(`    2. ${getInstallCommand(options.packageManager)}`));
  console.log(chalk.white(`    3. ${getStartCommand(options.packageManager)}\n`));

  if (options.orm === 'prisma') {
    console.log(chalk.yellow('[!] Don\'t forget to:'));
    console.log(chalk.white('    - Set up your database connection'));
    console.log(chalk.white('    - Run database migrations\n'));
  }

  console.log(chalk.blue('[i] Documentation:'));
  console.log(chalk.white('    https://github.com/Basharkhan7776/Churn\n'));
}

function getInstallCommand(packageManager: string): string {
  switch (packageManager) {
    case 'bun': return 'bun install';
    case 'yarn': return 'yarn install';
    case 'pnpm': return 'pnpm install';
    case 'npm': return 'npm install';
    default: return 'bun install';
  }
}

function getStartCommand(packageManager: string): string {
  switch (packageManager) {
    case 'bun': return 'bun run dev';
    case 'yarn': return 'yarn dev';
    case 'pnpm': return 'pnpm dev';
    case 'npm': return 'npm run dev';
    default: return 'bun run dev';
  }
} 