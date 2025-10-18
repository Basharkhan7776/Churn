import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const commands = {
  npm: "npm create churn@latest my-api --prisma --jwt --docker",
  pnpm: "pnpm create churn@latest my-api --prisma --jwt --docker",
  yarn: "yarn create churn my-api --prisma --jwt --docker",
  bun: "bun create churn@latest my-api --prisma --jwt --docker",
};

export function TabsSection() {
  return (
    <section className="py-20 px-6 border-t">
      <div className="max-w-[1280px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-8 text-center">
            Choose Your Package Manager
          </h2>

          <Tabs defaultValue="npm" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-4 mb-8">
              <TabsTrigger value="npm">npm</TabsTrigger>
              <TabsTrigger value="pnpm">pnpm</TabsTrigger>
              <TabsTrigger value="yarn">yarn</TabsTrigger>
              <TabsTrigger value="bun">bun</TabsTrigger>
            </TabsList>

            {Object.entries(commands).map(([key, command]) => (
              <TabsContent key={key} value={key}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="glass rounded-lg p-6"
                >
                  <code className="font-mono text-sm sm:text-base block">
                    {command}
                  </code>
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>
      </div>
    </section>
  );
}
