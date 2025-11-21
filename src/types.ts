export interface ProjectOptions {
  projectName: string;
  language: 'js' | 'ts' | 'solidity';
  packageManager: 'bun' | 'yarn' | 'pnpm' | 'npm';
  protocol: 'http' | 'ws';
  orm: 'none' | 'prisma' | 'drizzle' | 'typeorm' | 'sequelize' | 'mongoose';
  database?: 'postgresql' | 'mysql' | 'sqlite' | 'mongodb';
  aliases: boolean;
  cors?: boolean;
  auth?: 'none' | 'jwt' | 'oauth' | 'session';
  testing?: 'none' | 'jest' | 'vitest';
  linting?: boolean;
  docker?: boolean;
  cicd?: 'none' | 'github' | 'gitlab' | 'circleci';
  targetDir: string;
  // Solidity/EVM-specific options
  evmFramework?: 'hardhat' | 'foundry' | 'none';
  contractType?: 'token' | 'nft' | 'both' | 'none';
  tokenStandard?: 'erc20' | 'erc721' | 'erc1155';
  proxy?: 'none' | 'uups' | 'transparent';
} 