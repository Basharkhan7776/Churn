import { generatePackageJson } from './src/templates/package-json';

const npmOptions = {
  projectName: 'npm-test',
  language: 'js' as const,
  packageManager: 'npm' as const,
  protocol: 'http' as const,
  orm: 'none' as const,
  aliases: false,
  targetDir: './npm-test'
};

const result = generatePackageJson(npmOptions);
console.log('Generated package.json for npm:');
console.log(JSON.stringify(result, null, 2)); 