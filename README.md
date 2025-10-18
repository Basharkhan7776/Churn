# Create Churn CLI

```
   ______                __          ________
  / ____/_______  ____ _/ /____     / ____/ /_  __  ___________ _
 / /   / ___/ _ \/ __ `/ __/ _ \   / /   / __ \/ / / / ___/ __ `/
/ /___/ /  /  __/ /_/ / /_/  __/  / /___/ / / / /_/ / /  / /_/ /
\____/_/   \___/\__,_/\__/\___/   \____/_/ /_/\__,_/_/  /\__,_/

```

> Scaffold production-ready backend projects with ease

A powerful CLI tool to create fully configured backend projects with your preferred stack. Choose from multiple ORMs, databases, authentication methods, testing frameworks, and deployment configurations—all in one command.

## Quick Start

```bash
npx create-churn@latest
```

## Features

### Database & ORMs
- **6 ORM Options**: Prisma, Drizzle, TypeORM, Sequelize, Mongoose, or None
- **4 Databases**: PostgreSQL, MySQL, SQLite, MongoDB
- **Auto-configured**: Connection strings, models, and migrations

### Authentication
- **JWT**: Token-based authentication with middleware
- **OAuth**: Google & GitHub integration
- **Session**: Express session-based auth
- **Security**: Environment-based secrets management

### Testing
- **Jest**: Full-featured testing with coverage
- **Vitest**: Fast, Vite-powered testing
- **Pre-configured**: Test examples for HTTP/WebSocket APIs

### Code Quality
- **ESLint**: Automatic linting with TypeScript support
- **Prettier**: Consistent code formatting
- **Husky**: Git hooks for pre-commit validation
- **lint-staged**: Run linters on staged files

### Docker & Deployment
- **Docker**: Multi-stage builds with health checks
- **docker-compose**: Database orchestration
- **CI/CD**: GitHub Actions, GitLab CI, CircleCI

### Developer Experience
- **Languages**: TypeScript & JavaScript
- **Package Managers**: Bun, npm, yarn, pnpm
- **Protocols**: HTTP (REST API with optional CORS) & WebSocket
- **Path Aliases**: TypeScript path mapping
- **Environment**: Type-safe env variables with Zod
- **Zero Config**: Ready-to-run projects out of the box

## What You Get

```
my-project/
├── src/
│   ├── index.ts              # Main entry point
│   ├── config/
│   │   ├── database.ts       # Database connection (if ORM selected)
│   │   └── env.ts            # Environment validation
│   ├── auth/                 # Authentication logic (if selected)
│   ├── models/               # Database models (ORM-specific)
│   └── entities/             # TypeORM entities (if TypeORM)
├── __tests__/                # Test files (if testing selected)
├── prisma/                   # Prisma schema (if Prisma)
├── drizzle/                  # Drizzle migrations (if Drizzle)
├── .github/workflows/        # GitHub Actions (if selected)
├── .gitlab-ci.yml            # GitLab CI (if selected)
├── .circleci/config.yml      # CircleCI (if selected)
├── Dockerfile                # Docker config (if selected)
├── docker-compose.yml        # Docker Compose (if selected)
├── .eslintrc.json            # ESLint config (if linting)
├── .prettierrc               # Prettier config (if linting)
├── tsconfig.json             # TypeScript config (if TS)
├── package.json              # Dependencies & scripts
├── .env.example              # Environment template
├── .gitignore                # Git ignore rules
└── README.md                 # Project documentation
```

## Usage

### Interactive Mode (Recommended)

The easiest way to get started. The CLI will guide you through all configuration options:

```bash
npx create-churn@latest
```

You'll be prompted to configure:

1. **Project name** - Your project directory name
2. **Language** - TypeScript or JavaScript
3. **Package manager** - Bun, npm, yarn, or pnpm
4. **Protocol** - HTTP (REST API) or WebSocket
5. **CORS** - Enable/Disable (HTTP only)
6. **ORM/ODM** - Prisma, Drizzle, TypeORM, Sequelize, Mongoose, or None
7. **Database** - PostgreSQL, MySQL, SQLite, or MongoDB
8. **Path aliases** - TypeScript path mapping (TS only)
9. **Authentication** - JWT, OAuth, Session, or None
10. **Testing** - Jest, Vitest, or None
11. **Linting** - ESLint & Prettier with Husky
12. **Docker** - Dockerfile & docker-compose
13. **CI/CD** - GitHub Actions, GitLab CI, CircleCI, or None

