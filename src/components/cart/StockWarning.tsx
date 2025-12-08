import { AlertTriangle, Package } from "lucide-react";
import { cn } from "@/lib/utils";

interface StockWarningProps {
  message: string;
  type: 'error' | 'warning';
  className?: string;
}

export const StockWarning = ({ message, type, className }: StockWarningProps) => {
  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-md text-sm animate-in fade-in slide-in-from-top-1 duration-200",
        type === 'error' 
          ? "bg-destructive/15 text-destructive border border-destructive/30" 
          : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30",
        className
      )}
    >
      {type === 'error' ? (
        <AlertTriangle className="h-4 w-4 flex-shrink-0" />
      ) : (
        <Package className="h-4 w-4 flex-shrink-0" />
      )}
      <span className="font-medium">{message}</span>
    </div>
  );
};
