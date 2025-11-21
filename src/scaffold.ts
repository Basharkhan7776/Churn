import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';
import chalk from 'chalk';
import type { ProjectOptions } from './types';
import { generatePackageJson } from './templates/package-json';
import { generateMainFile } from './templates/main-file';
import { generateTsConfig } from './templates/tsconfig';
import { generatePrismaSchema } from './templates/prisma-schema';
import { generateDrizzleSchema, generateDrizzleConfig, generateDrizzleClient } from './templates/drizzle-schema';
import { generateTypeORMConfig, generateTypeORMEntity } from './templates/typeorm-config';
import { generateSequelizeConfig, generateSequelizeModel } from './templates/sequelize-config';
import { generateMongooseConnection, generateMongooseModel } from './templates/mongoose-schema';
import { generateEnvExample, generateEnvValidation } from './templates/env-template';
import { generateJWTAuth, generateSessionAuth, generateOAuthConfig } from './templates/auth-templates';
import { generateJestConfig, generateVitestConfig, generateTestExample } from './templates/testing-templates';
import { generateESLintConfig, generatePrettierConfig, generatePrettierIgnore, generateHuskyPreCommit, generateLintStagedConfig } from './templates/linting-templates';
import { generateDockerfile, generateDockerCompose, generateDockerIgnore } from './templates/docker-templates';
import { generateGitHubActions, generateGitLabCI, generateCircleCI } from './templates/cicd-templates';
import { generateERC20Contract, generateERC721Contract, generateERC1155Contract } from './templates/solidity-templates';
import { generateHardhatConfig, generateHardhatDeployScript, generateHardhatTest, generateHardhatEnv, generateHardhatReadme } from './templates/hardhat-templates';
import { generateFoundryConfig, generateFoundryDeployScript, generateFoundryTest, generateFoundryEnv, generateFoundryReadme, generateFoundryRemappings } from './templates/foundry-templates';

export async function scaffoldProject(options: ProjectOptions): Promise<void> {
  // Clear screen before scaffolding output
  console.clear();

  console.log(chalk.blue('[>] Creating your project...\n'));

  // Create project directory
  await createProjectDirectory(options.targetDir);

  // Generate project files
  await generateProjectFiles(options);

  // Initialize package manager
  await initializePackageManager(options);

  console.log(chalk.green('[+] Project scaffolding completed!\n'));
}

async function createProjectDirectory(targetDir: string): Promise<void> {
  try {
    await fs.ensureDir(targetDir);
    console.log(chalk.gray(`[+] Created directory: ${targetDir}`));
  } catch (error) {
    throw new Error(`Failed to create project directory: ${error}`);
  }
}

