import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Badge({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-blush-200 bg-white/90 px-3 py-1 text-xs font-semibold text-ink shadow-sm",
        className
      )}
    >
      {children}
    </span>
  );
}
