import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { parseFlags, convertFlagsToOptions, hasFlags } from '../src/flags';

const originalConsoleLog = console.log;
const originalConsoleError = console.error;
let consoleOutput: string[] = [];

beforeEach(() => {
  consoleOutput = [];
  console.log = (...args: any[]) => {
    consoleOutput.push(args.map(a => String(a)).join(' '));
  };
  console.error = (...args: any[]) => {
    consoleOutput.push(args.map(a => String(a)).join(' '));
  };
});

afterEach(() => {
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
});

describe('flags.ts', () => {
  describe('hasFlags', () => {
    it('should return true when flags are present', () => {
      const args = ['node', 'script.js', '--ts', '--bun'];
      expect(hasFlags(args)).toBe(true);
    });

    it('should return false when no flags are present', () => {
      const args = ['node', 'script.js'];
      expect(hasFlags(args)).toBe(false);
    });

    it('should return true with project name and flags', () => {
      const args = ['node', 'script.js', 'my-project', '--ts'];
      expect(hasFlags(args)).toBe(true);
    });

    it('should return false with only project name', () => {
      const args = ['node', 'script.js', 'my-project'];
      expect(hasFlags(args)).toBe(false);
    });
  });

  describe('parseFlags', () => {
    it('should parse project name', () => {
      const args = ['node', 'script.js', 'my-app'];
      const result = parseFlags(args);
      expect(result?.projectName).toBe('my-app');
    });

    it('should parse TypeScript flag', () => {
      const args = ['node', 'script.js', '--ts'];
      const result = parseFlags(args);
      expect(result?.language).toBe('ts');
    });

    it('should parse JavaScript flag', () => {
      const args = ['node', 'script.js', '--js'];
      const result = parseFlags(args);
      expect(result?.language).toBe('js');
    });

    it('should parse Solidity flag', () => {
      expect(parseFlags(['node', 'script.js', '--solidity'])?.language).toBe('solidity');
      expect(parseFlags(['node', 'script.js', '--sol'])?.language).toBe('solidity');
    });

    it('should parse EVM framework flags', () => {
      expect(parseFlags(['node', 'script.js', '--hardhat'])?.evmFramework).toBe('hardhat');
      expect(parseFlags(['node', 'script.js', '--foundry'])?.evmFramework).toBe('foundry');
      expect(parseFlags(['node', 'script.js', '--no-framework'])?.evmFramework).toBe('none');
    });

    it('should parse contract type flags', () => {
      expect(parseFlags(['node', 'script.js', '--token'])?.contractType).toBe('token');
      expect(parseFlags(['node', 'script.js', '--nft'])?.contractType).toBe('nft');
      expect(parseFlags(['node', 'script.js', '--both-contracts'])?.contractType).toBe('both');
      expect(parseFlags(['node', 'script.js', '--no-contracts'])?.contractType).toBe('none');
    });

    it('should parse token standard flags', () => {
      expect(parseFlags(['node', 'script.js', '--erc20'])?.tokenStandard).toBe('erc20');
      expect(parseFlags(['node', 'script.js', '--erc721'])?.tokenStandard).toBe('erc721');
      expect(parseFlags(['node', 'script.js', '--erc1155'])?.tokenStandard).toBe('erc1155');
    });

    it('should parse proxy pattern flags', () => {
      expect(parseFlags(['node', 'script.js', '--uups'])?.proxy).toBe('uups');
      expect(parseFlags(['node', 'script.js', '--transparent'])?.proxy).toBe('transparent');
      expect(parseFlags(['node', 'script.js', '--no-proxy'])?.proxy).toBe('none');
    });

    it('should parse multiple Solidity flags together', () => {
      const args = ['node', 'script.js', 'my-token', '--solidity', '--hardhat', '--token', '--erc20', '--uups', '--npm'];
      const result = parseFlags(args);
      expect(result?.projectName).toBe('my-token');
      expect(result?.language).toBe('solidity');
      expect(result?.evmFramework).toBe('hardhat');
      expect(result?.contractType).toBe('token');
      expect(result?.tokenStandard).toBe('erc20');
      expect(result?.proxy).toBe('uups');
      expect(result?.packageManager).toBe('npm');
    });

    it('should parse package manager flags', () => {
      expect(parseFlags(['node', 'script.js', '--bun'])?.packageManager).toBe('bun');
      expect(parseFlags(['node', 'script.js', '--npm'])?.packageManager).toBe('npm');
      expect(parseFlags(['node', 'script.js', '--yarn'])?.packageManager).toBe('yarn');
      expect(parseFlags(['node', 'script.js', '--pnpm'])?.packageManager).toBe('pnpm');
    });

    it('should parse protocol flags', () => {
      expect(parseFlags(['node', 'script.js', '--http'])?.protocol).toBe('http');
      expect(parseFlags(['node', 'script.js', '--ws'])?.protocol).toBe('ws');
      expect(parseFlags(['node', 'script.js', '--websocket'])?.protocol).toBe('ws');
    });

    it('should parse CORS flags', () => {
      expect(parseFlags(['node', 'script.js', '--cors'])?.cors).toBe(true);
      expect(parseFlags(['node', 'script.js', '--no-cors'])?.cors).toBe(false);
    });

    it('should parse ORM flags', () => {
      expect(parseFlags(['node', 'script.js', '--prisma'])?.orm).toBe('prisma');
      expect(parseFlags(['node', 'script.js', '--drizzle'])?.orm).toBe('drizzle');
      expect(parseFlags(['node', 'script.js', '--typeorm'])?.orm).toBe('typeorm');
      expect(parseFlags(['node', 'script.js', '--sequelize'])?.orm).toBe('sequelize');
      expect(parseFlags(['node', 'script.js', '--mongoose'])?.orm).toBe('mongoose');
      expect(parseFlags(['node', 'script.js', '--no-orm'])?.orm).toBe('none');
    });

    it('should parse database flags', () => {
      expect(parseFlags(['node', 'script.js', '--postgresql'])?.database).toBe('postgresql');
      expect(parseFlags(['node', 'script.js', '--postgres'])?.database).toBe('postgresql');
      expect(parseFlags(['node', 'script.js', '--mysql'])?.database).toBe('mysql');
      expect(parseFlags(['node', 'script.js', '--sqlite'])?.database).toBe('sqlite');
      expect(parseFlags(['node', 'script.js', '--mongodb'])?.database).toBe('mongodb');
    });

    it('should parse aliases flags', () => {
      expect(parseFlags(['node', 'script.js', '--aliases'])?.aliases).toBe(true);
      expect(parseFlags(['node', 'script.js', '--no-aliases'])?.aliases).toBe(false);
    });

    it('should parse authentication flags', () => {
      expect(parseFlags(['node', 'script.js', '--jwt'])?.auth).toBe('jwt');
      expect(parseFlags(['node', 'script.js', '--oauth'])?.auth).toBe('oauth');
      expect(parseFlags(['node', 'script.js', '--session'])?.auth).toBe('session');
      expect(parseFlags(['node', 'script.js', '--no-auth'])?.auth).toBe('none');
    });

    it('should parse testing flags', () => {
      expect(parseFlags(['node', 'script.js', '--jest'])?.testing).toBe('jest');
      expect(parseFlags(['node', 'script.js', '--vitest'])?.testing).toBe('vitest');
      expect(parseFlags(['node', 'script.js', '--no-testing'])?.testing).toBe('none');
    });

    it('should parse linting flags', () => {
      expect(parseFlags(['node', 'script.js', '--linting'])?.linting).toBe(true);
      expect(parseFlags(['node', 'script.js', '--no-linting'])?.linting).toBe(false);
    });

    it('should parse docker flags', () => {
      expect(parseFlags(['node', 'script.js', '--docker'])?.docker).toBe(true);
      expect(parseFlags(['node', 'script.js', '--no-docker'])?.docker).toBe(false);
    });

    it('should parse CI/CD flags', () => {
      expect(parseFlags(['node', 'script.js', '--github'])?.cicd).toBe('github');
      expect(parseFlags(['node', 'script.js', '--gitlab'])?.cicd).toBe('gitlab');
      expect(parseFlags(['node', 'script.js', '--circleci'])?.cicd).toBe('circleci');
      expect(parseFlags(['node', 'script.js', '--no-cicd'])?.cicd).toBe('none');
    });

    it('should parse multiple flags together', () => {
      const args = ['node', 'script.js', 'my-app', '--ts', '--bun', '--prisma', '--postgresql', '--jwt'];
      const result = parseFlags(args);
      expect(result?.projectName).toBe('my-app');
      expect(result?.language).toBe('ts');
      expect(result?.packageManager).toBe('bun');
      expect(result?.orm).toBe('prisma');
      expect(result?.database).toBe('postgresql');
      expect(result?.auth).toBe('jwt');
    });

    it('should return null for help flag', () => {
      expect(parseFlags(['node', 'script.js', '--help'])).toBeNull();
      // Note: -h is not treated as a flag, only --help or -h as standalone is supported
      // The current implementation treats -h as a project name since it doesn't start with --
    });

    it('should return null for unknown flag', () => {
      const result = parseFlags(['node', 'script.js', '--unknown']);
      expect(result).toBeNull();
      expect(consoleOutput.some(s => s.includes('Unknown flag'))).toBe(true);
    });
  });

  describe('convertFlagsToOptions', () => {
    it('should use defaults when no flags are provided', () => {
      const options = convertFlagsToOptions({});
      expect(options.projectName).toBe('my-churn-app');
      expect(options.language).toBe('ts');
      expect(options.packageManager).toBe('bun');
      expect(options.protocol).toBe('http');
      expect(options.orm).toBe('prisma');
      expect(options.aliases).toBe(true);
      expect(options.linting).toBe(true);
      expect(options.docker).toBe(false);
    });

    it('should set CORS to true by default for HTTP', () => {
      const options = convertFlagsToOptions({ protocol: 'http' });
      expect(options.cors).toBe(true);
    });

    it('should set CORS to undefined for WebSocket', () => {
      const options = convertFlagsToOptions({ protocol: 'ws' });
      expect(options.cors).toBeUndefined();
    });

    it('should auto-set database to postgresql for non-mongoose ORMs', () => {
      const options = convertFlagsToOptions({ orm: 'prisma' });
      expect(options.database).toBe('postgresql');
    });

    it('should auto-set database to mongodb for mongoose', () => {
      const options = convertFlagsToOptions({ orm: 'mongoose' });
      expect(options.database).toBe('mongodb');
    });

    it('should not set database when ORM is none', () => {
      const options = convertFlagsToOptions({ orm: 'none' });
      expect(options.database).toBeUndefined();
    });

    it('should respect explicitly set database', () => {
      const options = convertFlagsToOptions({ orm: 'prisma', database: 'mysql' });
      expect(options.database).toBe('mysql');
    });

    it('should set auth, testing, cicd to none by default', () => {
      const options = convertFlagsToOptions({});
      expect(options.auth).toBe('none');
      expect(options.testing).toBe('none');
      expect(options.cicd).toBe('none');
    });

    it('should respect all provided flags', () => {
      const flags = {
        projectName: 'test-app',
        language: 'js' as const,
        packageManager: 'npm' as const,
        protocol: 'ws' as const,
        orm: 'drizzle' as const,
        database: 'sqlite' as const,
        aliases: false,
        auth: 'jwt' as const,
        testing: 'vitest' as const,
        linting: false,
        docker: true,
        cicd: 'github' as const,
      };

      const options = convertFlagsToOptions(flags);
      expect(options.projectName).toBe('test-app');
      expect(options.language).toBe('js');
      expect(options.packageManager).toBe('npm');
      expect(options.protocol).toBe('ws');
      expect(options.orm).toBe('drizzle');
      expect(options.database).toBe('sqlite');
      expect(options.aliases).toBe(false);
      expect(options.auth).toBe('jwt');
      expect(options.testing).toBe('vitest');
      expect(options.linting).toBe(false);
      expect(options.docker).toBe(true);
      expect(options.cicd).toBe('github');
      expect(options.targetDir).toBe('./test-app');
    });

    it('should generate correct target directory', () => {
      const options1 = convertFlagsToOptions({ projectName: 'my-app' });
      expect(options1.targetDir).toBe('./my-app');

      const options2 = convertFlagsToOptions({});
      expect(options2.targetDir).toBe('./my-churn-app');
    });

    it('should handle Solidity language with EVM options', () => {
      const flags = {
        projectName: 'my-token',
        language: 'solidity' as const,
        packageManager: 'npm' as const,
        evmFramework: 'hardhat' as const,
        contractType: 'token' as const,
        tokenStandard: 'erc20' as const,
        proxy: 'uups' as const,
      };

      const options = convertFlagsToOptions(flags);
      expect(options.projectName).toBe('my-token');
      expect(options.language).toBe('solidity');
      expect(options.packageManager).toBe('npm');
      expect(options.evmFramework).toBe('hardhat');
      expect(options.contractType).toBe('token');
      expect(options.tokenStandard).toBe('erc20');
      expect(options.proxy).toBe('uups');
      expect(options.targetDir).toBe('./my-token');
    });

    it('should set default EVM options for Solidity projects', () => {
      const flags = {
        language: 'solidity' as const,
      };

      const options = convertFlagsToOptions(flags);
      expect(options.language).toBe('solidity');
      expect(options.evmFramework).toBe('hardhat');
      expect(options.contractType).toBe('token');
      expect(options.tokenStandard).toBe('erc20');
      expect(options.proxy).toBe('none');
    });

    it('should set tokenStandard to erc721 when contractType is nft', () => {
      const flags = {
        language: 'solidity' as const,
        contractType: 'nft' as const,
      };

      const options = convertFlagsToOptions(flags);
      expect(options.contractType).toBe('nft');
      expect(options.tokenStandard).toBe('erc721');
    });

    it('should handle Foundry framework with NFT contract', () => {
      const flags = {
        language: 'solidity' as const,
        evmFramework: 'foundry' as const,
        contractType: 'nft' as const,
        tokenStandard: 'erc1155' as const,
        proxy: 'transparent' as const,
      };

      const options = convertFlagsToOptions(flags);
      expect(options.evmFramework).toBe('foundry');
      expect(options.contractType).toBe('nft');
      expect(options.tokenStandard).toBe('erc1155');
      expect(options.proxy).toBe('transparent');
    });
  });
});
