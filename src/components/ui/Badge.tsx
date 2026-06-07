import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "primary" | "success" | "warning";
}

function Badge({ className, variant = "default", children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium border",
        {
          "bg-surface-container border-outline text-on-surface-variant": variant === "default",
          "bg-primary/10 border-primary/30 text-primary": variant === "primary",
          "bg-emerald-900/20 border-emerald-700/30 text-emerald-400": variant === "success",
          "bg-amber-900/20 border-amber-700/30 text-amber-400": variant === "warning",
        },
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export { Badge };
