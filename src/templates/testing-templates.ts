import type { ProjectOptions } from '../types';

export function generateJestConfig(options: ProjectOptions): string {
  const { language } = options;

  if (language === 'ts') {
    return `/** @type {import('jest').Config} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
`;
  } else {
    return `/** @type {import('jest').Config} */
export default {
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  collectCoverageFrom: [
    '**/*.js',
    '!**/node_modules/**',
    '!**/coverage/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
};
`;
  }
}

export function generateVitestConfig(options: ProjectOptions): string {
  return `import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'dist/', '**/*.d.ts', '**/__tests__/**'],
    },
  },
});
`;
}

export function generateTestExample(options: ProjectOptions): string {
  const { language, protocol, testing } = options;

  const importSyntax = testing === 'jest'
    ? `import request from 'supertest';`
    : `import { describe, it, expect } from 'vitest';\nimport request from 'supertest';`;

  if (protocol === 'http') {
    return `${importSyntax}
import { app } from '../index';

describe('GET /', () => {
  it('should return hello message', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
  });
});

describe('GET /health', () => {
  it('should return health status', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });
});
`;
  } else {
    return `${testing === 'vitest' ? `import { describe, it, expect } from 'vitest';` : ''}
import WebSocket from 'ws';

describe('WebSocket Server', () => {
  it('should connect and echo messages', (done) => {
    const ws = new WebSocket('ws://localhost:3000');

    ws.on('open', () => {
      ws.send('Hello Server');
    });

    ws.on('message', (data) => {
      expect(data.toString()).toContain('Echo: Hello Server');
      ws.close();
      done();
    });

    ws.on('error', (error) => {
      done(error);
    });
  });
});
`;
  }
}
