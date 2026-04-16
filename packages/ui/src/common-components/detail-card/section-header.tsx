import type { LucideIcon } from "lucide-react";

import { cn } from "@corpora/ui";

interface SectionHeaderProps {
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  variant?: "medium" | "semibold";
  iconSize?: "sm" | "md";
}

const iconSizeClasses: Record<"sm" | "md", string> = {
  sm: "size-5",
  md: "size-6",
};

export function SectionHeader({
  icon: Icon,
  children,
  className,
  iconClassName,
  textClassName,
  variant = "medium",
  iconSize = "md",
}: SectionHeaderProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {Icon && (
        <Icon
          className={cn(
            iconSizeClasses[iconSize],
            "text-brand-blue-400",
            iconClassName,
          )}
          strokeWidth={1.5}
        />
      )}
      <h2
        className={cn(
          "text-base text-brand-blue-400",
          variant === "semibold" ? "font-semibold" : "font-medium",
          textClassName,
        )}
      >
        {children}
      </h2>
    </div>
  );
}

