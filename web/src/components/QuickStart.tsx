import { motion } from "framer-motion";
import {
  Database,
  Lock,
  Container,
  TestTube,
  Layers,
  Code,
  Coins,
} from "lucide-react";

const features = [
  {
    icon: Layers,
    title: "Multiple ORMs",
    description: "Prisma, Drizzle, TypeORM, Sequelize, Mongoose",
  },
  {
    icon: Database,
    title: "Database Support",
    description: "PostgreSQL, MySQL, SQLite, MongoDB",
  },
  {
    icon: Coins,
    title: "Smart Contracts",
    description: "Solidity with Hardhat or Foundry, ERC20, NFTs",
  },
  {
    icon: Lock,
    title: "Authentication",
    description: "JWT, OAuth, Session-based auth",
  },
  {
    icon: Container,
    title: "Docker Ready",
    description: "Pre-configured Docker & Docker Compose",
  },
  {
    icon: TestTube,
    title: "Testing Setup",
    description: "Jest, Vitest, Hardhat, Forge tests",
  },
  {
    icon: Code,
    title: "TypeScript First",
    description: "Full TypeScript support out of the box",
  },
];

const codeSnippet = `# Create a backend API
npx create-churn@latest my-api \\
  --prisma --jwt --docker --postgres

# Create smart contracts
npx create-churn@latest my-token \\
  --solidity --hardhat --token --uups

# Navigate and start
cd my-api
npm run dev`;

export function QuickStart() {
  return (
    <section className="py-20 px-6 border-t">
      <div className="max-w-[1280px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-12 text-center">
            Quick Start Guide
          </h2>

          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-bold mb-4">Getting Started</h3>
              <div className="glass rounded-lg p-6">
                <pre className="font-mono text-sm overflow-x-auto">
                  <code>{codeSnippet}</code>
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Core Features</h3>
              <div className="grid gap-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-start gap-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <feature.icon className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                    <div>
                      <div className="font-semibold mb-1">{feature.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {feature.description}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
