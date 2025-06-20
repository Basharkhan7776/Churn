import type { ProjectOptions } from '../types';

export function generateTsConfig(options: ProjectOptions): any {
  const { aliases } = options;

  const baseConfig: any = {
    "compilerOptions": {
      "target": "ES2022",
      "module": "ESNext",
      "moduleResolution": "bundler",
      "allowJs": true,
      "strict": true,
      "noUnusedLocals": true,
      "noUnusedParameters": true,
      "noFallthroughCasesInSwitch": true,
      "skipLibCheck": true,
      "esModuleInterop": true,
      "allowSyntheticDefaultImports": true,
      "forceConsistentCasingInFileNames": true,
      "resolveJsonModule": true,
      "isolatedModules": true,
      "verbatimModuleSyntax": true,
      "types": ["bun-types"],
      "outDir": "dist"
    },
    "include": [
      "**/*.ts",
      "**/*.tsx"
    ],
    "exclude": [
      "node_modules",
      "dist"
    ]
  };

  // Add path aliases if enabled
  if (aliases) {
    baseConfig.compilerOptions.baseUrl = ".";
    baseConfig.compilerOptions.paths = {
      "@/*": ["src/*"],
      "@/config": ["src/config.ts"],
      "@/utils": ["src/utils.ts"],
      "@/types": ["src/types.ts"]
    };
  }

  return baseConfig;
} 