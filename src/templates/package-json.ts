import type { ProjectOptions } from '../types';

export function generatePackageJson(options: ProjectOptions): any {
  const { projectName, language, packageManager, protocol, orm, aliases } = options;

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
    type: "module",
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
      "typescript": "^5.0.0"
    };

    // Add TypeScript runtime for non-bun package managers
    if (packageManager !== 'bun') {
      basePackage.devDependencies = {
        ...basePackage.devDependencies,
        "tsx": "^4.0.0"
      };
    } else {
      basePackage.devDependencies = {
        ...basePackage.devDependencies,
        "bun-types": "latest"
      };
    }
  }

  // Add protocol-specific dependencies
  if (protocol === 'http') {
    basePackage.dependencies = {
      ...basePackage.dependencies,
      "express": "^4.18.0"
    };

    // Add CORS if enabled
    if (options.cors) {
      basePackage.dependencies = {
        ...basePackage.dependencies,
        "cors": "^2.8.5"
      };
    }
  } else if (protocol === 'ws') {
    basePackage.dependencies = {
      ...basePackage.dependencies,
      "ws": "^8.0.0"
    };
  }

  // Add @types for express/cors/ws if using TypeScript
  if (language === 'ts') {
    if (protocol === 'http') {
      basePackage.devDependencies = {
        ...basePackage.devDependencies,
        "@types/express": "^4.17.21"
      };

      if (options.cors) {
        basePackage.devDependencies = {
          ...basePackage.devDependencies,
          "@types/cors": "^2.8.17"
        };
      }
    } else if (protocol === 'ws') {
      basePackage.devDependencies = {
        ...basePackage.devDependencies,
        "@types/ws": "^8.5.10"
      };
    }
  }

  // Add ORM dependencies
  if (orm === 'prisma') {
    basePackage.dependencies = {
      ...basePackage.dependencies,
      "@prisma/client": "^5.0.0"
    };
    basePackage.devDependencies = {
      ...basePackage.devDependencies,
      "prisma": "^5.0.0"
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
      "drizzle-orm": "^0.29.0",
      [dbDriver]: dbDriver === 'pg' ? '^8.11.0' : dbDriver === 'mysql2' ? '^3.6.0' : '^9.2.0'
    };
    basePackage.devDependencies = {
      ...basePackage.devDependencies,
      "drizzle-kit": "^0.20.0"
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
      "typeorm": "^0.3.17",
      "reflect-metadata": "^0.1.13",
      [dbDriver]: dbDriver === 'pg' ? '^8.11.0' : dbDriver === 'mysql2' ? '^3.6.0' : '^9.2.0'
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
      "sequelize": "^6.35.0",
      [dbDriver]: dbDriver === 'pg' ? '^8.11.0' : dbDriver === 'mysql2' ? '^3.6.0' : '^5.1.6'
    };
    if (language === 'ts') {
      basePackage.devDependencies = {
        ...basePackage.devDependencies,
        "@types/sequelize": "^4.28.0"
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
      "mongoose": "^8.0.0"
    };
    if (language === 'ts') {
      basePackage.devDependencies = {
        ...basePackage.devDependencies,
        "@types/mongoose": "^5.11.97"
      };
    }
  }

  // Add environment validation
  if (language === 'ts') {
    basePackage.dependencies = {
      ...basePackage.dependencies,
      "zod": "^3.22.0"
    };
  }

  // Add authentication dependencies
  if (options.auth === 'jwt') {
    basePackage.dependencies = {
      ...basePackage.dependencies,
      "jsonwebtoken": "^9.0.2"
    };
    if (language === 'ts') {
      basePackage.devDependencies = {
        ...basePackage.devDependencies,
        "@types/jsonwebtoken": "^9.0.5"
      };
    }
  } else if (options.auth === 'session') {
    basePackage.dependencies = {
      ...basePackage.dependencies,
      "express-session": "^1.17.3"
    };
    if (language === 'ts') {
      basePackage.devDependencies = {
        ...basePackage.devDependencies,
        "@types/express-session": "^1.17.10"
      };
    }
  } else if (options.auth === 'oauth') {
    basePackage.dependencies = {
      ...basePackage.dependencies,
      "axios": "^1.6.0"
    };
  }

  // Add testing dependencies
  if (options.testing === 'jest') {
    basePackage.devDependencies = {
      ...basePackage.devDependencies,
      "jest": "^29.7.0",
      "supertest": "^6.3.3"
    };
    if (language === 'ts') {
      basePackage.devDependencies = {
        ...basePackage.devDependencies,
        "@types/jest": "^29.5.0",
        "@types/supertest": "^6.0.0",
        "ts-jest": "^29.1.0"
      };
    }
    basePackage.scripts = {
      ...basePackage.scripts,
      "test:coverage": "jest --coverage"
    };
  } else if (options.testing === 'vitest') {
    basePackage.devDependencies = {
      ...basePackage.devDependencies,
      "vitest": "^1.0.0",
      "supertest": "^6.3.3",
      "@vitest/coverage-v8": "^1.0.0"
    };
    if (language === 'ts') {
      basePackage.devDependencies = {
        ...basePackage.devDependencies,
        "@types/supertest": "^6.0.0"
      };
    }
  }

  // Add linting dependencies
  if (options.linting) {
    basePackage.devDependencies = {
      ...basePackage.devDependencies,
      "eslint": "^8.55.0",
      "prettier": "^3.1.0",
      "eslint-plugin-prettier": "^5.0.1",
      "eslint-config-prettier": "^9.1.0",
      "lint-staged": "^15.2.0",
      "husky": "^8.0.3"
    };

    if (language === 'ts') {
      basePackage.devDependencies = {
        ...basePackage.devDependencies,
        "@typescript-eslint/parser": "^6.15.0",
        "@typescript-eslint/eslint-plugin": "^6.15.0"
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
      "tsc-alias": "^1.8.0"
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