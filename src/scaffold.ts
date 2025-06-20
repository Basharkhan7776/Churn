import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';
import chalk from 'chalk';
import type { ProjectOptions } from './types';
import { generatePackageJson } from './templates/package-json';
import { generateMainFile } from './templates/main-file';
import { generateTsConfig } from './templates/tsconfig';
import { generatePrismaSchema } from './templates/prisma-schema';

export async function scaffoldProject(options: ProjectOptions): Promise<void> {
  console.log(chalk.blue('➡️ Creating your project...\n'));

  // Create project directory
  await createProjectDirectory(options.targetDir);

  // Generate project files
  await generateProjectFiles(options);

  // Initialize package manager
  await initializePackageManager(options);

  console.log(chalk.green('✅ Project scaffolding completed!\n'));
}

async function createProjectDirectory(targetDir: string): Promise<void> {
  try {
    await fs.ensureDir(targetDir);
    console.log(chalk.gray(`📁 Created directory: ${targetDir}`));
  } catch (error) {
    throw new Error(`Failed to create project directory: ${error}`);
  }
}

async function generateProjectFiles(options: ProjectOptions): Promise<void> {
  const { targetDir, language, protocol, orm, aliases } = options;

  try {
    // Generate package.json
    const packageJson = generatePackageJson(options);
    await fs.writeJson(path.join(targetDir, 'package.json'), packageJson, { spaces: 2 });
    console.log(chalk.gray('📄 Generated package.json'));

    // Generate main file
    const mainFile = generateMainFile(options);
    let mainFileName: string;
    let mainFilePath: string;
    if (language === 'ts') {
      mainFileName = 'index.ts';
      const srcDir = path.join(targetDir, 'src');
      await fs.ensureDir(srcDir);
      mainFilePath = path.join(srcDir, mainFileName);
    } else {
      mainFileName = 'index.js';
      mainFilePath = path.join(targetDir, mainFileName);
    }
    await fs.writeFile(mainFilePath, mainFile);
    console.log(chalk.gray(`📄 Generated ${language === 'ts' ? 'src/' : ''}${mainFileName}`));

    // Generate TypeScript config if using TypeScript
    if (language === 'ts') {
      const tsConfig = generateTsConfig(options);
      await fs.writeJson(path.join(targetDir, 'tsconfig.json'), tsConfig, { spaces: 2 });
      console.log(chalk.gray('📄 Generated tsconfig.json'));
    }

    // Generate Prisma schema if using Prisma
    if (orm === 'prisma') {
      const prismaDir = path.join(targetDir, 'prisma');
      await fs.ensureDir(prismaDir);
      
      const prismaSchema = generatePrismaSchema();
      await fs.writeFile(path.join(prismaDir, 'schema.prisma'), prismaSchema);
      console.log(chalk.gray('📄 Generated prisma/schema.prisma'));
    }

    // Generate .gitignore
    const gitignore = generateGitignore(options);
    await fs.writeFile(path.join(targetDir, '.gitignore'), gitignore);
    console.log(chalk.gray('📄 Generated .gitignore'));

    // Generate README
    const readme = generateReadme(options);
    await fs.writeFile(path.join(targetDir, 'README.md'), readme);
    console.log(chalk.gray('📄 Generated README.md'));

  } catch (error) {
    throw new Error(`Failed to generate project files: ${error}`);
  }
}

async function initializePackageManager(options: ProjectOptions): Promise<void> {
  const { targetDir, packageManager } = options;

  try {
    console.log(chalk.blue(`📦 Initializing ${packageManager}...`));
    
    // Change to project directory
    process.chdir(targetDir);

    // Initialize package manager
    switch (packageManager) {
      case 'bun':
        execSync('bun install', { stdio: 'inherit' });
        break;
      case 'yarn':
        execSync('yarn install', { stdio: 'inherit' });
        break;
      case 'pnpm':
        execSync('pnpm install', { stdio: 'inherit' });
        break;
      case 'npm':
        execSync('npm install', { stdio: 'inherit' });
        break;
    }

    console.log(chalk.green(`✅ ${packageManager} initialization completed`));

  } catch (error) {
    console.warn(chalk.yellow(`⚠️  Package manager initialization failed: ${error}`));
    console.log(chalk.gray('You can run the install command manually later.'));
  }
}

