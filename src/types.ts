export interface ProjectOptions {
  projectName: string;
  language: 'js' | 'ts';
  packageManager: 'bun' | 'yarn' | 'pnpm' | 'npm';
  protocol: 'http' | 'ws';
  orm: 'none' | 'prisma';
  aliases: boolean;
  targetDir: string;
} 