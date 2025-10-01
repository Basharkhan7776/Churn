import type { ProjectOptions } from '../types';

export function generateDrizzleSchema(options: ProjectOptions): string {
  const { database } = options;

  if (database === 'postgresql') {
    return `import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
`;
  } else if (database === 'mysql') {
    return `import { mysqlTable, serial, varchar, timestamp } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
`;
  } else if (database === 'sqlite') {
    return `import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});
`;
  }

  return '';
}

export function generateDrizzleConfig(options: ProjectOptions): string {
  const { database } = options;

  if (database === 'postgresql') {
    return `import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;
`;
  } else if (database === 'mysql') {
    return `import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  driver: 'mysql2',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;
`;
  } else if (database === 'sqlite') {
    return `import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  driver: 'better-sqlite3',
  dbCredentials: {
    url: process.env.DATABASE_URL || './sqlite.db',
  },
} satisfies Config;
`;
  }

  return '';
}

export function generateDrizzleClient(options: ProjectOptions): string {
  const { database } = options;

  if (database === 'postgresql') {
    return `import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });
`;
  } else if (database === 'mysql') {
    return `import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';

const poolConnection = mysql.createPool({
  uri: process.env.DATABASE_URL,
});

export const db = drizzle(poolConnection, { schema });
`;
  } else if (database === 'sqlite') {
    return `import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';

const sqlite = new Database(process.env.DATABASE_URL || './sqlite.db');

export const db = drizzle(sqlite, { schema });
`;
  }

  return '';
}
