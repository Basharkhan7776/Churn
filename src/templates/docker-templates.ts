import type { ProjectOptions } from '../types';

export function generateDockerfile(options: ProjectOptions): string {
  const { language, packageManager } = options;

  const packageFile = packageManager === 'yarn' ? 'yarn.lock' :
                     packageManager === 'pnpm' ? 'pnpm-lock.yaml' :
                     packageManager === 'bun' ? 'bun.lockb' : 'package-lock.json';

  let installCmd = '';
  let runCmd = '';

  if (packageManager === 'bun') {
    installCmd = 'RUN bun install --frozen-lockfile';
    runCmd = language === 'ts' ? 'CMD ["bun", "run", "src/index.ts"]' : 'CMD ["bun", "index.js"]';
  } else if (packageManager === 'yarn') {
    installCmd = 'RUN yarn install --frozen-lockfile';
    runCmd = 'CMD ["yarn", "start"]';
  } else if (packageManager === 'pnpm') {
    installCmd = 'RUN pnpm install --frozen-lockfile';
    runCmd = 'CMD ["pnpm", "start"]';
  } else {
    installCmd = 'RUN npm ci';
    runCmd = 'CMD ["npm", "start"]';
  }

  const baseImage = packageManager === 'bun' ? 'oven/bun:1' : 'node:20-alpine';

  return `# Build stage
FROM ${baseImage} AS builder

WORKDIR /app

# Copy package files
COPY package.json ${packageFile !== 'package-lock.json' ? packageFile : ''}${packageFile === 'package-lock.json' ? '' : ' '}./

# Install dependencies
${installCmd}

# Copy source code
COPY . .

${language === 'ts' && packageManager !== 'bun' ? '# Build TypeScript\nRUN npm run build\n' : ''}
# Production stage
FROM ${baseImage}

WORKDIR /app

ENV NODE_ENV=production

# Copy package files
COPY package.json ${packageFile !== 'package-lock.json' ? packageFile : ''}${packageFile === 'package-lock.json' ? '' : ' '}./

# Install production dependencies only
${packageManager === 'bun' ? 'RUN bun install --production --frozen-lockfile' :
  packageManager === 'yarn' ? 'RUN yarn install --production --frozen-lockfile' :
  packageManager === 'pnpm' ? 'RUN pnpm install --prod --frozen-lockfile' :
  'RUN npm ci --only=production'}

# Copy built application
${language === 'ts' && packageManager !== 'bun' ? 'COPY --from=builder /app/dist ./dist' : 'COPY --from=builder /app/src ./src'}
${language === 'js' ? 'COPY --from=builder /app/index.js ./index.js' : ''}

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
${runCmd}
`;
}

export function generateDockerCompose(options: ProjectOptions): string {
  const { projectName, database, orm } = options;

  let services = `version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: ${projectName}
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
`;

  if (orm !== 'none' && database) {
    services += `      - DATABASE_URL=\${DATABASE_URL}\n`;
    services += `    depends_on:\n      - db\n`;
    services += `    networks:\n      - app-network\n`;

    services += `\n  db:\n`;

    if (database === 'postgresql') {
      services += `    image: postgres:16-alpine
    container_name: ${projectName}-postgres
    environment:
      - POSTGRES_USER=\${DB_USER:-user}
      - POSTGRES_PASSWORD=\${DB_PASSWORD:-password}
      - POSTGRES_DB=\${DB_NAME:-${projectName}}
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - app-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U \${DB_USER:-user}"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres-data:
`;
    } else if (database === 'mysql') {
      services += `    image: mysql:8
    container_name: ${projectName}-mysql
    environment:
      - MYSQL_ROOT_PASSWORD=\${DB_ROOT_PASSWORD:-rootpassword}
      - MYSQL_USER=\${DB_USER:-user}
      - MYSQL_PASSWORD=\${DB_PASSWORD:-password}
      - MYSQL_DATABASE=\${DB_NAME:-${projectName}}
    ports:
      - "3306:3306"
    volumes:
      - mysql-data:/var/lib/mysql
    networks:
      - app-network
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  mysql-data:
`;
    } else if (database === 'mongodb') {
      services += `    image: mongo:7
    container_name: ${projectName}-mongodb
    environment:
      - MONGO_INITDB_ROOT_USERNAME=\${DB_USER:-admin}
      - MONGO_INITDB_ROOT_PASSWORD=\${DB_PASSWORD:-password}
      - MONGO_INITDB_DATABASE=\${DB_NAME:-${projectName}}
    ports:
      - "27017:27017"
    volumes:
      - mongodb-data:/data/db
    networks:
      - app-network
    healthcheck:
      test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  mongodb-data:
`;
    }

    services += `\nnetworks:\n  app-network:\n    driver: bridge\n`;
  } else {
    services += `    restart: unless-stopped\n`;
  }

  return services;
}

export function generateDockerIgnore(): string {
  return `# Node modules
node_modules/
npm-debug.log
yarn-error.log

# Build outputs
dist/
build/
coverage/

# Environment files
.env
.env.*
!.env.example

# Git
.git/
.gitignore

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Test files
**/*.test.ts
**/*.test.js
**/*.spec.ts
**/*.spec.js
__tests__/

# Documentation
*.md
!README.md

# Docker files (don't copy into image)
Dockerfile
docker-compose.yml
.dockerignore

# Database files
*.db
*.sqlite
prisma/migrations/

# Logs
logs/
*.log
`;
}
