#!/usr/bin/env node

import { promptUser } from './src/prompts';
import { scaffoldProject } from './src/scaffold';
import { showWelcome, showSuccess } from './src/utils';
import { startAnimation, stopAnimation } from './src/animation';
import chalk from 'chalk';

async function main() {
  try {
    // Clear screen first
    console.clear();

    // Show welcome message
    showWelcome();

    // Get user input
    const options = await promptUser();
    
    if (!options) {
      console.log(chalk.yellow('Operation cancelled.'));
      process.exit(0);
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