### Non-interactive Mode (CLI Flags)

> **Note:** Coming in v1.2.0. Skip prompts by providing configuration via flags:

```bash
npx create-churn@latest [project-name] [options]
```

#### Basic Usage

```bash
# TypeScript + Bun + Prisma + PostgreSQL
npx create-churn@latest my-app --ts --bun --prisma --postgresql

# JavaScript + npm + MongoDB
npx create-churn@latest my-api --js --npm --mongoose --mongodb

# WebSocket server with testing
npx create-churn@latest realtime-app --ws --vitest --docker
```

#### All Available Flags

| Flag | Description | Options | Default |
|------|-------------|---------|---------|
| **Language** |
| `--ts`, `--typescript` | Use TypeScript | - | ✓ Default |
| `--js`, `--javascript` | Use JavaScript | - | |
| **Package Manager** |
| `--bun` | Use Bun | - | ✓ Default |
| `--npm` | Use npm | - | |
| `--yarn` | Use Yarn | - | |
| `--pnpm` | Use pnpm | - | |
| **Protocol** |
| `--http` | HTTP/REST API | - | ✓ Default |
| `--ws`, `--websocket` | WebSocket server | - | |
| `--cors` | Enable CORS (HTTP only) | - | ✓ Default for HTTP |
| `--no-cors` | Disable CORS | - | |
| **ORM/ODM** |
| `--prisma` | Use Prisma | - | ✓ Default |
| `--drizzle` | Use Drizzle | - | |
| `--typeorm` | Use TypeORM | - | |
| `--sequelize` | Use Sequelize | - | |
| `--mongoose` | Use Mongoose | - | |
| `--no-orm` | Skip ORM setup | - | |
| **Database** |
| `--postgresql`, `--postgres` | PostgreSQL database | - | ✓ Default |
| `--mysql` | MySQL database | - | |
| `--sqlite` | SQLite database | - | |
| `--mongodb` | MongoDB database | - | Auto with Mongoose |
| **TypeScript Features** |
| `--aliases` | Enable path aliases | - | ✓ Default for TS |
| `--no-aliases` | Disable path aliases | - | |
| **Authentication** |
| `--jwt` | JWT authentication | - | |
| `--oauth` | OAuth (Google, GitHub) | - | |
| `--session` | Session-based auth | - | |
| `--no-auth` | Skip authentication | - | ✓ Default |
| **Testing** |
| `--jest` | Use Jest | - | |
| `--vitest` | Use Vitest | - | |
| `--no-testing` | Skip testing setup | - | ✓ Default |
| **Code Quality** |
| `--linting` | ESLint + Prettier + Husky | - | ✓ Default |
| `--no-linting` | Skip linting setup | - | |
| **DevOps** |
| `--docker` | Add Docker support | - | |
| `--no-docker` | Skip Docker | - | ✓ Default |
| `--github` | GitHub Actions CI/CD | - | |
| `--gitlab` | GitLab CI | - | |
| `--circleci` | CircleCI | - | |
| `--no-cicd` | Skip CI/CD setup | - | ✓ Default |

#### Flag Examples

**Full-stack TypeScript API:**
```bash
npx create-churn@latest my-api \
  --ts \
  --bun \
  --http \
  --cors \
  --drizzle \
  --postgresql \
  --aliases \
  --jwt \
  --jest \
  --linting \
  --docker \
  --github
```

**Minimal JavaScript REST API:**
```bash
npx create-churn@latest simple-api --js --npm --http --no-orm --no-auth --no-testing --no-linting --no-docker
```

**WebSocket Server with MongoDB:**
```bash
npx create-churn@latest realtime-server --ts --bun --ws --mongoose --mongodb --session --vitest --docker
```

**Microservice with TypeORM:**
```bash
npx create-churn@latest user-service --ts --pnpm --http --typeorm --mysql --jwt --jest --linting --gitlab
```

#### Quick Reference - Common Combinations

| Scenario | Command |
|----------|---------|
| **Default setup** | `npx create-churn@latest` |
| **TypeScript only** | `npx create-churn@latest my-app --ts` |
| **JavaScript only** | `npx create-churn@latest my-app --js` |
| **With authentication** | `npx create-churn@latest my-app --jwt` |
| **With testing** | `npx create-churn@latest my-app --jest` |
| **Production ready** | `npx create-churn@latest my-app --jwt --jest --linting --docker --github` |
| **MongoDB stack** | `npx create-churn@latest my-app --mongoose --mongodb --session` |
| **No database** | `npx create-churn@latest my-app --no-orm` |
| **WebSocket** | `npx create-churn@latest my-app --ws` |
| **Minimal setup** | `npx create-churn@latest my-app --js --no-orm --no-auth --no-testing --no-linting --no-docker` |

