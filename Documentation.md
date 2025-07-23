
# Create Churn CLI Documentation

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Core Logic](#core-logic)
  - [1. User Prompts](#1-user-prompts)
  - [2. Project Scaffolding](#2-project-scaffolding)
  - [3. Template Generation](#3-template-generation)
- [Code Snippets](#code-snippets)
  - [Main File Generation](#main-file-generation)
  - [Package.json Generation](#packagejson-generation)
  - [Prisma Schema Generation](#prisma-schema-generation)
  - [tsconfig.json Generation](#tsconfigjson-generation)
- [How to Use](#how-to-use)
- [Development](#development)

## Introduction

**Create Churn CLI** is a command-line tool for scaffolding customizable backend projects. It simplifies the process of setting up a new backend application by providing a set of interactive prompts to configure the project according to the user's preferences.

## Features

- **Multiple Languages**: Supports both TypeScript and JavaScript.
- **Package Managers**: Integrates with Bun, npm, Yarn, and pnpm.
- **Protocols**: Allows choosing between HTTP (REST API) and WebSocket.
- **ORM**: Provides an option to include Prisma for database management.
- **Path Aliases**: Supports TypeScript path mapping for cleaner imports.
- **Zero Configuration**: Generates ready-to-run projects out of the box.

## Technologies Used

- **[TypeScript](https://www.typescriptlang.org/)**: The primary language for the CLI and generated projects.
- **[Node.js](https://nodejs.org/)**: The runtime environment for the CLI.
- **[Bun](https://bun.sh/)**: Used as a package manager and for building the project.
- **[prompts](https://github.com/terkelg/prompts)**: For creating interactive command-line prompts.
- **[chalk](https://github.com/chalk/chalk)**: For styling the command-line output.
- **[fs-extra](https://github.com/jprichardson/fs-extra)**: For file system operations.
- **[ejs](https://ejs.co/)**: (Not directly used in the provided files, but listed in `package.json`) A templating engine.
- **[Prisma](https://www.prisma.io/)**: An open-source database toolkit.
- **[Express](https://expressjs.com/)**: A web application framework for Node.js (for HTTP protocol).
- **[ws](https://github.com/websockets/ws)**: A WebSocket library for Node.js (for WebSocket protocol).

## Project Structure

The project is organized as follows:

```
.
├── src/
│   ├── prompts.ts        # Handles user input through interactive prompts
│   ├── scaffold.ts       # Core logic for creating the project structure and files
│   ├── types.ts          # TypeScript type definitions
│   ├── utils.ts          # Utility functions (e.g., for displaying messages)
│   └── templates/
│       ├── main-file.ts      # Generates the main entry file (index.ts or index.js)
│       ├── package-json.ts   # Generates the package.json file
│       ├── prisma-schema.ts  # Generates the Prisma schema file
│       └── tsconfig.ts       # Generates the tsconfig.json file
├── test/
│   └── ...               # Test files for the project
├── package.json          # Project dependencies and scripts
└── tsconfig.json         # TypeScript configuration
```

## Core Logic

The core logic of the CLI can be broken down into three main parts:

### 1. User Prompts

- The `promptUser` function in `src/prompts.ts` is responsible for asking the user a series of questions to determine the project's configuration.
- It uses the `prompts` library to create interactive prompts for:
  - Project name
  - Language (TypeScript/JavaScript)
  - Package manager (Bun/Yarn/pnpm/npm)
  - Protocol (HTTP/WebSocket)
  - ORM (None/Prisma)
  - Path aliases (Yes/No)
- The user's selections are returned as a `ProjectOptions` object.

### 2. Project Scaffolding

- The `scaffoldProject` function in `src/scaffold.ts` orchestrates the project creation process.
- It performs the following steps:
  1.  **Creates the project directory**: Based on the user-provided project name.
  2.  **Generates project files**: Calls functions from the `src/templates` directory to create `package.json`, the main entry file, `tsconfig.json` (if applicable), and `prisma/schema.prisma` (if applicable).
  3.  **Initializes the package manager**: Runs the appropriate installation command (`bun install`, `yarn install`, etc.) in the newly created project directory.

### 3. Template Generation

- The `src/templates` directory contains functions that generate the content of the project files based on the user's selected options.
- Each function takes the `ProjectOptions` object as input and returns a string or JSON object representing the file's content.
- This approach allows for dynamic and customizable file generation.

## Code Snippets

Here are some key code snippets that illustrate the template generation logic:

### Main File Generation

The `generateMainFile` function in `src/templates/main-file.ts` generates the main entry file (`index.ts` or `index.js`). The content varies based on the selected protocol (HTTP or WebSocket) and ORM (Prisma or none).

```typescript
// src/templates/main-file.ts

export function generateMainFile(options: ProjectOptions): string {
  const { language, protocol, orm, aliases } = options;

  if (language === 'ts') {
    return generateTypeScriptMain(options);
  } else {
    return generateJavaScriptMain(options);
  }
}

function generateTypeScriptMain(options: ProjectOptions): string {
  const { protocol, orm, aliases } = options;

  let imports = '';
  let setupCode = '';
  let mainCode = '';

  // ... (logic to add imports, setup code, and main code based on options)

  return `${imports}\n${setupCode}${mainCode}`;
}
```

### Package.json Generation

The `generatePackageJson` function in `src/templates/package-json.ts` creates the `package.json` file. It dynamically adds dependencies, devDependencies, and scripts based on the user's choices.

```typescript
// src/templates/package-json.ts

export function generatePackageJson(options: ProjectOptions): any {
  const { projectName, language, packageManager, protocol, orm, aliases } = options;

  const basePackage: any = {
    name: projectName,
    version: "1.0.0",
    // ... (base package.json structure)
  };

  // ... (logic to add dependencies and scripts based on options)

  return basePackage;
}
```

### Prisma Schema Generation

The `generatePrismaSchema` function in `src/templates/prisma-schema.ts` generates a sample `schema.prisma` file when the user chooses to use Prisma.

```typescript
// src/templates/prisma-schema.ts

export function generatePrismaSchema(): string {
  return `// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql" // or "mysql" or "sqlite"
  url      = env("DATABASE_URL")
}

// ... (example models)
`;
}
```

### tsconfig.json Generation

The `generateTsConfig` function in `src/templates/tsconfig.ts` generates the `tsconfig.json` file for TypeScript projects. It includes options for path aliases if the user enables them.

```typescript
// src/templates/tsconfig.ts

export function generateTsConfig(options: ProjectOptions): any {
  const { aliases } = options;

  const baseConfig: any = {
    "compilerOptions": {
      // ... (base TypeScript compiler options)
    },
    // ... (include/exclude options)
  };

  if (aliases) {
    baseConfig.compilerOptions.baseUrl = ".";
    base.compilerOptions.paths = {
      "@/*": ["src/*"],
      // ... (other path aliases)
    };
  }

  return baseConfig;
}
```

## How to Use

To use the Create Churn CLI, run the following command in your terminal:

```bash
npx create-churn@latest
```

This will start the interactive prompts to guide you through the project setup.

## Development

To contribute to the development of the Create Churn CLI:

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/Basharkhan7776/Churn.git
    cd Churn
    ```
2.  **Install dependencies**:
    ```bash
    bun install
    ```
3.  **Run in development mode**:
    ```bash
    bun run dev
    ```
4.  **Run tests**:
    ```bash
    bun test
    ```
5.  **Build the project**:
    ```bash
    bun run build
    ```
