import type { ProjectOptions } from '../types';

export function generateEnvExample(options: ProjectOptions): string {
  const { protocol, orm, database, auth, cors } = options;

  let envContent = `# Application
NODE_ENV=development
PORT=3000
`;

  // Database configuration
  if (orm !== 'none') {
    envContent += `\n# Database\n`;

    if (database === 'postgresql') {
      envContent += `DATABASE_URL=postgresql://user:password@localhost:5432/dbname\n`;
    } else if (database === 'mysql') {
      envContent += `DATABASE_URL=mysql://user:password@localhost:3306/dbname\n`;
    } else if (database === 'sqlite') {
      envContent += `DATABASE_URL=./dev.db\n`;
    } else if (database === 'mongodb') {
      envContent += `DATABASE_URL=mongodb://localhost:27017/dbname\n`;
    }
  }

  // Authentication configuration
  if (auth === 'jwt') {
    envContent += `\n# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
`;
  } else if (auth === 'oauth') {
    envContent += `\n# OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
OAUTH_CALLBACK_URL=http://localhost:3000/auth/callback
`;
  } else if (auth === 'session') {
    envContent += `\n# Session Configuration
SESSION_SECRET=your-super-secret-session-key-change-this-in-production
`;
  }

  // CORS configuration
  if (protocol === 'http' && cors) {
    envContent += `\n# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
`;
  }

  return envContent;
}

export function generateEnvValidation(options: ProjectOptions): string {
  const { language } = options;

  if (language === 'ts') {
    return `import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000'),
  DATABASE_URL: z.string().optional(),
  JWT_SECRET: z.string().optional(),
  SESSION_SECRET: z.string().optional(),
});

export const env = envSchema.parse(process.env);

export type Env = z.infer<typeof envSchema>;
`;
  } else {
    return `import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000'),
  DATABASE_URL: z.string().optional(),
  JWT_SECRET: z.string().optional(),
  SESSION_SECRET: z.string().optional(),
});

export const env = envSchema.parse(process.env);
`;
  }
}
