#!/usr/bin/env node

import { promptUser } from './src/prompts';
import { scaffoldProject } from './src/scaffold';
import { showWelcome, showSuccess } from './src/utils';
import { startAnimation, stopAnimation } from './src/animation';
import { parseFlags, convertFlagsToOptions, hasFlags } from './src/flags';
import chalk from 'chalk';

async function main() {
  try {
    // Check if flags are provided
    const usingFlags = hasFlags(process.argv);
    let options;

    if (usingFlags) {
      // Non-interactive mode with flags
      const parsedFlags = parseFlags(process.argv);

      // If parseFlags returns null, it means --help was used or invalid flag
      if (!parsedFlags) {
        process.exit(0);
      }

      options = convertFlagsToOptions(parsedFlags);

      // Show a brief message about what's being created
      console.log(chalk.blue(`\nCreating ${chalk.bold(options.projectName)} with the following configuration:`));
      console.log(chalk.gray(`  Language: ${options.language}`));
      console.log(chalk.gray(`  Package Manager: ${options.packageManager}`));
      console.log(chalk.gray(`  Protocol: ${options.protocol}`));
      if (options.cors !== undefined) console.log(chalk.gray(`  CORS: ${options.cors ? 'enabled' : 'disabled'}`));
      console.log(chalk.gray(`  ORM: ${options.orm}`));
      if (options.database) console.log(chalk.gray(`  Database: ${options.database}`));
      console.log(chalk.gray(`  Path Aliases: ${options.aliases ? 'enabled' : 'disabled'}`));
      if (options.auth) console.log(chalk.gray(`  Authentication: ${options.auth}`));
      if (options.testing) console.log(chalk.gray(`  Testing: ${options.testing}`));
      console.log(chalk.gray(`  Linting: ${options.linting ? 'enabled' : 'disabled'}`));
      console.log(chalk.gray(`  Docker: ${options.docker ? 'enabled' : 'disabled'}`));
      if (options.cicd) console.log(chalk.gray(`  CI/CD: ${options.cicd}`));
      console.log('');
    } else {
      // Interactive mode with prompts
      // Clear screen first
      console.clear();

      // Show welcome message
      showWelcome();

      // Get user input
      options = await promptUser();

      if (!options) {
        console.log(chalk.yellow('Operation cancelled.'));
        process.exit(0);
      }
    }

    // Scaffold the project
    await scaffoldProject(options);

    // Show success message
    showSuccess(options);

  } catch (error) {
    console.error(chalk.red('Error:'), error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

// Run the CLI
main();