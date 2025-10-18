import { motion } from "framer-motion";
import { CheckCircle, Circle, Clock } from "lucide-react";

const versions = [
  {
    version: "v1.1.0",
    status: "current",
    title: "Current Release",
    features: [
      "Multiple ORM support (Prisma, Drizzle, TypeORM, Sequelize, Mongoose)",
      "Authentication systems (JWT, OAuth, Session)",
      "Docker & Docker Compose setup",
      "Database migrations",
      "TypeScript configuration",
    ],
  },
  {
    version: "v1.2.0",
    status: "next",
    title: "Next Release",
    features: [
      "CLI flags for advanced configuration",
      "GraphQL API templates",
      "OpenAPI/Swagger documentation generator",
      "Redis caching setup",
      "Rate limiting middleware",
    ],
  },
  {
    version: "v2.0.0",
    status: "future",
    title: "Future Vision",
    features: [
      "Plugin ecosystem",
      "Visual GUI for project configuration",
      "Custom template support",
      "Monorepo scaffolding",
      "Cloud deployment integrations",
    ],
  },
];

const statusConfig = {
  current: {
    icon: CheckCircle,
    className: "text-accent",
  },
  next: {
    icon: Clock,
    className: "text-muted-foreground",
  },
  future: {
    icon: Circle,
    className: "text-muted-foreground",
  },
};

export function Roadmap() {
  return (
    <section className="py-20 px-6 border-t">
      <div className="max-w-[1280px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-12 text-center">Roadmap</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {versions.map((item, index) => {
              const StatusIcon = statusConfig[item.status as keyof typeof statusConfig].icon;
              const statusClass = statusConfig[item.status as keyof typeof statusConfig].className;

              return (
                <motion.div
                  key={item.version}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="border rounded-lg p-6 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <StatusIcon className={`h-5 w-5 ${statusClass}`} />
                    <div>
                      <div className="font-mono font-bold">{item.version}</div>
                      <div className="text-sm text-muted-foreground">
                        {item.title}
                      </div>
                    </div>
                  </div>

                  <ul className="space-y-2">
                    {item.features.map((feature) => (
                      <li
                        key={feature}
                        className="text-sm text-muted-foreground flex items-start gap-2"
                      >
                        <span className="text-accent mt-1">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
