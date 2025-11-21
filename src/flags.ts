import type { ProjectOptions } from './types';
import chalk from 'chalk';

interface ParsedFlags {
  projectName?: string;
  language?: 'js' | 'ts' | 'solidity';
  packageManager?: 'bun' | 'yarn' | 'pnpm' | 'npm';
  protocol?: 'http' | 'ws';
  cors?: boolean;
  orm?: 'none' | 'prisma' | 'drizzle' | 'typeorm' | 'sequelize' | 'mongoose';
  database?: 'postgresql' | 'mysql' | 'sqlite' | 'mongodb';
  aliases?: boolean;
  auth?: 'none' | 'jwt' | 'oauth' | 'session';
  testing?: 'none' | 'jest' | 'vitest';
  linting?: boolean;
  docker?: boolean;
  cicd?: 'none' | 'github' | 'gitlab' | 'circleci';
  // EVM-specific flags
  evmFramework?: 'hardhat' | 'foundry' | 'none';
  contractType?: 'token' | 'nft' | 'both' | 'none';
  tokenStandard?: 'erc20' | 'erc721' | 'erc1155';
  proxy?: 'none' | 'uups' | 'transparent';
}

export function parseFlags(args: string[]): ParsedFlags | null {
  const flags: ParsedFlags = {};

  // Filter out the node executable and script path
  const cleanArgs = args.slice(2);

  // First argument might be the project name (if it doesn't start with --)
  if (cleanArgs.length > 0 && !cleanArgs[0].startsWith('--')) {
    flags.projectName = cleanArgs[0];
  }

  // Parse flags
  for (const arg of cleanArgs) {
    if (!arg.startsWith('--')) continue;

    // Language flags
    if (arg === '--ts' || arg === '--typescript') {
      flags.language = 'ts';
    } else if (arg === '--js' || arg === '--javascript') {
      flags.language = 'js';
    } else if (arg === '--solidity' || arg === '--sol') {
      flags.language = 'solidity';
    }

    // EVM Framework flags
    else if (arg === '--hardhat') {
      flags.evmFramework = 'hardhat';
    } else if (arg === '--foundry') {
      flags.evmFramework = 'foundry';
    } else if (arg === '--no-framework') {
      flags.evmFramework = 'none';
    }

    // Contract type flags
    else if (arg === '--token') {
      flags.contractType = 'token';
    } else if (arg === '--nft') {
      flags.contractType = 'nft';
    } else if (arg === '--both-contracts') {
      flags.contractType = 'both';
    } else if (arg === '--no-contracts') {
      flags.contractType = 'none';
    }

    // Token standard flags
    else if (arg === '--erc20') {
      flags.tokenStandard = 'erc20';
    } else if (arg === '--erc721') {
      flags.tokenStandard = 'erc721';
    } else if (arg === '--erc1155') {
      flags.tokenStandard = 'erc1155';
    }

    // Proxy flags
    else if (arg === '--uups') {
      flags.proxy = 'uups';
    } else if (arg === '--transparent') {
      flags.proxy = 'transparent';
    } else if (arg === '--no-proxy') {
      flags.proxy = 'none';
    }

    // Package manager flags
    else if (arg === '--bun') {
      flags.packageManager = 'bun';
    } else if (arg === '--npm') {
      flags.packageManager = 'npm';
    } else if (arg === '--yarn') {
      flags.packageManager = 'yarn';
    } else if (arg === '--pnpm') {
      flags.packageManager = 'pnpm';
    }

    // Protocol flags
    else if (arg === '--http') {
      flags.protocol = 'http';
    } else if (arg === '--ws' || arg === '--websocket') {
      flags.protocol = 'ws';
    }

    // CORS flags
    else if (arg === '--cors') {
      flags.cors = true;
    } else if (arg === '--no-cors') {
      flags.cors = false;
    }

    // ORM flags
    else if (arg === '--prisma') {
      flags.orm = 'prisma';
    } else if (arg === '--drizzle') {
      flags.orm = 'drizzle';
    } else if (arg === '--typeorm') {
      flags.orm = 'typeorm';
    } else if (arg === '--sequelize') {
      flags.orm = 'sequelize';
    } else if (arg === '--mongoose') {
      flags.orm = 'mongoose';
    } else if (arg === '--no-orm') {
      flags.orm = 'none';
    }

    // Database flags
    else if (arg === '--postgresql' || arg === '--postgres') {
      flags.database = 'postgresql';
    } else if (arg === '--mysql') {
      flags.database = 'mysql';
    } else if (arg === '--sqlite') {
      flags.database = 'sqlite';
    } else if (arg === '--mongodb') {
      flags.database = 'mongodb';
    }

    // Path aliases flags
    else if (arg === '--aliases') {
      flags.aliases = true;
    } else if (arg === '--no-aliases') {
      flags.aliases = false;
    }

    // Authentication flags
    else if (arg === '--jwt') {
      flags.auth = 'jwt';
    } else if (arg === '--oauth') {
      flags.auth = 'oauth';
    } else if (arg === '--session') {
      flags.auth = 'session';
    } else if (arg === '--no-auth') {
      flags.auth = 'none';
    }

    // Testing flags
    else if (arg === '--jest') {
      flags.testing = 'jest';
    } else if (arg === '--vitest') {
      flags.testing = 'vitest';
    } else if (arg === '--no-testing') {
      flags.testing = 'none';
    }

    // Linting flags
    else if (arg === '--linting') {
      flags.linting = true;
    } else if (arg === '--no-linting') {
      flags.linting = false;
    }

    // Docker flags
    else if (arg === '--docker') {
      flags.docker = true;
    } else if (arg === '--no-docker') {
      flags.docker = false;
    }

    // CI/CD flags
    else if (arg === '--github') {
      flags.cicd = 'github';
    } else if (arg === '--gitlab') {
      flags.cicd = 'gitlab';
    } else if (arg === '--circleci') {
      flags.cicd = 'circleci';
    } else if (arg === '--no-cicd') {
      flags.cicd = 'none';
    }

    // Help flag
    else if (arg === '--help' || arg === '-h') {
      showHelp();
      return null;
    }

    // Unknown flag
    else {
      console.error(chalk.red(`Unknown flag: ${arg}`));
      console.log(chalk.yellow('Use --help to see available flags'));
      return null;
    }
  }

  return flags;
}

