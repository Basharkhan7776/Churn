import prompts from 'prompts';
import type { ProjectOptions } from './types';
import chalk from 'chalk';
import { startAnimation, stopAnimation } from './animation';

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
      type: (prev: string) => prev === 'http' ? 'toggle' : null,
      name: 'cors',
      message: 'Would you like to enable CORS?',
      initial: true,
      active: 'Yes',
      inactive: 'No'
    },
    {
      type: 'select',
      name: 'orm',
      message: 'Which ORM/ODM would you like to use?',
      choices: [
        { title: 'None (no database)', value: 'none' },
        { title: 'Prisma (recommended for SQL)', value: 'prisma' },
        { title: 'Drizzle (lightweight TypeScript ORM)', value: 'drizzle' },
        { title: 'TypeORM (mature, feature-rich)', value: 'typeorm' },
        { title: 'Sequelize (popular SQL ORM)', value: 'sequelize' },
        { title: 'Mongoose (MongoDB ODM)', value: 'mongoose' }
      ],
      initial: 1
    },
    {
      type: (prev: string) => prev !== 'none' && prev !== 'mongoose' ? 'select' : null,
      name: 'database',
      message: 'Which database would you like to use?',
      choices: [
        { title: 'PostgreSQL (recommended)', value: 'postgresql' },
        { title: 'MySQL', value: 'mysql' },
        { title: 'SQLite (for development)', value: 'sqlite' }
      ],
      initial: 0
    },
    {
      type: (prev: any, values: any) => values.orm === 'mongoose' ? 'select' : null,
      name: 'database',
      message: 'MongoDB is selected for Mongoose',
      choices: [
        { title: 'MongoDB', value: 'mongodb' }
      ],
      initial: 0
    },
    {
      type: 'toggle',
      name: 'aliases',
      message: 'Would you like to use path aliases?',
      initial: true,
      active: 'Yes',
      inactive: 'No'
    },
    {
      type: 'select',
      name: 'auth',
      message: 'Which authentication would you like to use?',
      choices: [
        { title: 'None', value: 'none' },
        { title: 'JWT (JSON Web Tokens)', value: 'jwt' },
        { title: 'OAuth (Google, GitHub)', value: 'oauth' },
        { title: 'Session-based', value: 'session' }
      ],
      initial: 0
    },
    {
      type: 'select',
      name: 'testing',
      message: 'Which testing framework would you like to use?',
      choices: [
        { title: 'None', value: 'none' },
        { title: 'Jest (popular, full-featured)', value: 'jest' },
        { title: 'Vitest (fast, Vite-powered)', value: 'vitest' }
      ],
      initial: 0
    },
    {
      type: 'toggle',
      name: 'linting',
      message: 'Would you like to add ESLint & Prettier?',
      initial: true,
      active: 'Yes',
      inactive: 'No'
    },
    {
      type: 'toggle',
      name: 'docker',
      message: 'Would you like to add Docker support?',
      initial: false,
      active: 'Yes',
      inactive: 'No'
    },
    {
      type: 'select',
      name: 'cicd',
      message: 'Which CI/CD would you like to configure?',
      choices: [
        { title: 'None', value: 'none' },
        { title: 'GitHub Actions', value: 'github' },
        { title: 'GitLab CI', value: 'gitlab' },
        { title: 'CircleCI', value: 'circleci' }
      ],
      initial: 0
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
    cors: response.cors,
    orm: response.orm,
    database: response.database,
    aliases: response.aliases,
    auth: response.auth,
    testing: response.testing,
    linting: response.linting,
    docker: response.docker,
    cicd: response.cicd,
    targetDir
  };
} 