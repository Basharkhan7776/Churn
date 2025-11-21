import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function Hero() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("npx create-churn@latest");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="pt-32 pb-20 px-6">
      <div className="max-w-[1280px] mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <pre className="text-accent font-mono text-sm sm:text-base md:text-lg mb-8 inline-block">
{`   _____ _    _ _    _ _____  _   _ 
  / ____| |  | | |  | |  __ \\| \\ | |
 | |    | |__| | |  | | |__) |  \\| |
 | |    |  __  | |  | |  _  /| . \` |
 | |____| |  | | |__| | | \\ \\| |\\  |
  \\_____|_|  |_|\\____/|_|  \\_\\_| \\_|`}
          </pre>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-balance"
        >
          Scaffold backends & smart contracts
          <br />
          <span className="text-muted-foreground">with one command</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div className="relative group">
            <div className="absolute inset-0 bg-accent/20 blur-xl rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative glass rounded-lg p-4 flex items-center justify-between gap-4">
              <code className="font-mono text-sm sm:text-base flex-1 text-left">
                npx create-churn@latest
              </code>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                className="shrink-0"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-accent" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
