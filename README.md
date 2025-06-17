# Create Churn CLI

A powerful CLI tool to create customizable backend projects with Churn. Similar to `npx create-next-app@latest`, this tool scaffolds fully configured backend projects with your preferred settings.

## Features

- 🚀 **Interactive Setup**: Guided prompts for project configuration
- 🔧 **Multiple Languages**: Support for TypeScript and JavaScript
- 📦 **Package Manager Choice**: Bun, Yarn, pnpm, or npm
- 🌐 **Protocol Support**: HTTP (REST API) or WebSocket (Real-time)
- 🗄️ **ORM Integration**: Prisma or no database
- 🛣️ **Path Aliases**: Optional TypeScript path mapping
- ⚡ **Fast**: Built with Bun for optimal performance

## Installation

### Local Development

```bash
# Clone the repository
git clone <your-repo-url>
cd create-churn

# Install dependencies
bun install

# Run the CLI
bun run index.ts
```

### Global Installation (After Publishing)

```bash
# Using bunx
bunx create-churn@latest

# Using npx
npx create-churn@latest

# Using yarn
yarn create churn

# Using pnpm
pnpm create churn
```

## Usage

Run the CLI and follow the interactive prompts:

```bash
bunx create-churn@latest
```

### Configuration Options

1. **Project Name**: Choose a name for your project (lowercase, hyphens allowed)
2. **Language**: TypeScript (recommended) or JavaScript
3. **Package Manager**: Bun, Yarn, pnpm, or npm
4. **Protocol**: HTTP (REST API) or WebSocket (Real-time)
5. **ORM**: Prisma or no database
6. **Path Aliases**: Enable TypeScript path mapping

### Example Output

```
╔══════════════════════════════════════════════════════════════╗
║                    🚀 Create Churn CLI                      ║
║                                                              ║
║  Create customizable backend projects with ease!            ║
╚══════════════════════════════════════════════════════════════╝

Let's create your Churn backend project! 🚀

✔ What is your project name? … my-churn-app
✔ Which language would you like to use? › TypeScript (recommended)
✔ Which package manager would you like to use? › Bun (recommended)
✔ Which protocol would you like to use? › HTTP (REST API)
✔ Which ORM would you like to use? › Prisma (recommended)
✔ Would you like to use path aliases? … Yes

🚀 Creating your project...
📁 Created directory: ./my-churn-app
📄 Generated package.json
📄 Generated index.ts
📄 Generated tsconfig.json
📄 Generated prisma/schema.prisma
📄 Generated .gitignore
📄 Generated README.md
📦 Initializing bun...
✅ Project scaffolding completed!

╔══════════════════════════════════════════════════════════════╗
║                    ✅ Project Created!                       ║
╚══════════════════════════════════════════════════════════════╝

🎉 Your Churn backend project "my-churn-app" has been created successfully!

📁 Project structure:
   ./my-churn-app/

🚀 Next steps:
   1. cd my-churn-app
   2. bun install
   3. bun run dev
```

## Generated Project Structure

```
my-churn-app/
├── index.ts                 # Main application file
├── tsconfig.json           # TypeScript configuration
├── package.json            # Dependencies and scripts
├── README.md               # Project documentation
├── .gitignore              # Git ignore rules
└── prisma/                 # Database schema (if using Prisma)
    └── schema.prisma
```

## Project Templates

### HTTP (REST API) Template

Creates a Hono-based REST API with:
- Health check endpoint
- JSON response handling
- Environment-based port configuration
- Optional Prisma integration

### WebSocket Template

Creates a WebSocket server with:
- Real-time message handling
- Connection management
- Echo functionality
- Optional Prisma integration

### TypeScript Configuration

- Modern ES2022 target
- Strict type checking
- Path aliases support (when enabled)
- Bun-specific optimizations

### Prisma Integration

When Prisma is selected:
- Basic User and Post models
- PostgreSQL configuration
- Database scripts in package.json
- Environment variable setup

## Development

### Project Structure

```
create-churn/
├── src/
│   ├── types.ts            # TypeScript interfaces
│   ├── prompts.ts          # User interaction logic
│   ├── scaffold.ts         # Project generation
│   ├── utils.ts            # Utility functions
│   └── templates/          # File templates
│       ├── package-json.ts
│       ├── main-file.ts
│       ├── tsconfig.ts
│       └── prisma-schema.ts
├── index.ts                # CLI entry point
├── package.json
└── README.md
```

### Adding New Templates

1. Create a new template file in `src/templates/`
2. Export a function that generates the content
3. Import and use it in `src/scaffold.ts`
4. Update the `ProjectOptions` interface if needed

### Building for Distribution

```bash
# Build the CLI
bun run build

# The built file will be in dist/index.js
```

## Publishing

1. Update the version in `package.json`
2. Build the project: `bun run build`
3. Publish to npm: `npm publish`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

- GitHub Issues: [Report bugs or request features](https://github.com/your-org/create-churn/issues)
- Documentation: [Full documentation](https://github.com/your-org/churn)
- Community: [Discord/Slack link]

---

