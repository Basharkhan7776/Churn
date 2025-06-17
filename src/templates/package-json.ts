import type { ProjectOptions } from '../types';

export function generatePackageJson(options: ProjectOptions): any {
  const { projectName, language, packageManager, protocol, orm, aliases } = options;

  const basePackage: any = {
    name: projectName,
    version: "1.0.0",
    description: `A Churn backend project built with ${language === 'ts' ? 'TypeScript' : 'JavaScript'}`,
    main: language === 'ts' ? 'dist/index.js' : 'index.js',
    type: "module",
    scripts: {
      dev: language === 'ts' ? 'bun run --watch index.ts' : 'bun --watch index.js',
      build: language === 'ts' ? 'bun build index.ts --outdir ./dist --target node' : 'echo "No build needed for JavaScript"',
      start: language === 'ts' ? 'bun run dist/index.js' : 'bun index.js',
      test: 'bun test'
    },
    dependencies: {
      "bun": "latest"
    },
    devDependencies: {},
    keywords: ["churn", "backend", "api", protocol],
    author: "Your Name",
    license: "MIT"
  };

  // Add TypeScript dependencies if using TypeScript
  if (language === 'ts') {
    basePackage.devDependencies = {
      ...basePackage.devDependencies,
      "@types/bun": "latest",
      "typescript": "^5.0.0"
    };
  }

  // Add protocol-specific dependencies
  if (protocol === 'http') {
    basePackage.dependencies = {
      ...basePackage.dependencies,
      "hono": "^3.0.0"
    };
  } else if (protocol === 'ws') {
    basePackage.dependencies = {
      ...basePackage.dependencies,
      "ws": "^8.0.0"
    };
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
    basePackage.scripts = {
      ...basePackage.scripts,
      "build": "bun build index.ts --outdir ./dist --target node && tsc-alias -p tsconfig.json"
    };
  }

  return basePackage;
} 