async function generateProjectFiles(options: ProjectOptions): Promise<void> {
  const { targetDir, language, protocol, orm, aliases, evmFramework, contractType, tokenStandard } = options;

  try {
    // Generate package.json
    const packageJson = generatePackageJson(options);
    await fs.writeJson(path.join(targetDir, 'package.json'), packageJson, { spaces: 2 });
    console.log(chalk.gray('[*] Generated package.json'));

    // Handle Solidity projects separately
    if (language === 'solidity') {
      await generateSolidityProject(options);
      return;
    }

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
    console.log(chalk.gray(`[*] Generated ${language === 'ts' ? 'src/' : ''}${mainFileName}`));

    // Generate TypeScript config if using TypeScript
    if (language === 'ts') {
      const tsConfig = generateTsConfig(options);
      await fs.writeJson(path.join(targetDir, 'tsconfig.json'), tsConfig, { spaces: 2 });
      console.log(chalk.gray('[*] Generated tsconfig.json'));
    }

    // Generate Prisma schema if using Prisma
    if (orm === 'prisma') {
      const prismaDir = path.join(targetDir, 'prisma');
      await fs.ensureDir(prismaDir);

      const prismaSchema = generatePrismaSchema();
      await fs.writeFile(path.join(prismaDir, 'schema.prisma'), prismaSchema);
      console.log(chalk.gray('[*] Generated prisma/schema.prisma'));
    }

    // Generate Drizzle files if using Drizzle
    if (orm === 'drizzle') {
      const dbDir = path.join(targetDir, 'src', 'db');
      await fs.ensureDir(dbDir);

      const drizzleSchema = generateDrizzleSchema(options);
      await fs.writeFile(path.join(dbDir, 'schema.ts'), drizzleSchema);

      const drizzleClient = generateDrizzleClient(options);
      await fs.writeFile(path.join(dbDir, 'index.ts'), drizzleClient);

      const drizzleConfig = generateDrizzleConfig(options);
      await fs.writeFile(path.join(targetDir, 'drizzle.config.ts'), drizzleConfig);
      console.log(chalk.gray('[*] Generated Drizzle configuration'));
    }

    // Generate TypeORM files if using TypeORM
    if (orm === 'typeorm') {
      const configDir = path.join(targetDir, 'src', 'config');
      const entitiesDir = path.join(targetDir, 'src', 'entities');
      await fs.ensureDir(configDir);
      await fs.ensureDir(entitiesDir);

      const typeormConfig = generateTypeORMConfig(options);
      await fs.writeFile(path.join(configDir, 'database.ts'), typeormConfig);

      const typeormEntity = generateTypeORMEntity(options);
      await fs.writeFile(path.join(entitiesDir, 'User.ts'), typeormEntity);
      console.log(chalk.gray('[*] Generated TypeORM configuration'));
    }

    // Generate Sequelize files if using Sequelize
    if (orm === 'sequelize') {
      const configDir = path.join(targetDir, 'src', 'config');
      const modelsDir = path.join(targetDir, 'src', 'models');
      await fs.ensureDir(configDir);
      await fs.ensureDir(modelsDir);

      const sequelizeConfig = generateSequelizeConfig(options);
      await fs.writeFile(path.join(configDir, 'database.ts'), sequelizeConfig);

      const sequelizeModel = generateSequelizeModel(options);
      await fs.writeFile(path.join(modelsDir, 'User.ts'), sequelizeModel);
      console.log(chalk.gray('[*] Generated Sequelize configuration'));
    }

    // Generate Mongoose files if using Mongoose
    if (orm === 'mongoose') {
      const configDir = path.join(targetDir, 'src', 'config');
      const modelsDir = path.join(targetDir, 'src', 'models');
      await fs.ensureDir(configDir);
      await fs.ensureDir(modelsDir);

      const mongooseConn = generateMongooseConnection();
      await fs.writeFile(path.join(configDir, 'database.ts'), mongooseConn);

      const mongooseModel = generateMongooseModel();
      await fs.writeFile(path.join(modelsDir, 'User.ts'), mongooseModel);
      console.log(chalk.gray('[*] Generated Mongoose configuration'));
    }

    // Generate .env.example
    const envExample = generateEnvExample(options);
    await fs.writeFile(path.join(targetDir, '.env.example'), envExample);
    console.log(chalk.gray('[*] Generated .env.example'));

    // Generate environment validation if using TypeScript
    if (language === 'ts') {
      const configDir = path.join(targetDir, 'src', 'config');
      await fs.ensureDir(configDir);
      const envValidation = generateEnvValidation(options);
      await fs.writeFile(path.join(configDir, 'env.ts'), envValidation);
      console.log(chalk.gray('[*] Generated env validation'));
    }

    // Generate authentication files
    if (options.auth && options.auth !== 'none') {
      const authDir = path.join(targetDir, 'src', 'auth');
      await fs.ensureDir(authDir);

      if (options.auth === 'jwt') {
        const jwtAuth = generateJWTAuth(options);
        await fs.writeFile(path.join(authDir, 'jwt.ts'), jwtAuth);
        console.log(chalk.gray('[*] Generated JWT authentication'));
      } else if (options.auth === 'session') {
        const sessionAuth = generateSessionAuth(options);
        await fs.writeFile(path.join(authDir, 'session.ts'), sessionAuth);
        console.log(chalk.gray('[*] Generated Session authentication'));
      } else if (options.auth === 'oauth') {
        const oauthConfig = generateOAuthConfig(options);
        await fs.writeFile(path.join(authDir, 'oauth.ts'), oauthConfig);
        console.log(chalk.gray('[*] Generated OAuth configuration'));
      }
    }

    // Generate testing files
    if (options.testing && options.testing !== 'none') {
      const testDir = path.join(targetDir, '__tests__');
      await fs.ensureDir(testDir);

      if (options.testing === 'jest') {
        const jestConfig = generateJestConfig(options);
        await fs.writeFile(path.join(targetDir, 'jest.config.js'), jestConfig);
        console.log(chalk.gray('[*] Generated Jest configuration'));
      } else if (options.testing === 'vitest') {
        const vitestConfig = generateVitestConfig(options);
        await fs.writeFile(path.join(targetDir, 'vitest.config.ts'), vitestConfig);
        console.log(chalk.gray('[*] Generated Vitest configuration'));
      }

      const testExample = generateTestExample(options);
      const testFileName = language === 'ts' ? 'api.test.ts' : 'api.test.js';
      await fs.writeFile(path.join(testDir, testFileName), testExample);
      console.log(chalk.gray('[*] Generated test examples'));
    }

    // Generate linting files
    if (options.linting) {
      const eslintConfig = generateESLintConfig(options);
      await fs.writeFile(path.join(targetDir, '.eslintrc.json'), eslintConfig);

      const prettierConfig = generatePrettierConfig();
      await fs.writeFile(path.join(targetDir, '.prettierrc'), prettierConfig);

      const prettierIgnore = generatePrettierIgnore();
      await fs.writeFile(path.join(targetDir, '.prettierignore'), prettierIgnore);

      const lintStagedConfig = generateLintStagedConfig(options);
      await fs.writeFile(path.join(targetDir, '.lintstagedrc.json'), lintStagedConfig);

      console.log(chalk.gray('[*] Generated ESLint & Prettier configuration'));
    }

    // Generate Docker files
    if (options.docker) {
      const dockerfile = generateDockerfile(options);
      await fs.writeFile(path.join(targetDir, 'Dockerfile'), dockerfile);

      const dockerCompose = generateDockerCompose(options);
      await fs.writeFile(path.join(targetDir, 'docker-compose.yml'), dockerCompose);

      const dockerIgnore = generateDockerIgnore();
      await fs.writeFile(path.join(targetDir, '.dockerignore'), dockerIgnore);

      console.log(chalk.gray('[*] Generated Docker configuration'));
    }

    // Generate CI/CD files
    if (options.cicd && options.cicd !== 'none') {
      if (options.cicd === 'github') {
        const githubDir = path.join(targetDir, '.github', 'workflows');
        await fs.ensureDir(githubDir);
        const githubActions = generateGitHubActions(options);
        await fs.writeFile(path.join(githubDir, 'ci-cd.yml'), githubActions);
        console.log(chalk.gray('[*] Generated GitHub Actions workflow'));
      } else if (options.cicd === 'gitlab') {
        const gitlabCI = generateGitLabCI(options);
        await fs.writeFile(path.join(targetDir, '.gitlab-ci.yml'), gitlabCI);
        console.log(chalk.gray('[*] Generated GitLab CI configuration'));
      } else if (options.cicd === 'circleci') {
        const circleDir = path.join(targetDir, '.circleci');
        await fs.ensureDir(circleDir);
        const circleCI = generateCircleCI(options);
        await fs.writeFile(path.join(circleDir, 'config.yml'), circleCI);
        console.log(chalk.gray('[*] Generated CircleCI configuration'));
      }
    }

    // Generate .gitignore
    const gitignore = generateGitignore(options);
    await fs.writeFile(path.join(targetDir, '.gitignore'), gitignore);
    console.log(chalk.gray('[*] Generated .gitignore'));

    // Generate README
    const readme = generateReadme(options);
    await fs.writeFile(path.join(targetDir, 'README.md'), readme);
    console.log(chalk.gray('[*] Generated README.md'));

  } catch (error) {
    throw new Error(`Failed to generate project files: ${error}`);
  }
}