## Examples

### 1. Full-Stack TypeScript API

Production-ready API with authentication, testing, and deployment configuration.

**Interactive:**
```bash
npx create-churn@latest
# Select: TypeScript → Bun → HTTP → CORS → Drizzle → PostgreSQL →
#         Path aliases → JWT → Jest → Linting → Docker → GitHub Actions
```

**CLI Flags (v1.2.0):**
```bash
npx create-churn@latest production-api \
  --ts --bun --http --cors \
  --drizzle --postgresql \
  --aliases --jwt --jest \
  --linting --docker --github
```

**What you get:**
- TypeScript with path aliases (`@/config`, `@/models`)
- Drizzle ORM with PostgreSQL
- JWT authentication with middleware
- Jest testing with coverage
- ESLint + Prettier + Husky
- Docker multi-stage build
- GitHub Actions CI/CD

---

### 2. Minimal JavaScript API

Lightweight Express server with no dependencies, ready to customize.

**Interactive:**
```bash
npx create-churn@latest
# Select: JavaScript → npm → HTTP → No CORS → No ORM →
#         No auth → No testing → No linting → No docker → No CI/CD
```

**CLI Flags (v1.2.0):**
```bash
npx create-churn@latest simple-api \
  --js --npm --http --no-cors \
  --no-orm --no-auth --no-testing \
  --no-linting --no-docker --no-cicd
```

**What you get:**
- Plain JavaScript
- Express HTTP server
- No database (add your own)
- Minimal dependencies
- Quick prototyping setup

---

### 3. Real-time WebSocket Server

WebSocket server with database persistence and testing.

**Interactive:**
```bash
npx create-churn@latest
# Select: TypeScript → Bun → WebSocket → Sequelize → SQLite →
#         Path aliases → No auth → Vitest → Linting → Docker
```

**CLI Flags (v1.2.0):**
```bash
npx create-churn@latest realtime-server \
  --ts --bun --ws \
  --sequelize --sqlite \
  --aliases --no-auth \
  --vitest --linting --docker
```

**What you get:**
- WebSocket server (ws library)
- Sequelize ORM with SQLite
- Vitest for testing WebSocket events
- Docker with health checks
- Linting and formatting

---

### 4. MongoDB Microservice

MongoDB-backed API with session authentication and CI/CD.

**Interactive:**
```bash
npx create-churn@latest
# Select: TypeScript → pnpm → HTTP → CORS → Mongoose → MongoDB →
#         Path aliases → Session → Jest → Linting → CircleCI
```

**CLI Flags (v1.2.0):**
```bash
npx create-churn@latest user-service \
  --ts --pnpm --http --cors \
  --mongoose --mongodb \
  --aliases --session --jest \
  --linting --circleci
```

**What you get:**
- Mongoose ODM with MongoDB
- Session-based authentication
- Express session configuration
- Jest with MongoDB memory server
- CircleCI pipeline
- Environment validation (Zod)

---

### 5. Enterprise REST API

Full-featured API with Prisma, OAuth, and comprehensive tooling.

**Interactive:**
```bash
npx create-churn@latest
# Select: TypeScript → yarn → HTTP → CORS → Prisma → MySQL →
#         Path aliases → OAuth → Jest → Linting → Docker → GitLab CI
```

**CLI Flags (v1.2.0):**
```bash
npx create-churn@latest enterprise-api \
  --ts --yarn --http --cors \
  --prisma --mysql \
  --aliases --oauth --jest \
  --linting --docker --gitlab
```

**What you get:**
- Prisma ORM with MySQL
- OAuth (Google + GitHub)
- Prisma Studio for database GUI
- Jest with Supertest
- Docker Compose with MySQL service
- GitLab CI/CD pipeline

---

### 6. Quick Prototype (30 seconds)

Fastest way to get a running server.

**Interactive:**
```bash
npx create-churn@latest
# Just press Enter for all defaults
```

**CLI Flags (v1.2.0):**
```bash
npx create-churn@latest my-prototype
# Uses all defaults: TS + Bun + HTTP + CORS + Prisma + PostgreSQL
```

