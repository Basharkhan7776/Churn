import type { ProjectOptions } from '../types';

export function generateESLintConfig(options: ProjectOptions): string {
  const { language } = options;

  if (language === 'ts') {
    return `{
  "root": true,
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 2022,
    "sourceType": "module",
    "project": "./tsconfig.json"
  },
  "plugins": ["@typescript-eslint", "prettier"],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "prettier"
  ],
  "rules": {
    "prettier/prettier": "error",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/no-explicit-any": "warn",
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  },
  "env": {
    "node": true,
    "es2022": true
  }
}
`;
  } else {
    return `{
  "root": true,
  "parserOptions": {
    "ecmaVersion": 2022,
    "sourceType": "module"
  },
  "plugins": ["prettier"],
  "extends": ["eslint:recommended", "prettier"],
  "rules": {
    "prettier/prettier": "error",
    "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  },
  "env": {
    "node": true,
    "es2022": true
  }
}
`;
  }
}

export function generatePrettierConfig(): string {
  return `{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf"
}
`;
}

export function generatePrettierIgnore(): string {
  return `# Dependencies
node_modules/

# Build outputs
dist/
build/
coverage/

# Environment files
.env*

# Generated files
*.log
*.tsbuildinfo

# Database
*.db
*.sqlite
prisma/migrations/

# Docker
Dockerfile
docker-compose.yml
`;
}

export function generateHuskyPreCommit(): string {
  return `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
`;
}

export function generateLintStagedConfig(options: ProjectOptions): string {
  const { language } = options;

  const filePattern = language === 'ts' ? '*.{ts,tsx}' : '*.{js,jsx}';

  return `{
  "${filePattern}": [
    "eslint --fix",
    "prettier --write"
  ],
  "*.json": [
    "prettier --write"
  ],
  "*.md": [
    "prettier --write"
  ]
}
`;
}
