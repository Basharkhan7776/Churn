# Create Churn CLI

> ➡️ Scaffold customizable backend projects with ease

A powerful CLI tool to create fully configured backend projects with your preferred settings. Similar to `create-next-app`, but for backend development.

## Quick Start

```bash
npx create-churn@latest
```

## Features

- **Multiple Languages**: TypeScript & JavaScript support
- **Package Managers**: Bun, npm, yarn, pnpm
- **Protocols**: HTTP (REST API) & WebSocket
- **ORMs**: Prisma integration or no database
- **Path Aliases**: Optional TypeScript path mapping
- **Zero Config**: Ready-to-run projects out of the box

## Usage

```bash
# Interactive mode
npx create-churn@latest

# With options (coming soon)
npx create-churn@latest my-project --typescript --bun --prisma
```

## What You Get

```
my-project/
├── package.json          # Dependencies & scripts
├── index.ts             # Main entry point
├── tsconfig.json        # TypeScript config (if TS)
├── prisma/              # Database schema (if Prisma)
├── .gitignore           # Git ignore rules
└── README.md            # Project documentation
```

## Supported Stacks

| Language | Package Manager | Protocol | ORM | Path Aliases |
|----------|----------------|----------|-----|--------------|
| TypeScript | Bun | HTTP | Prisma | ✅ |
| TypeScript | npm | WebSocket | None | ✅ |
| JavaScript | yarn | HTTP | Prisma | ❌ |
| JavaScript | pnpm | WebSocket | None | ❌ |

## Development

```bash
# Clone & install
git clone https://github.com/Basharkhan7776/Churn.git
cd Churn
bun install

# Run locally
bun run dev

# Test
bun test

# Build
bun run build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a PR

## License

MIT © [Bashar Khan](https://github.com/Basharkhan7776)

