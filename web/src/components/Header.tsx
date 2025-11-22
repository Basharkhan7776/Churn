import { Github, Star, Menu } from "lucide-react";
import { motion } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";
import { useGithubStars } from "@/hooks/useGithubStars";
import { PackageManagerTabs } from "./PackageManagerTabs";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { tocItems } from "@/data/docsContent";
import { useTOC } from "@/hooks/useTOC";
import { useState } from "react";

export function Header() {
  const { stars, loading } = useGithubStars("Basharkhan7776/Churn");
  const activeId = useTOC();
  const [open, setOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth", block: "start" });
    setOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b"
    >
      <div className="px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden h-8 w-8 p-0"
              >
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px]">
              <SheetHeader>
                <SheetTitle className="text-left">Contents</SheetTitle>
              </SheetHeader>
              <nav className="space-y-1 mt-6">
                {tocItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`
                      block w-full text-left text-sm py-2 px-3 rounded transition-colors
                      ${item.level === 2 ? "pl-6 text-xs" : ""}
                      ${
                        activeId === item.id
                          ? "text-foreground bg-muted font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }
                    `}
                  >
                    {item.title}
                  </button>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          <a href="/" className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="Churn CLI Logo"
              className="h-8 w-8 rounded"
            />
            <span className="font-mono font-bold text-sm tracking-tight hidden sm:inline">
              CHURN CLI
            </span>
          </a>
          <div className="hidden sm:block">
            <PackageManagerTabs />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 h-8 text-xs"
            asChild
          >
            <a
              href="https://github.com/Basharkhan7776/Churn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="h-3 w-3" />
              <span className="hidden sm:inline">GitHub</span>
              {!loading && stars !== null && (
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted text-secondary-foreground text-xs">
                  <Star className="h-3 w-3 fill-accent text-accent" />
                  {stars}
                </div>
              )}
            </a>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </motion.header>
  );
}
