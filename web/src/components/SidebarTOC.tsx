import { ScrollArea } from "@/components/ui/scroll-area";
import { useTOC } from "@/hooks/useTOC";
import { tocItems } from "@/data/docsContent";

export function SidebarTOC() {
  const activeId = useTOC();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-60 border-r glass hidden lg:block">
      <ScrollArea className="h-full py-6 px-4">
        <nav className="space-y-1">
          <div className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
            Contents
          </div>
          {tocItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`
                block w-full text-left text-sm py-1.5 px-3 rounded transition-colors
                ${item.level === 2 ? 'pl-6 text-xs' : ''}
                ${activeId === item.id 
                  ? 'text-foreground bg-muted font-medium' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }
              `}
            >
              {item.title}
            </button>
          ))}
        </nav>
      </ScrollArea>
    </aside>
  );
}
