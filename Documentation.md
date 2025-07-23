# Create Churn CLI Documentation

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Workflow and Core Logic](#workflow-and-core-logic)
- [Detailed File Generation](#detailed-file-generation)
  - [Main File Generation](#main-file-generation)
  - [Package.json Generation](#packagejson-generation)
  - [Prisma Schema Generation](#prisma-schema-generation)
  - [tsconfig.json Generation](#tsconfigjson-generation)
- [The Generated Project](#the-generated-project)
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

- **[Node.js](https://nodejs.org/)**: The JavaScript runtime used to execute the CLI.
- **[TypeScript](https://www.typescriptlang.org/)**: For static typing, improving code quality and maintainability.
- **[Bun](https://bun.sh/)**: A fast all-in-one JavaScript toolkit used for package management, running scripts, and bundling the final executable.
- **[prompts](https://github.com/terkelg/prompts)**: A lightweight and user-friendly library for creating interactive command-line prompts to gather user requirements.
- **[chalk](https://github.com/chalk/chalk)**: Used to add color and styling to the terminal output, improving readability.
- **[fs-extra](https://github.com/jprichardson/fs-extra)**: A module that adds file system methods that aren't included in the native `fs` module, like `ensureDir` and `writeJson`, simplifying file operations.
- **[Prisma](https://www.prisma.io/)**: A next-generation ORM for Node.js and TypeScript. It's offered as an option for database integration.
- **[Express](https://expressjs.com/)**: A minimal and flexible Node.js web application framework, used when the user selects the HTTP protocol.
- **[ws](https://github.com/websockets/ws)**: A high-performance WebSocket implementation, used when the user selects the WebSocket protocol.

## Project Structure

The project is organized as follows:

```
.
├── src/
│   ├── prompts.ts        # Handles user input through interactive prompts.
│   ├── scaffold.ts       # Core logic for creating the project structure and files.
│   ├── types.ts          # TypeScript type definitions, primarily the ProjectOptions interface.
│   ├── utils.ts          # Utility functions for displaying formatted messages (e.g., welcome/success banners).
│   └── templates/
│       ├── main-file.ts      # Generates the main entry file (index.ts or index.js).
│       ├── package-json.ts   # Generates the package.json file.
│       ├── prisma-schema.ts  # Generates the Prisma schema file.
│       └── tsconfig.ts       # Generates the tsconfig.json file.
├── test/
│   └── ...               # Test files for the project.
├── package.json          # Project dependencies and scripts.
└── tsconfig.json         # TypeScript configuration for the CLI tool itself.
```

## Workflow and Core Logic

The CLI operates in a straightforward sequence:

1.  **Initialization**: The `index.ts` file is the entry point. It calls `showWelcome()` to display a banner and then invokes `promptUser()`.
2.  **User Configuration**: The `promptUser` function in `src/prompts.ts` displays a series of questions. The answers are collected into a `ProjectOptions` object. If the user cancels, the process exits.
3.  **Scaffolding**: The `ProjectOptions` object is passed to the `scaffoldProject` function in `src/scaffold.ts`.
4.  **File Creation**: `scaffoldProject` creates the main project directory. It then calls the various `generate...` functions from the `src/templates` directory, passing the `options` object to each.
5.  **Dynamic Content Generation**: Each template function (`generateMainFile`, `generatePackageJson`, etc.) uses the properties of the `options` object to conditionally include code, dependencies, and scripts. For example, if `options.orm === 'prisma'`, Prisma-related dependencies and scripts are added to `package.json`.
6.  **Writing to Disk**: The generated content is written to the corresponding files within the new project directory using `fs-extra`.
7.  **Dependency Installation**: `scaffoldProject` changes the current working directory to the new project's root and runs the appropriate install command (`bun install`, `npm install`, etc.).
8.  **Completion**: Finally, the `showSuccess` function is called to inform the user that the project is ready and provide the next steps.

## Detailed File Generation

Here are some key code snippets that illustrate the template generation logic:

### Main File Generation

The `generateMainFile` function in `src/templates/main-file.ts` generates the main entry file (`index.ts` or `index.js`). The content varies based on the selected protocol (HTTP or WebSocket) and ORM (Prisma or none).

```typescript
// src/templates/main-file.ts
export function generateMainFile(options: ProjectOptions): string {
  // ...
  if (protocol === 'http') {
    imports += `import express from 'express';\n`;
    // ...
  } else if (protocol === 'ws') {
    imports += `import { WebSocketServer } from 'ws';\n`;
    // ...
  }
  if (orm === 'prisma') {
    imports += `import { PrismaClient } from '@prisma/client';\n`;
    // ...
  }
  // ...
}
```

### Package.json Generation

The `generatePackageJson` function in `src/templates/package-json.ts` creates the `package.json` file. It dynamically adds dependencies, devDependencies, and scripts based on the user's choices.

```typescript
// src/templates/package-json.ts
export function generatePackageJson(options: ProjectOptions): any {
  // ...
  if (language === 'ts') {
    basePackage.devDependencies["typescript"] = "^5.0.0";
  }
  if (protocol === 'http') {
    basePackage.dependencies["express"] = "^4.18.0";
  }
  if (orm === 'prisma') {
    basePackage.dependencies["@prisma/client"] = "^5.0.0";
    basePackage.devDependencies["prisma"] = "^5.0.0";
  }
  // ...
}
```

### Prisma Schema Generation

The `generatePrismaSchema` function in `src/templates/prisma-schema.ts` generates a sample `schema.prisma` file when the user chooses to use Prisma.

```typescript
// src/templates/prisma-schema.ts
export function generatePrismaSchema(): string {
  return `// ...
generator client {
  provider = "prisma-client-js"
}
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
// ... example models
`;
}
```

### tsconfig.json Generation

The `generateTsConfig` function in `src/templates/tsconfig.ts` generates the `tsconfig.json` file for TypeScript projects. It includes options for path aliases if the user enables them.

```typescript
// src/templates/tsconfig.ts
export function generateTsConfig(options: ProjectOptions): any {
  // ...
  if (aliases) {
    baseConfig.compilerOptions.baseUrl = ".";
    baseConfig.compilerOptions.paths = {
      "@/*": ["src/*"],
      // ...
    };
  }
  return baseConfig;
}
```

## The Generated Project

After running `create-churn`, you will have a new directory with the following structure (example with TypeScript and Prisma):

```
my-churn-app/
├── prisma/
│   └── schema.prisma   # Prisma schema for database models
├── src/
│   └── index.ts        # Main application entry point
├── .gitignore          # Git ignore file
├── package.json        # Project dependencies and scripts
├── README.md           # Project-specific README
└── tsconfig.json       # TypeScript configuration
```

The generated `package.json` will contain scripts to run, build, and test the application, such as `dev`, `build`, and `start`.

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