import { motion } from "framer-motion";
import { CommandBlock } from "./CommandBlock";
import { useAppSelector } from "@/hooks/useAppDispatch";
import { commands } from "@/data/docsContent";
import { 
  Database, Lock, Container, TestTube, Layers, Code, 
  Zap, FileCode, Settings, Package 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { toast } from "sonner";

const features = [
  { icon: Layers, title: "Multiple ORMs", desc: "Prisma, Drizzle, TypeORM, Sequelize, Mongoose" },
  { icon: Database, title: "Database Support", desc: "PostgreSQL, MySQL, SQLite, MongoDB" },
  { icon: Lock, title: "Authentication", desc: "JWT, OAuth, Session-based auth" },
  { icon: Container, title: "Docker Ready", desc: "Pre-configured Docker & Docker Compose" },
  { icon: TestTube, title: "Testing Setup", desc: "Jest, Vitest configurations included" },
  { icon: Code, title: "TypeScript First", desc: "Full TypeScript support out of the box" },
];

function FlagBadge({ flag }: { flag: string }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(flag);
    toast.success(`Copied ${flag}`);
  };

  return (
    <Badge 
      variant="secondary" 
      className="cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors font-mono text-xs"
      onClick={handleCopy}
    >
      {flag}
    </Badge>
  );
}

export function DocsContent() {
  const packageManager = useAppSelector((state) => state.ui.packageManager);
  const baseCommand = commands[packageManager];

  return (
    <article className="prose prose-neutral dark:prose-invert max-w-none">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <h1 id="quick-start" className="text-4xl font-bold mb-6">Quick Start</h1>
        
        <p className="text-muted-foreground">
          Create production-ready backend projects with one command. Choose your ORM, database, auth strategy, and more.
        </p>

        <CommandBlock command={`${baseCommand} my-api`} />

        <h1 id="features" className="text-4xl font-bold mt-16 mb-6">Features</h1>
        
        <div className="grid md:grid-cols-2 gap-4 not-prose">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="border-muted">
                <CardContent className="p-4 flex items-start gap-3">
                  <feature.icon className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                    <p className="text-xs text-muted-foreground">{feature.desc}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <h1 id="usage" className="text-4xl font-bold mt-16 mb-6">Usage</h1>

        <h2 id="interactive-mode" className="text-2xl font-semibold mt-8 mb-4">Interactive Mode</h2>
        <p className="text-muted-foreground">
          Run without arguments for an interactive CLI prompt:
        </p>
        <CommandBlock command={baseCommand} />

        <h2 id="non-interactive-mode" className="text-2xl font-semibold mt-8 mb-4">Non-Interactive Mode</h2>
        <p className="text-muted-foreground">
          Pass flags directly to skip prompts:
        </p>
        <CommandBlock command={`${baseCommand} my-api --prisma --jwt --docker --postgres`} />

        <h1 id="flags" className="text-4xl font-bold mt-16 mb-6">CLI Flags</h1>

        <p className="text-muted-foreground mb-6">
          Click any flag to copy it to your clipboard:
        </p>

        <div className="not-prose space-y-6">
          {[
            {
              category: 'Language',
              flags: ['--ts', '--typescript', '--js', '--javascript']
            },
            {
              category: 'Package Manager',
              flags: ['--bun', '--npm', '--yarn', '--pnpm']
            },
            {
              category: 'Protocol',
              flags: ['--http', '--ws', '--websocket', '--cors', '--no-cors']
            },
            {
              category: 'ORM/ODM',
              flags: ['--prisma', '--drizzle', '--typeorm', '--sequelize', '--mongoose', '--no-orm']
            },
            {
              category: 'Database',
              flags: ['--postgresql', '--postgres', '--mysql', '--sqlite', '--mongodb']
            },
            {
              category: 'TypeScript Features',
              flags: ['--aliases', '--no-aliases']
            },
            {
              category: 'Authentication',
              flags: ['--jwt', '--oauth', '--session', '--no-auth']
            },
            {
              category: 'Testing',
              flags: ['--jest', '--vitest', '--no-testing']
            },
            {
              category: 'Code Quality',
              flags: ['--linting', '--no-linting']
            },
            {
              category: 'DevOps',
              flags: ['--docker', '--no-docker', '--github', '--gitlab', '--circleci', '--no-cicd']
            }
          ].map((category) => (
            <div key={category.category} className="space-y-3">
              <h3 className="text-lg font-semibold">{category.category}</h3>
              <div className="flex flex-wrap gap-2">
                {category.flags.map((flag) => (
                  <FlagBadge key={flag} flag={flag} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <h1 id="examples" className="text-4xl font-bold mt-16 mb-6">Examples</h1>
        
        <div className="space-y-4 not-prose">
          <div>
            <h3 className="text-sm font-semibold mb-2">Full-stack API with Prisma & JWT</h3>
            <CommandBlock command={`${baseCommand} my-api --prisma --jwt --docker --postgres`} />
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-2">Minimal MongoDB API</h3>
            <CommandBlock command={`${baseCommand} my-api --mongoose --mongodb`} />
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-2">TypeORM with OAuth</h3>
            <CommandBlock command={`${baseCommand} my-api --typeorm --oauth --mysql --docker`} />
          </div>
        </div>

        <h1 id="supported-combinations" className="text-4xl font-bold mt-16 mb-6">Supported Combinations</h1>
        
        <div className="not-prose">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-6 text-sm">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Database className="h-4 w-4 text-accent" />
                    SQL Databases
                  </h4>
                  <ul className="space-y-1 text-muted-foreground text-xs">
                    <li>• Prisma + PostgreSQL</li>
                    <li>• TypeORM + MySQL</li>
                    <li>• Drizzle + SQLite</li>
                    <li>• Sequelize + PostgreSQL</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Database className="h-4 w-4 text-accent" />
                    NoSQL Databases
                  </h4>
                  <ul className="space-y-1 text-muted-foreground text-xs">
                    <li>• Mongoose + MongoDB</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <h1 id="development" className="text-4xl font-bold mt-16 mb-6">Development</h1>
        
        <p className="text-muted-foreground">
          After scaffolding your project:
        </p>
        
        <div className="space-y-3 not-prose">
          <CommandBlock command="cd my-api" />
          <CommandBlock command={`${packageManager} install`} />
          <CommandBlock command={`${packageManager} run dev`} />
        </div>

      </motion.section>
    </article>
  );
}