async function generateSolidityProject(options: ProjectOptions): Promise<void> {
  const { targetDir, evmFramework, contractType, tokenStandard, projectName } = options;

  try {
    if (evmFramework === 'hardhat') {
      // Generate Hardhat configuration
      const hardhatConfig = generateHardhatConfig(options);
      await fs.writeFile(path.join(targetDir, 'hardhat.config.js'), hardhatConfig);
      console.log(chalk.gray('[*] Generated hardhat.config.js'));

      // Create contracts directory
      const contractsDir = path.join(targetDir, 'contracts');
      await fs.ensureDir(contractsDir);

      // Generate contracts based on type
      if (contractType === 'token' || contractType === 'both') {
        const erc20Contract = generateERC20Contract(options);
        const contractName = toPascalCase(projectName);
        await fs.writeFile(path.join(contractsDir, `${contractName}.sol`), erc20Contract);
        console.log(chalk.gray(`[*] Generated contracts/${contractName}.sol (ERC20)`));
      }

      if (contractType === 'nft' || contractType === 'both') {
        const nftContractName = contractType === 'both' ? `${toPascalCase(projectName)}NFT` : toPascalCase(projectName);
        if (tokenStandard === 'erc1155') {
          const erc1155Contract = generateERC1155Contract(options);
          await fs.writeFile(path.join(contractsDir, `${nftContractName}.sol`), erc1155Contract);
          console.log(chalk.gray(`[*] Generated contracts/${nftContractName}.sol (ERC1155)`));
        } else {
          const erc721Contract = generateERC721Contract(options);
          await fs.writeFile(path.join(contractsDir, `${nftContractName}.sol`), erc721Contract);
          console.log(chalk.gray(`[*] Generated contracts/${nftContractName}.sol (ERC721)`));
        }
      }

      // Create scripts directory
      const scriptsDir = path.join(targetDir, 'scripts');
      await fs.ensureDir(scriptsDir);

      // Generate deploy script
      const deployScript = generateHardhatDeployScript(options);
      await fs.writeFile(path.join(scriptsDir, 'deploy.ts'), deployScript);
      console.log(chalk.gray('[*] Generated scripts/deploy.ts'));

      // Create test directory
      const testDir = path.join(targetDir, 'test');
      await fs.ensureDir(testDir);

      // Generate test file
      const testFile = generateHardhatTest(options);
      await fs.writeFile(path.join(testDir, 'Contract.test.ts'), testFile);
      console.log(chalk.gray('[*] Generated test/Contract.test.ts'));

      // Generate .env.example
      const envExample = generateHardhatEnv();
      await fs.writeFile(path.join(targetDir, '.env.example'), envExample);
      console.log(chalk.gray('[*] Generated .env.example'));

      // Generate README
      const readme = generateHardhatReadme(options);
      await fs.writeFile(path.join(targetDir, 'README.md'), readme);
      console.log(chalk.gray('[*] Generated README.md'));

    } else if (evmFramework === 'foundry') {
      // Generate Foundry configuration
      const foundryConfig = generateFoundryConfig();
      await fs.writeFile(path.join(targetDir, 'foundry.toml'), foundryConfig);
      console.log(chalk.gray('[*] Generated foundry.toml'));

      // Generate remappings
      const remappings = generateFoundryRemappings();
      await fs.writeFile(path.join(targetDir, 'remappings.txt'), remappings);
      console.log(chalk.gray('[*] Generated remappings.txt'));

      // Create src directory
      const srcDir = path.join(targetDir, 'src');
      await fs.ensureDir(srcDir);

      // Generate contracts
      if (contractType === 'token' || contractType === 'both') {
        const erc20Contract = generateERC20Contract(options);
        const contractName = toPascalCase(projectName);
        await fs.writeFile(path.join(srcDir, `${contractName}.sol`), erc20Contract);
        console.log(chalk.gray(`[*] Generated src/${contractName}.sol (ERC20)`));
      }

      if (contractType === 'nft' || contractType === 'both') {
        const nftContractName = contractType === 'both' ? `${toPascalCase(projectName)}NFT` : toPascalCase(projectName);
        if (tokenStandard === 'erc1155') {
          const erc1155Contract = generateERC1155Contract(options);
          await fs.writeFile(path.join(srcDir, `${nftContractName}.sol`), erc1155Contract);
          console.log(chalk.gray(`[*] Generated src/${nftContractName}.sol (ERC1155)`));
        } else {
          const erc721Contract = generateERC721Contract(options);
          await fs.writeFile(path.join(srcDir, `${nftContractName}.sol`), erc721Contract);
          console.log(chalk.gray(`[*] Generated src/${nftContractName}.sol (ERC721)`));
        }
      }

      // Create script directory
      const scriptDir = path.join(targetDir, 'script');
      await fs.ensureDir(scriptDir);

      // Generate deploy script
      const deployScript = generateFoundryDeployScript(options);
      await fs.writeFile(path.join(scriptDir, 'Deploy.s.sol'), deployScript);
      console.log(chalk.gray('[*] Generated script/Deploy.s.sol'));

      // Create test directory
      const testDir = path.join(targetDir, 'test');
      await fs.ensureDir(testDir);

      // Generate test file
      const testFile = generateFoundryTest(options);
      await fs.writeFile(path.join(testDir, 'Contract.t.sol'), testFile);
      console.log(chalk.gray('[*] Generated test/Contract.t.sol'));

      // Generate .env.example
      const envExample = generateFoundryEnv();
      await fs.writeFile(path.join(targetDir, '.env.example'), envExample);
      console.log(chalk.gray('[*] Generated .env.example'));

      // Generate README
      const readme = generateFoundryReadme(options);
      await fs.writeFile(path.join(targetDir, 'README.md'), readme);
      console.log(chalk.gray('[*] Generated README.md'));

      // Install Foundry dependencies
      console.log(chalk.blue('[*] Installing Foundry dependencies...'));
      try {
        execSync('forge install OpenZeppelin/openzeppelin-contracts --no-git', {
          stdio: 'inherit',
          cwd: path.resolve(targetDir)
        });
        if (options.proxy !== 'none') {
          execSync('forge install OpenZeppelin/openzeppelin-contracts-upgradeable --no-git', {
            stdio: 'inherit',
            cwd: path.resolve(targetDir)
          });
        }
        execSync('forge install foundry-rs/forge-std --no-git', {
          stdio: 'inherit',
          cwd: path.resolve(targetDir)
        });
        console.log(chalk.green('[+] Foundry dependencies installed'));
      } catch (error) {
        console.warn(chalk.yellow('[!] Foundry dependency installation failed. Please run manually.'));
      }

    } else {
      // Vanilla Solidity
      const contractsDir = path.join(targetDir, 'contracts');
      await fs.ensureDir(contractsDir);

      // Generate contracts
      if (contractType === 'token' || contractType === 'both') {
        const erc20Contract = generateERC20Contract(options);
        const contractName = toPascalCase(projectName);
        await fs.writeFile(path.join(contractsDir, `${contractName}.sol`), erc20Contract);
        console.log(chalk.gray(`[*] Generated contracts/${contractName}.sol (ERC20)`));
      }

      if (contractType === 'nft' || contractType === 'both') {
        const nftContractName = contractType === 'both' ? `${toPascalCase(projectName)}NFT` : toPascalCase(projectName);
        if (tokenStandard === 'erc1155') {
          const erc1155Contract = generateERC1155Contract(options);
          await fs.writeFile(path.join(contractsDir, `${nftContractName}.sol`), erc1155Contract);
          console.log(chalk.gray(`[*] Generated contracts/${nftContractName}.sol (ERC1155)`));
        } else {
          const erc721Contract = generateERC721Contract(options);
          await fs.writeFile(path.join(contractsDir, `${nftContractName}.sol`), erc721Contract);
          console.log(chalk.gray(`[*] Generated contracts/${nftContractName}.sol (ERC721)`));
        }
      }

      // Generate simple README
      const readme = `# ${projectName}

A vanilla Solidity smart contract project.

## Installation

\`\`\`bash
npm install
\`\`\`

## Compilation

\`\`\`bash
npm run compile
\`\`\`

## Note

This is a vanilla Solidity setup. Consider using Hardhat or Foundry for a better development experience.
`;
      await fs.writeFile(path.join(targetDir, 'README.md'), readme);
      console.log(chalk.gray('[*] Generated README.md'));
    }

    // Generate .gitignore
    const gitignore = generateSolidityGitignore(evmFramework);
    await fs.writeFile(path.join(targetDir, '.gitignore'), gitignore);
    console.log(chalk.gray('[*] Generated .gitignore'));

  } catch (error) {
    throw new Error(`Failed to generate Solidity project: ${error}`);
  }
}

