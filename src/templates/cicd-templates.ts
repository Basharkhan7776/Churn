import type { ProjectOptions } from '../types';

export function generateGitHubActions(options: ProjectOptions): string {
  const { language, packageManager, testing } = options;

  let setupStep = '';
  let installCmd = '';
  let buildCmd = '';
  let testCmd = '';

  if (packageManager === 'bun') {
    setupStep = `      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest`;
    installCmd = 'bun install';
    buildCmd = language === 'ts' ? 'bun run build' : '';
    testCmd = testing !== 'none' ? 'bun test' : '';
  } else {
    setupStep = `      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: '${packageManager}'`;

    installCmd = packageManager === 'yarn' ? 'yarn install --frozen-lockfile' :
                 packageManager === 'pnpm' ? 'pnpm install --frozen-lockfile' :
                 'npm ci';
    buildCmd = language === 'ts' ? `${packageManager === 'npm' ? 'npm run' : packageManager} build` : '';
    testCmd = testing !== 'none' ? `${packageManager === 'npm' ? 'npm run' : packageManager} test` : '';
  }

  return `name: CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

${setupStep}

      - name: Install dependencies
        run: ${installCmd}

${language === 'ts' ? `      - name: Type check
        run: ${packageManager === 'bun' ? 'bun' : packageManager === 'npm' ? 'npm run' : packageManager} tsc --noEmit

` : ''}${testing !== 'none' ? `      - name: Run tests
        run: ${testCmd}

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        if: success()
        with:
          files: ./coverage/lcov.info

` : ''}${buildCmd ? `      - name: Build
        run: ${buildCmd}

` : ''}  lint:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

${setupStep}

      - name: Install dependencies
        run: ${installCmd}

      - name: Run linter
        run: ${packageManager === 'npm' ? 'npm run' : packageManager} lint

  deploy:
    needs: [test, lint]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Deploy to production
        run: echo "Add your deployment steps here"
        # Example: Deploy to AWS, Vercel, Railway, etc.
`;
}

export function generateGitLabCI(options: ProjectOptions): string {
  const { language, packageManager, testing } = options;

  let image = packageManager === 'bun' ? 'oven/bun:latest' : 'node:20-alpine';
  let installCmd = packageManager === 'bun' ? 'bun install' :
                   packageManager === 'yarn' ? 'yarn install --frozen-lockfile' :
                   packageManager === 'pnpm' ? 'pnpm install --frozen-lockfile' :
                   'npm ci';

  return `image: ${image}

stages:
  - install
  - lint
  - test
  - build
  - deploy

cache:
  paths:
    - node_modules/

install:
  stage: install
  script:
    - ${installCmd}
  artifacts:
    paths:
      - node_modules/

lint:
  stage: lint
  script:
    - ${packageManager === 'npm' ? 'npm run' : packageManager} lint
  dependencies:
    - install

${testing !== 'none' ? `test:
  stage: test
  script:
    - ${packageManager === 'bun' ? 'bun test' : packageManager === 'npm' ? 'npm run' : packageManager + ' run'} test
  coverage: '/Coverage: \\d+\\.\\d+%/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml
  dependencies:
    - install

` : ''}${language === 'ts' ? `build:
  stage: build
  script:
    - ${packageManager === 'bun' ? 'bun run' : packageManager === 'npm' ? 'npm run' : packageManager} build
  artifacts:
    paths:
      - dist/
  dependencies:
    - install

` : ''}deploy:
  stage: deploy
  script:
    - echo "Add your deployment steps here"
  only:
    - main
  dependencies:
    - ${language === 'ts' ? 'build' : 'install'}
`;
}

export function generateCircleCI(options: ProjectOptions): string {
  const { language, packageManager, testing } = options;

  let executor = packageManager === 'bun' ? 'bun/default' : 'node/default';
  let installCmd = packageManager === 'bun' ? 'bun install' :
                   packageManager === 'yarn' ? 'yarn install --frozen-lockfile' :
                   packageManager === 'pnpm' ? 'pnpm install --frozen-lockfile' :
                   'npm ci';

  return `version: 2.1

orbs:
  ${packageManager === 'bun' ? 'bun: oven/bun@1.0.0' : 'node: circleci/node@5.1.0'}

workflows:
  build-test-deploy:
    jobs:
      - install
      - lint:
          requires:
            - install
      ${testing !== 'none' ? `- test:
          requires:
            - install
      ` : ''}${language === 'ts' ? `- build:
          requires:
            - install
      ` : ''}- deploy:
          requires:
            - lint
            ${testing !== 'none' ? '- test' : ''}
            ${language === 'ts' ? '- build' : ''}
          filters:
            branches:
              only: main

jobs:
  install:
    executor: ${executor}
    steps:
      - checkout
      - restore_cache:
          keys:
            - deps-{{ checksum "package.json" }}
      - run:
          name: Install dependencies
          command: ${installCmd}
      - save_cache:
          key: deps-{{ checksum "package.json" }}
          paths:
            - node_modules
      - persist_to_workspace:
          root: .
          paths:
            - node_modules

  lint:
    executor: ${executor}
    steps:
      - checkout
      - attach_workspace:
          at: .
      - run:
          name: Run linter
          command: ${packageManager === 'npm' ? 'npm run' : packageManager} lint

  ${testing !== 'none' ? `test:
    executor: ${executor}
    steps:
      - checkout
      - attach_workspace:
          at: .
      - run:
          name: Run tests
          command: ${packageManager === 'bun' ? 'bun test' : packageManager === 'npm' ? 'npm run' : packageManager + ' run'} test
      - store_test_results:
          path: coverage
      - store_artifacts:
          path: coverage

  ` : ''}${language === 'ts' ? `build:
    executor: ${executor}
    steps:
      - checkout
      - attach_workspace:
          at: .
      - run:
          name: Build
          command: ${packageManager === 'bun' ? 'bun run' : packageManager === 'npm' ? 'npm run' : packageManager} build
      - persist_to_workspace:
          root: .
          paths:
            - dist

  ` : ''}deploy:
    executor: ${executor}
    steps:
      - checkout
      - attach_workspace:
          at: .
      - run:
          name: Deploy
          command: echo "Add your deployment steps here"
`;
}
