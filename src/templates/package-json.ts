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
      "express": "^4.18.0",
      "cors": "^2.8.5"
    };
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
        "@types/express": "^4.17.21",
        "@types/cors": "^2.8.17"
      };
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