function generateSolidityGitignore(evmFramework?: string): string {
  let gitignore = `
# Dependencies
node_modules/

# Environment variables
.env
.env.local

# Logs
*.log

# Editor directories
.vscode/
.idea/
*.swp
*.swo

# OS files
.DS_Store
`;

  if (evmFramework === 'hardhat') {
    gitignore += `
# Hardhat
cache/
artifacts/
coverage/
typechain-types/
`;
  } else if (evmFramework === 'foundry') {
    gitignore += `
# Foundry
out/
cache/
broadcast/
lib/
`;
  }

  return gitignore.trim();
}

function toPascalCase(str: string): string {
  return str
    .split(/[-_\s]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

async function initializePackageManager(options: ProjectOptions): Promise<void> {
  const { targetDir, packageManager, language, evmFramework } = options;

  // Skip npm installation for Foundry projects as they use forge
  if (language === 'solidity' && evmFramework === 'foundry') {
    console.log(chalk.gray('[*] Skipping npm installation for Foundry project'));
    return;
  }

  try {
    console.log(chalk.blue(`[*] Initializing ${packageManager}...`));

    // Initialize package manager with cwd option instead of process.chdir()
    const installCmd = {
      bun: 'bun install',
      yarn: 'yarn install',
      pnpm: 'pnpm install',
      npm: 'npm install'
    }[packageManager];

    execSync(installCmd, {
      stdio: 'inherit',
      cwd: path.resolve(targetDir)
    });

    console.log(chalk.green(`[+] ${packageManager} initialization completed`));

  } catch (error) {
    console.warn(chalk.yellow(`[!] Package manager initialization failed: ${error}`));
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