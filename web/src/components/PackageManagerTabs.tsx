import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import { setPackageManager } from "@/store/uiSlice";

const managers = ['npm', 'pnpm', 'yarn', 'bun'] as const;

export function PackageManagerTabs() {
  const dispatch = useAppDispatch();
  const selected = useAppSelector((state) => state.ui.packageManager);

  return (
    <div className="inline-flex gap-1 p-1 rounded-md bg-muted/50 border">
      {managers.map((manager) => (
        <button
          key={manager}
          onClick={() => dispatch(setPackageManager(manager))}
          className={`
            px-3 py-1 text-xs font-mono rounded transition-all
            ${selected === manager 
              ? 'bg-background text-foreground shadow-sm' 
              : 'text-muted-foreground hover:text-foreground'
            }
          `}
        >
          {manager}
        </button>
      ))}
    </div>
  );
}