export function convertFlagsToOptions(flags: ParsedFlags): ProjectOptions {
  // Set defaults based on the prompts
  const projectName = flags.projectName || 'my-churn-app';
  const language = flags.language || 'ts';
  const packageManager = flags.packageManager || 'bun';
  const protocol = flags.protocol || 'http';
  const orm = flags.orm || 'prisma';
  const aliases = flags.aliases !== undefined ? flags.aliases : true;
  const linting = flags.linting !== undefined ? flags.linting : true;
  const docker = flags.docker !== undefined ? flags.docker : false;

  // Handle CORS - default to true for HTTP, undefined for WebSocket
  let cors: boolean | undefined;
  if (protocol === 'http') {
    cors = flags.cors !== undefined ? flags.cors : true;
  }

  // Handle database - auto-set based on ORM if not specified
  let database: 'postgresql' | 'mysql' | 'sqlite' | 'mongodb' | undefined;
  if (orm === 'mongoose') {
    database = 'mongodb';
  } else if (orm !== 'none') {
    database = flags.database || 'postgresql';
  }

  // Handle auth, testing, cicd - default to 'none'
  const auth = flags.auth || 'none';
  const testing = flags.testing || 'none';
  const cicd = flags.cicd || 'none';

  // Handle EVM-specific options
  let evmFramework: 'hardhat' | 'foundry' | 'none' | undefined;
  let contractType: 'token' | 'nft' | 'both' | 'none' | undefined;
  let tokenStandard: 'erc20' | 'erc721' | 'erc1155' | undefined;
  let proxy: 'none' | 'uups' | 'transparent' | undefined;

  if (language === 'solidity') {
    evmFramework = flags.evmFramework || 'hardhat';
    contractType = flags.contractType || 'token';

    // Auto-set token standard based on contract type
    if (contractType === 'nft' || contractType === 'both') {
      tokenStandard = flags.tokenStandard || 'erc721';
    } else if (contractType === 'token') {
      tokenStandard = 'erc20';
    }

    proxy = flags.proxy || 'none';
  }

  const targetDir = `./${projectName}`;

  return {
    projectName,
    language,
    packageManager,
    protocol,
    cors,
    orm,
    database,
    aliases,
    auth,
    testing,
    linting,
    docker,
    cicd,
    targetDir,
    evmFramework,
    contractType,
    tokenStandard,
    proxy
  };
}

export function hasFlags(args: string[]): boolean {
  // Check if there are any flags beyond just the project name
  const cleanArgs = args.slice(2);
  return cleanArgs.some(arg => arg.startsWith('--'));
}

