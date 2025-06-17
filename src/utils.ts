import chalk from 'chalk';
import type { ProjectOptions } from './types';

export function showWelcome() {
  console.log(chalk.bold.blue(`
╔══════════════════════════════════════════════════════════════╗
║                    🚀 Create Churn CLI                      ║
║                                                              ║
║  Create customizable backend projects with ease!            ║
╚══════════════════════════════════════════════════════════════╝
  `));
}

export function showSuccess(options: ProjectOptions) {
  console.log(chalk.bold.green(`
╔══════════════════════════════════════════════════════════════╗
║                    ✅ Project Created!                       ║
╚══════════════════════════════════════════════════════════════╝
  `));

  console.log(chalk.green(`🎉 Your Churn backend project "${options.projectName}" has been created successfully!`));
  console.log();

  console.log(chalk.blue('📁 Project structure:'));
  console.log(chalk.gray(`   ${options.targetDir}/`));
  console.log();

  console.log(chalk.blue('🚀 Next steps:'));
  console.log(chalk.white(`   1. cd ${options.projectName}`));
  console.log(chalk.white(`   2. ${getInstallCommand(options.packageManager)}`));
  console.log(chalk.white(`   3. ${getStartCommand(options.packageManager)}`));
  console.log();

  if (options.orm === 'prisma') {
    console.log(chalk.yellow('💡 Don\'t forget to:'));
    console.log(chalk.white('   - Set up your database connection'));
    console.log(chalk.white('   - Run database migrations'));
    console.log();
  }

  console.log(chalk.blue('📚 Documentation:'));
  console.log(chalk.white('   https://github.com/your-org/churn'));
  console.log();
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