function generateGitignore(options: ProjectOptions): string {
  const { language, orm } = options;
  
  let gitignore = `
# Dependencies
node_modules/
.pnp
.pnp.js

# Production builds
dist/
build/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# nyc test coverage
.nyc_output

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# Next.js build output
.next

# Nuxt.js build / generate output
.nuxt
dist

# Storybook build outputs
.out
.storybook-out

# Temporary folders
tmp/
temp/

# Editor directories and files
.vscode/
.idea/
*.swp
*.swo
*~

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db
`;

  if (language === 'ts') {
    gitignore += `
# TypeScript
*.tsbuildinfo
`;
  }

  if (orm === 'prisma') {
    gitignore += `
# Prisma
prisma/migrations/
`;
  }

  return gitignore.trim();
}

function generateReadme(options: ProjectOptions): string {
  const { projectName, language, packageManager, protocol, orm } = options;
  
  const installCmd = packageManager === 'bun' ? 'bun install' : 
                    packageManager === 'yarn' ? 'yarn install' :
                    packageManager === 'pnpm' ? 'pnpm install' : 'npm install';
  
  const devCmd = packageManager === 'bun' ? 'bun run dev' :
                 packageManager === 'yarn' ? 'yarn dev' :
                 packageManager === 'pnpm' ? 'pnpm dev' : 'npm run dev';

  return `# ${projectName}

A Churn backend project built with ${language === 'ts' ? 'TypeScript' : 'JavaScript'}.

## Features

- **Language**: ${language === 'ts' ? 'TypeScript' : 'JavaScript'}
- **Package Manager**: ${packageManager}
- **Protocol**: ${protocol === 'http' ? 'HTTP (REST API)' : 'WebSocket (Real-time)'}
- **ORM**: ${orm === 'prisma' ? 'Prisma' : 'None'}
- **Path Aliases**: ${options.aliases ? 'Enabled' : 'Disabled'}

## Getting Started

1. Install dependencies:
   \`\`\`bash
   ${installCmd}
   \`\`\`

2. Start the development server:
   \`\`\`bash
   ${devCmd}
   \`\`\`

${orm === 'prisma' ? `
## Database Setup

1. Configure your database connection in \`prisma/schema.prisma\`
2. Run database migrations:
   \`\`\`bash
   ${packageManager === 'bun' ? 'bunx' : packageManager === 'yarn' ? 'yarn' : packageManager === 'pnpm' ? 'pnpm' : 'npx'} prisma migrate dev
   \`\`\`
` : ''}

## Project Structure

\`\`\`
${projectName}/
├── ${language === 'ts' ? 'index.ts' : 'index.js'}     # Main application file
${language === 'ts' ? '├── tsconfig.json              # TypeScript configuration' : ''}
├── package.json              # Dependencies and scripts
├── README.md                 # This file
${orm === 'prisma' ? '└── prisma/                    # Database schema and migrations' : ''}
\`\`\`

## Available Scripts

- \`${devCmd}\` - Start development server
- \`${packageManager === 'bun' ? 'bun run' : packageManager === 'yarn' ? 'yarn' : packageManager === 'pnpm' ? 'pnpm' : 'npm run'} build\` - Build for production
- \`${packageManager === 'bun' ? 'bun run' : packageManager === 'yarn' ? 'yarn' : packageManager === 'pnpm' ? 'pnpm' : 'npm run'} start\` - Start production server

## Learn More

- [Churn Documentation](https://github.com/Basharkhan7776/Churn)
- [${language === 'ts' ? 'TypeScript' : 'JavaScript'} Documentation](https://${language === 'ts' ? 'www.typescriptlang.org' : 'developer.mozilla.org/en-US/docs/Web/JavaScript'})
${orm === 'prisma' ? '- [Prisma Documentation](https://www.prisma.io/docs)' : ''}
`;
} 