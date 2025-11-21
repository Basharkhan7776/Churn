import type { ProjectOptions } from '../types';

export function generatePackageJson(options: ProjectOptions): any {
  const { projectName, language, packageManager, protocol, orm, aliases, evmFramework, proxy } = options;

  // Helper function to get package manager commands
  function getPackageManagerCommands() {
    switch (packageManager) {
      case 'bun':
        return {
          dev: language === 'ts' ? 'bun run --watch index.ts' : 'bun --watch index.js',
          build: language === 'ts' ? 'bun build index.ts --outdir ./dist --target node' : 'echo "No build needed for JavaScript"',
          start: language === 'ts' ? 'bun run dist/index.js' : 'bun index.js',
          test: 'bun test',
          install: 'bun install'
        };
      case 'yarn':
        return {
          dev: language === 'ts' ? 'yarn tsx watch index.ts' : 'node --watch index.js',
          build: language === 'ts' ? 'yarn tsc --rootDir src --outDir dist && yarn tsc-alias -p tsconfig.json' : 'echo "No build needed for JavaScript"',
          start: language === 'ts' ? 'yarn node dist/index.js' : 'node index.js',
          test: 'yarn test',
          install: 'yarn install'
        };
      case 'pnpm':
        return {
          dev: language === 'ts' ? 'pnpm tsx watch index.ts' : 'node --watch index.js',
          build: language === 'ts' ? 'pnpm tsc --rootDir src --outDir dist && pnpm tsc-alias -p tsconfig.json' : 'echo "No build needed for JavaScript"',
          start: language === 'ts' ? 'pnpm node dist/index.js' : 'node index.js',
          test: 'pnpm test',
          install: 'pnpm install'
        };
      case 'npm':
        return {
          dev: language === 'ts' ? 'tsx watch index.ts' : 'node --watch index.js',
          build: language === 'ts' ? 'npm run tsc -- --rootDir src --outDir dist && npm run tsc-alias -p tsconfig.json' : 'echo "No build needed for JavaScript"',
          start: language === 'ts' ? 'npm run node dist/index.js' : 'node index.js',
          test: 'npm test',
          install: 'npm install'
        };
      default:
        return {
          dev: language === 'ts' ? 'bun run --watch index.ts' : 'bun --watch index.js',
          build: language === 'ts' ? 'bun build index.ts --outdir ./dist --target node' : 'echo "No build needed for JavaScript"',
          start: language === 'ts' ? 'bun run dist/index.js' : 'bun index.js',
          test: 'bun test',
          install: 'bun install'
        };
    }
  }

  const commands = getPackageManagerCommands();

  const basePackage: any = {
    name: projectName,
    version: "1.0.0",
    description: `A Churn backend project built with ${language === 'ts' ? 'TypeScript' : 'JavaScript'}`,
    main: language === 'ts' ? 'dist/index.js' : 'index.js',
    ...(language !== 'solidity' ? { type: "module" } : {}),
    scripts: {
      dev: language === 'ts' ? (packageManager === 'bun' ? 'bun run --watch src/index.ts' : packageManager === 'yarn' ? 'yarn tsx watch src/index.ts' : packageManager === 'pnpm' ? 'pnpm tsx watch src/index.ts' : 'tsx watch src/index.ts') : (packageManager === 'bun' ? 'bun --watch index.js' : 'node --watch index.js'),
      build: commands.build,
      start: language === 'ts' ? (packageManager === 'bun' ? 'bun run src/index.ts' : packageManager === 'yarn' ? 'yarn node dist/index.js' : packageManager === 'pnpm' ? 'pnpm node dist/index.js' : 'node dist/index.js') : (packageManager === 'bun' ? 'bun index.js' : 'node index.js'),
      test: commands.test
    },
    dependencies: {},
    devDependencies: {},
    keywords: ["churn", "backend", "api", protocol],
    author: "Your Name",
    license: "MIT"
  };

  // Add runtime dependencies based on package manager
  if (packageManager === 'bun') {
    basePackage.dependencies = {
      ...basePackage.dependencies,
      "bun": "latest"
    };
  }

  // Add TypeScript dependencies if using TypeScript
  if (language === 'ts') {
    basePackage.devDependencies = {
      ...basePackage.devDependencies,
      "typescript": "latest"
    };

    // Add TypeScript runtime for non-bun package managers
    if (packageManager !== 'bun') {
      basePackage.devDependencies = {
        ...basePackage.devDependencies,
        "tsx": "latest"
      };
    } else {
      basePackage.devDependencies = {
        ...basePackage.devDependencies,
        "bun-types": "latest"
      };
    }
  }

  // Add Solidity/EVM-specific dependencies
  if (language === 'solidity') {
    basePackage.description = `A Solidity smart contract project using ${evmFramework === 'hardhat' ? 'Hardhat' : evmFramework === 'foundry' ? 'Foundry' : 'vanilla Solidity'}`;

    if (evmFramework === 'hardhat') {
      basePackage.dependencies = {
        ...basePackage.dependencies,
        "@openzeppelin/contracts": "^5.0.0",
        "dotenv": "latest"
      };

      if (proxy !== 'none') {
        basePackage.dependencies = {
          ...basePackage.dependencies,
          "@openzeppelin/contracts-upgradeable": "^5.0.0"
        };
      }

      basePackage.devDependencies = {
        ...basePackage.devDependencies,
        "hardhat": "latest",
        "@nomicfoundation/hardhat-toolbox": "latest",
        "@nomicfoundation/hardhat-ethers": "latest",
        "@nomicfoundation/hardhat-verify": "latest",
        "ethers": "latest",
        "@typechain/hardhat": "latest",
        "@typechain/ethers-v6": "latest",
        "typechain": "latest",
        "hardhat-gas-reporter": "latest",
        "solidity-coverage": "latest",
        "chai": "latest"
      };

      if (proxy !== 'none') {
        basePackage.devDependencies = {
          ...basePackage.devDependencies,
          "@openzeppelin/hardhat-upgrades": "latest"
        };
      }

      basePackage.scripts = {
        compile: "hardhat compile",
        test: "hardhat test",
        deploy: "hardhat run scripts/deploy.ts",
        "deploy:sepolia": "hardhat run scripts/deploy.ts --network sepolia",
        "deploy:mainnet": "hardhat run scripts/deploy.ts --network mainnet",
        node: "hardhat node",
        coverage: "hardhat coverage",
        verify: "hardhat verify"
      };
    } else if (evmFramework === 'foundry') {
      // Foundry uses forge, no npm packages needed
      basePackage.scripts = {
        build: "forge build",
        test: "forge test",
        "test:verbose": "forge test -vvvv",
        "test:gas": "forge test --gas-report",
        coverage: "forge coverage",
        deploy: "forge script script/Deploy.s.sol --broadcast",
        "deploy:sepolia": "forge script script/Deploy.s.sol --rpc-url $SEPOLIA_RPC_URL --broadcast --verify",
        "deploy:mainnet": "forge script script/Deploy.s.sol --rpc-url $MAINNET_RPC_URL --broadcast --verify",
        anvil: "anvil",
        format: "forge fmt"
      };

      basePackage.description = `A Solidity smart contract project using Foundry. Note: Foundry must be installed separately. See https://book.getfoundry.sh/`;
    } else {
      // Vanilla Solidity - just compiler
      basePackage.dependencies = {
        ...basePackage.dependencies,
        "@openzeppelin/contracts": "^5.0.0"
      };

      if (proxy !== 'none') {
        basePackage.dependencies = {
          ...basePackage.dependencies,
          "@openzeppelin/contracts-upgradeable": "^5.0.0"
        };
      }

      basePackage.devDependencies = {
        ...basePackage.devDependencies,
        "solc": "latest"
      };

      basePackage.scripts = {
        compile: "solc --bin --abi contracts/*.sol -o build/"
      };
    }

    // Early return for Solidity projects as they don't need backend dependencies
    return basePackage;
  }

  // Add protocol-specific dependencies
  if (protocol === 'http') {
    basePackage.dependencies = {
      ...basePackage.dependencies,
      "express": "latest"
    };

    // Add CORS if enabled
    if (options.cors) {
      basePackage.dependencies = {
        ...basePackage.dependencies,
        "cors": "latest"
      };
    }
  } else if (protocol === 'ws') {
    basePackage.dependencies = {
      ...basePackage.dependencies,
      "ws": "latest"
    };
  }

  // Add @types for express/cors/ws if using TypeScript
  if (language === 'ts') {
    if (protocol === 'http') {
      basePackage.devDependencies = {
        ...basePackage.devDependencies,
        "@types/express": "latest"
      };

      if (options.cors) {
        basePackage.devDependencies = {
          ...basePackage.devDependencies,
          "@types/cors": "latest"
        };
      }
    } else if (protocol === 'ws') {
      basePackage.devDependencies = {
        ...basePackage.devDependencies,
        "@types/ws": "latest"
      };
    }
  }

  // Add ORM dependencies
  if (orm === 'prisma') {
    basePackage.dependencies = {
      ...basePackage.dependencies,
      "@prisma/client": "latest"
    };
    basePackage.devDependencies = {
      ...basePackage.devDependencies,
      "prisma": "latest"
    };
    basePackage.scripts = {
      ...basePackage.scripts,
      "db:generate": "prisma generate",
      "db:push": "prisma db push",
      "db:migrate": "prisma migrate dev",
      "db:studio": "prisma studio"
    };
  } else if (orm === 'drizzle') {
    const dbDriver = options.database === 'postgresql' ? 'pg' :
                     options.database === 'mysql' ? 'mysql2' : 'better-sqlite3';

    basePackage.dependencies = {
      ...basePackage.dependencies,
      "drizzle-orm": "latest",
      [dbDriver]: "latest"
    };
    basePackage.devDependencies = {
      ...basePackage.devDependencies,
      "drizzle-kit": "latest"
    };
    basePackage.scripts = {
      ...basePackage.scripts,
      "db:generate": "drizzle-kit generate:pg",
      "db:push": "drizzle-kit push:pg",
      "db:studio": "drizzle-kit studio"
    };
  } else if (orm === 'typeorm') {
    const dbDriver = options.database === 'postgresql' ? 'pg' :
                     options.database === 'mysql' ? 'mysql2' : 'better-sqlite3';

    basePackage.dependencies = {
      ...basePackage.dependencies,
      "typeorm": "latest",
      "reflect-metadata": "latest",
      [dbDriver]: "latest"
    };
    basePackage.scripts = {
      ...basePackage.scripts,
      "db:migration:generate": "typeorm migration:generate",
      "db:migration:run": "typeorm migration:run",
      "db:migration:revert": "typeorm migration:revert"
    };
  } else if (orm === 'sequelize') {
    const dbDriver = options.database === 'postgresql' ? 'pg' :
                     options.database === 'mysql' ? 'mysql2' : 'sqlite3';

    basePackage.dependencies = {
      ...basePackage.dependencies,
      "sequelize": "latest",
      [dbDriver]: "latest"
    };
    if (language === 'ts') {
      basePackage.devDependencies = {
        ...basePackage.devDependencies,
        "@types/sequelize": "latest"
      };
    }
    basePackage.scripts = {
      ...basePackage.scripts,
      "db:migrate": "sequelize db:migrate",
      "db:seed": "sequelize db:seed:all"
    };
  } else if (orm === 'mongoose') {
    basePackage.dependencies = {
      ...basePackage.dependencies,
      "mongoose": "latest"
    };
    if (language === 'ts') {
      basePackage.devDependencies = {
        ...basePackage.devDependencies,
        "@types/mongoose": "latest"
      };
    }
  }

  // Add environment validation
  if (language === 'ts') {
    basePackage.dependencies = {
      ...basePackage.dependencies,
      "zod": "latest"
    };
  }

  // Add authentication dependencies
  if (options.auth === 'jwt') {
    basePackage.dependencies = {
      ...basePackage.dependencies,
      "jsonwebtoken": "latest"
    };
    if (language === 'ts') {
      basePackage.devDependencies = {
        ...basePackage.devDependencies,
        "@types/jsonwebtoken": "latest"
      };
    }
  } else if (options.auth === 'session') {
    basePackage.dependencies = {
      ...basePackage.dependencies,
      "express-session": "latest"
    };
    if (language === 'ts') {
      basePackage.devDependencies = {
        ...basePackage.devDependencies,
        "@types/express-session": "latest"
      };
    }
  } else if (options.auth === 'oauth') {
    basePackage.dependencies = {
      ...basePackage.dependencies,
      "axios": "latest"
    };
  }

  // Add testing dependencies
  if (options.testing === 'jest') {
    basePackage.devDependencies = {
      ...basePackage.devDependencies,
      "jest": "latest",
      "supertest": "latest"
    };
    if (language === 'ts') {
      basePackage.devDependencies = {
        ...basePackage.devDependencies,
        "@types/jest": "latest",
        "@types/supertest": "latest",
        "ts-jest": "latest"
      };
    }
    basePackage.scripts = {
      ...basePackage.scripts,
      "test:coverage": "jest --coverage"
    };
  } else if (options.testing === 'vitest') {
    basePackage.devDependencies = {
      ...basePackage.devDependencies,
      "vitest": "latest",
      "supertest": "latest",
      "@vitest/coverage-v8": "latest"
    };
    if (language === 'ts') {
      basePackage.devDependencies = {
        ...basePackage.devDependencies,
        "@types/supertest": "latest"
      };
    }
  }

  // Add linting dependencies
  if (options.linting) {
    basePackage.devDependencies = {
      ...basePackage.devDependencies,
      "eslint": "latest",
      "prettier": "latest",
      "eslint-plugin-prettier": "latest",
      "eslint-config-prettier": "latest",
      "lint-staged": "latest",
      "husky": "latest"
    };

    if (language === 'ts') {
      basePackage.devDependencies = {
        ...basePackage.devDependencies,
        "@typescript-eslint/parser": "latest",
        "@typescript-eslint/eslint-plugin": "latest"
      };
    }

    basePackage.scripts = {
      ...basePackage.scripts,
      "lint": `eslint ${language === 'ts' ? 'src/**/*.ts' : '**/*.js'} --fix`,
      "format": "prettier --write .",
      "prepare": "husky install"
    };
  }

  // Add path alias support if enabled
  if (aliases && language === 'ts') {
    basePackage.devDependencies = {
      ...basePackage.devDependencies,
      "tsc-alias": "latest"
    };
    // Update build script to include path alias processing
    if (packageManager === 'bun') {
      basePackage.scripts.build = "bun build index.ts --outdir ./dist --target node && tsc-alias -p tsconfig.json";
    } else {
      basePackage.scripts.build = "tsc --rootDir src --outDir dist && tsc-alias -p tsconfig.json";
    }
  }

  return basePackage;
} 