function showHelp(): void {
  console.log(`
${chalk.bold.blue('Create Churn CLI')}

${chalk.bold('USAGE:')}
  ${chalk.cyan('npx create-churn@latest')} ${chalk.gray('[project-name]')} ${chalk.gray('[options]')}

${chalk.bold('INTERACTIVE MODE:')}
  ${chalk.cyan('npx create-churn@latest')}

  The CLI will guide you through all configuration options.

${chalk.bold('NON-INTERACTIVE MODE:')}
  ${chalk.cyan('npx create-churn@latest my-app --ts --bun --prisma --postgresql')}

${chalk.bold('OPTIONS:')}

  ${chalk.yellow('Language:')}
    --ts, --typescript    Use TypeScript (default)
    --js, --javascript    Use JavaScript
    --solidity, --sol     Use Solidity (Smart Contracts)

  ${chalk.yellow('Package Manager:')}
    --bun                 Use Bun (default)
    --npm                 Use npm
    --yarn                Use Yarn
    --pnpm                Use pnpm

  ${chalk.yellow('Protocol:')}
    --http                HTTP/REST API (default)
    --ws, --websocket     WebSocket server
    --cors                Enable CORS (default for HTTP)
    --no-cors             Disable CORS

  ${chalk.yellow('ORM/ODM:')}
    --prisma              Use Prisma (default)
    --drizzle             Use Drizzle
    --typeorm             Use TypeORM
    --sequelize           Use Sequelize
    --mongoose            Use Mongoose
    --no-orm              Skip ORM setup

  ${chalk.yellow('Database:')}
    --postgresql, --postgres    PostgreSQL database (default)
    --mysql                     MySQL database
    --sqlite                    SQLite database
    --mongodb                   MongoDB database (auto with Mongoose)

  ${chalk.yellow('EVM/Solidity Framework (for --solidity):')}
    --hardhat             Use Hardhat framework (default)
    --foundry             Use Foundry framework
    --no-framework        Vanilla Solidity (no framework)

  ${chalk.yellow('Contract Types (for --solidity):')}
    --token               Generate ERC20 token contract (default)
    --nft                 Generate NFT contract (ERC721/ERC1155)
    --both-contracts      Generate both Token and NFT
    --no-contracts        Skip contract generation

  ${chalk.yellow('Token Standards (for --solidity):')}
    --erc20               ERC20 token standard (default for --token)
    --erc721              ERC721 NFT standard (default for --nft)
    --erc1155             ERC1155 multi-token standard

  ${chalk.yellow('Proxy Patterns (for --solidity):')}
    --uups                UUPS upgradeable proxy
    --transparent         Transparent upgradeable proxy
    --no-proxy            Non-upgradeable contracts (default)

  ${chalk.yellow('TypeScript Features:')}
    --aliases             Enable path aliases (default for TS)
    --no-aliases          Disable path aliases

  ${chalk.yellow('Authentication:')}
    --jwt                 JWT authentication
    --oauth               OAuth (Google, GitHub)
    --session             Session-based auth
    --no-auth             Skip authentication (default)

  ${chalk.yellow('Testing:')}
    --jest                Use Jest
    --vitest              Use Vitest
    --no-testing          Skip testing setup (default)

  ${chalk.yellow('Code Quality:')}
    --linting             ESLint + Prettier + Husky (default)
    --no-linting          Skip linting setup

  ${chalk.yellow('DevOps:')}
    --docker              Add Docker support
    --no-docker           Skip Docker (default)
    --github              GitHub Actions CI/CD
    --gitlab              GitLab CI
    --circleci            CircleCI
    --no-cicd             Skip CI/CD setup (default)

  ${chalk.yellow('Other:')}
    --help, -h            Show this help message

${chalk.bold('EXAMPLES:')}

  ${chalk.gray('# Full-stack TypeScript API')}
  ${chalk.cyan('npx create-churn@latest my-api --ts --bun --drizzle --postgresql --jwt --jest --docker')}

  ${chalk.gray('# Minimal JavaScript API')}
  ${chalk.cyan('npx create-churn@latest simple-api --js --npm --no-orm --no-auth --no-testing')}

  ${chalk.gray('# WebSocket server with MongoDB')}
  ${chalk.cyan('npx create-churn@latest realtime-app --ws --mongoose --mongodb --session --vitest')}

  ${chalk.gray('# Solidity smart contracts with Hardhat')}
  ${chalk.cyan('npx create-churn@latest my-contracts --solidity --hardhat --token --uups')}

  ${chalk.gray('# NFT project with Foundry')}
  ${chalk.cyan('npx create-churn@latest nft-project --solidity --foundry --nft --erc721 --no-proxy')}

${chalk.bold('DOCUMENTATION:')}
  https://github.com/Basharkhan7776/Churn#readme
`);
}
