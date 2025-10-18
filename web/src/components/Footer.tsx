import { Github, Package } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t glass mt-20">
      <div className="max-w-[1280px] mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            MIT License © {new Date().getFullYear()} Bashar Khan
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/Basharkhan7776/Churn"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
            <a
              href="https://www.npmjs.com/package/create-churn"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
            >
              <Package className="h-4 w-4" />
              NPM
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
