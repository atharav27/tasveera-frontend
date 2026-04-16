import type { ReactNode } from "react";

import { Badge } from "@corpora/ui";
import { cn } from "../../lib/utils";

export type BadgeVariant = "amber" | "green" | "red" | "primary" | "neutral";

const badgeVariantConfig: Record<BadgeVariant, { className: string; textOnlyClassName: string }> = {
  amber: {
    className: "bg-amber-50 text-amber-600",
    textOnlyClassName: "bg-transparent text-amber-600",
  },
  green: {
    className: "bg-green-50 text-green-600",
    textOnlyClassName: "bg-transparent text-green-600",
  },
  red: {
    className: "bg-red-50 text-red-500",
    textOnlyClassName: "bg-transparent text-red-500",
  },
  primary: {
    className: "bg-sky-50 text-primary-900",
    textOnlyClassName: "bg-transparent text-primary-900",
  },
  neutral: {
    className: "bg-neutral-100 text-neutral-600",
    textOnlyClassName: "bg-transparent text-neutral-600",
  },
};

const sizeClasses: Record<"sm" | "md" | "lg", string> = {
  sm: "px-2 py-0.5",
  md: "px-3 py-1",
  lg: "px-4 py-1.5",
};

const textSizeClasses: Record<"xs" | "sm", string> = {
  xs: "text-xs",
  sm: "text-sm",
};

interface BadgeVariantProps {
  text?: string;
  children?: ReactNode;
  variant: BadgeVariant;
  size?: "sm" | "md" | "lg";
  textSize?: "xs" | "sm";
  rounded?: "default" | "full";
  baseVariant?: "default" | "secondary" | "destructive" | "outline";
  noBackground?: boolean;
  className?: string;
  icon?: ReactNode;
}

function buildBadgeClassName(
  variant: BadgeVariant,
  size: "sm" | "md" | "lg",
  textSize: "xs" | "sm",
  rounded: "default" | "full",
  noBackground: boolean,
  className?: string,
): string {
  
  const config = badgeVariantConfig[variant];
  const variantClassName = noBackground ? config.textOnlyClassName : config.className;
  
  const sizeClass = sizeClasses[size];
  
  const textSizeClass = textSizeClasses[textSize];
  const roundedClass = rounded === "full" ? "rounded-full" : "";

  return cn(variantClassName, sizeClass, textSizeClass, roundedClass, className);
}

export function BadgeVariant({
  text,
  children,
  variant,
  size = "sm",
  textSize = "xs",
  rounded = "default",
  baseVariant = "secondary",
  noBackground = false,
  className,
  icon,
}: BadgeVariantProps) {
  const badgeClassName = buildBadgeClassName(variant, size, textSize, rounded, noBackground, className);

  return (
    <Badge variant={baseVariant} className={badgeClassName}>
      {icon && <span className="mr-1">{icon}</span>}
      {children ?? text}
    </Badge>
  );
}