**What you get:**
- TypeScript + Bun (fastest runtime)
- HTTP REST API with CORS
- Prisma with PostgreSQL
- Path aliases enabled
- No auth, testing, or Docker
- ESLint + Prettier by default

## Supported Combinations

### ORMs & Databases

| ORM | PostgreSQL | MySQL | SQLite | MongoDB |
|-----|-----------|-------|--------|---------|
| **Prisma** | [x] | [x] | [x] | [ ] |
| **Drizzle** | [x] | [x] | [x] | [ ] |
| **TypeORM** | [x] | [x] | [x] | [ ] |
| **Sequelize** | [x] | [x] | [x] | [ ] |
| **Mongoose** | [ ] | [ ] | [ ] | [x] |

### Package Managers

| Language | Bun | npm | yarn | pnpm |
|----------|-----|-----|------|------|
| **TypeScript** | [x] | [x] | [x] | [x] |
| **JavaScript** | [x] | [x] | [x] | [x] |

### Testing Frameworks

| Framework | TypeScript | JavaScript |
|-----------|-----------|-----------|
| **Jest** | [x] | [x] |
| **Vitest** | [x] | [x] |

## Generated Scripts

Your project comes with useful npm scripts:

```json
{
  "scripts": {
    "dev": "Start development server with watch mode",
    "build": "Build for production",
    "start": "Start production server",
    "test": "Run tests",
    "test:coverage": "Run tests with coverage",
    "lint": "Lint and fix code",
    "format": "Format code with Prettier",
    "db:generate": "Generate database client/types",
    "db:migrate": "Run database migrations",
    "db:studio": "Open database GUI (Prisma/Drizzle)"
  }
}
```

## Documentation

- **ORM Guides**: Each ORM comes with configured examples
- **Auth Examples**: JWT tokens, OAuth flows, session management
- **Testing**: Pre-configured test suites
- **Docker**: Multi-stage builds with database services
- **CI/CD**: Automated workflows for testing and deployment

## Development

### Clone & Setup

```bash
git clone https://github.com/Basharkhan7776/Churn.git
cd Churn
bun install
```

### Run Locally

```bash
bun run dev
```

### Test

```bash
# Run all tests
bun test

# Run specific test
bun test-cli.ts

# Deep validation
bun deep-test.ts

# CORS verification
bun verify-cors.ts
```

### Build

```bash
bun run build
```

## Testing

All features are thoroughly tested:

- [+] **5/5** CLI tests passed
- [+] **62/62** Deep validation checks passed
- [+] **0** TypeScript errors
- [+] **0** Build errors

## Roadmap

### v1.1.0 (Current)
- [x] Multiple ORMs (Prisma, Drizzle, TypeORM, Sequelize, Mongoose)
- [x] Multiple databases (PostgreSQL, MySQL, SQLite, MongoDB)
- [x] Authentication (JWT, OAuth, Session)
- [x] Testing frameworks (Jest, Vitest)
- [x] Linting & formatting (ESLint, Prettier, Husky)
- [x] Docker support
- [x] CI/CD templates
- [x] Optional CORS

### v1.2.0 (Next)
- [ ] CLI flags (non-interactive mode)
- [ ] GraphQL support
- [ ] API documentation (Swagger/OpenAPI)
- [ ] More auth providers (Auth0, Supabase)
- [ ] Deployment templates (Vercel, Railway, Fly.io)

### v2.0.0 (Future)
- [ ] Plugin system
- [ ] Custom templates
- [ ] GUI interface
- [ ] Migration tool

## Contributing

We welcome contributions! Here's how to get started:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for your changes
5. Ensure all tests pass (`bun test`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Areas for Contribution
- New ORM integrations
- New CI/CD platforms
- Deployment templates
- Documentation improvements
- Bug fixes

## License

MIT License - Copyright (c) [Bashar Khan](https://github.com/Basharkhan7776)

## Acknowledgments

Built with:
- [Bun](https://bun.sh) - Fast JavaScript runtime
- [TypeScript](https://www.typescriptlang.org) - Type-safe JavaScript
- [Prompts](https://github.com/terkelg/prompts) - Interactive CLI prompts
- [Chalk](https://github.com/chalk/chalk) - Terminal styling

## Support

- **Issues**: [GitHub Issues](https://github.com/Basharkhan7776/Churn/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Basharkhan7776/Churn/discussions)
- **Star us**: If you find this useful, please star the repo!

---

**Made with <3 by [Bashar Khan](https://github.com/Basharkhan7776)**

**Note**: This CLI is under active development. More features coming soon!
