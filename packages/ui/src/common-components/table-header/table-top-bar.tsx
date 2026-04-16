import type { ReactNode } from "react";

import { Button } from "../../components/button";
import { cn } from "../../lib/utils";

export interface ButtonConfig {
  text: string;
  icon?: ReactNode;
  variant?: "default" | "outline" | "ghost" | "destructive" | "secondary";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

interface TableHeaderProps {
  title: string;
  subtitle: string;
  buttons?: ButtonConfig[];
  className?: string;
}

export function TableTopBar({ title, subtitle, buttons, className }: TableHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 py-4 lg:flex-row lg:items-center md:justify-between",
        className,
      )}
    >
      <div className="space-y-1">
        <h2 className="text-2xl md:text-3xl font-medium text-slate-900">{title}</h2>
        <p className="text-sm md:text-base font-normal text-slate-600">{subtitle}</p>
      </div>
      {buttons && buttons.length > 0 && (
        <div className="w-full flex flex-col gap-3 sm:w-auto sm:grid sm:grid-cols-2 sm:gap-3 md:flex md:flex-row md:items-center md:gap-5">
          {buttons.map((button) => {
            // Extract bg- and text- classes to preserve them on hover
            const bgClass = button.className?.match(/\bbg-[\w-]+/)?.[0];
            const textClass = button.className?.match(/\btext-[\w-]+/)?.[0];

            return (
              <Button
                key={button.text}
                variant={button.variant ?? "default"}
                onClick={button.onClick}
                disabled={button.disabled}
                className={cn(
                  "w-full rounded-full cursor-pointer text-sm md:text-base font-medium py-5 px-6 sm:w-auto",
                  button.className,
                  // Override hover to use same background/text as base state
                  bgClass && `[&:hover]:${bgClass}!`,
                  textClass && `[&:hover]:${textClass}!`,
                  "[&:hover]:opacity-100! [&:hover]:scale-100!",
                )}
              >
                {button.icon && <span className="mr-1">{button.icon}</span>}
                {button.text}
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
}

