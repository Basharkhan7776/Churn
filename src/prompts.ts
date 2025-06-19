import prompts from 'prompts';
import type { ProjectOptions } from './types';
import chalk from 'chalk';

export async function promptUser(): Promise<ProjectOptions | null> {
  console.log(chalk.blue('Let\'s create your Churn backend project! \n'));

  const response = await prompts([
    {
      type: 'text',
      name: 'projectName',
      message: 'What is your project name?',
      initial: 'my-churn-app',
      validate: (value: string) => {
        if (!value) return 'Project name is required';
        if (!/^[a-z0-9-]+$/.test(value)) {
          return 'Project name can only contain lowercase letters, numbers, and hyphens';
        }
        return true;
      }
    },
    {
      type: 'select',
      name: 'language',
      message: 'Which language would you like to use?',
      choices: [
        { title: 'TypeScript (recommended)', value: 'ts' },
        { title: 'JavaScript', value: 'js' }
      ],
      initial: 0
    },
    {
      type: 'select',
      name: 'packageManager',
      message: 'Which package manager would you like to use?',
      choices: [
        { title: 'Bun (recommended)', value: 'bun' },
        { title: 'Yarn', value: 'yarn' },
        { title: 'pnpm', value: 'pnpm' },
        { title: 'npm', value: 'npm' }
      ],
      initial: 0
    },
    {
      type: 'select',
      name: 'protocol',
      message: 'Which protocol would you like to use?',
      choices: [
        { title: 'HTTP (REST API)', value: 'http' },
        { title: 'WebSocket (Real-time)', value: 'ws' }
      ],
      initial: 0
    },
    {
      type: 'select',
      name: 'orm',
      message: 'Which ORM would you like to use?',
      choices: [
        { title: 'None (no database)', value: 'none' },
        { title: 'Prisma (recommended)', value: 'prisma' }
      ],
      initial: 1
    },
    {
      type: 'toggle',
      name: 'aliases',
      message: 'Would you like to use path aliases?',
      initial: true,
      active: 'Yes',
      inactive: 'No'
    }
  ]);

  if (!response.projectName) {
    return null;
  }

  const targetDir = `./${response.projectName}`;

  return {
    projectName: response.projectName,
    language: response.language,
    packageManager: response.packageManager,
    protocol: response.protocol,
    orm: response.orm,
    aliases: response.aliases,
    targetDir
  };
} 