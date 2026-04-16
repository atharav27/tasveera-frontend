"use client";

import { type ComponentType, type SVGProps, useState } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@corpora/ui";

export interface QuickAction {
  id: string;
  ariaLabel: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  iconClassName?: string;
  onClick?: () => void;
}

export interface PrimaryAction {
  text: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  onClick?: () => void;
}

interface QuickActionsProps {
  actions: QuickAction[];
  primaryAction: PrimaryAction;
  className?: string;
}

export function QuickActions({ actions, primaryAction, className }: QuickActionsProps) {
  const [open, setOpen] = useState(false);
  const Icon = open ? ChevronRight : ChevronLeft;
  const PrimaryIcon = primaryAction.icon;

  return (
    <div className={`pointer-events-none fixed right-0 top-60 z-50 flex flex-col md:flex-row items-end md:items-center ${className ?? ""}`}>
      <div className={`pointer-events-auto bg-brand-blue-base shadow-md flex origin-right transition-all duration-200 flex-col md:flex-row items-center gap-1.5 md:gap-2 ${open
          ? "rounded-l-2xl md:rounded-l-full py-3 md:py-1.5 px-3 md:px-2.5"
          : "rounded-l-full py-2 md:py-1.5 px-1.5 md:px-2.5"
        }`}>
        {open && (
          <div className="flex flex-col md:flex-row items-center gap-2">
            {/* Primary Action Button */}
            <Button
              size="sm"
              onClick={primaryAction.onClick}
              className="rounded-full bg-primary text-primary-foreground font-medium shadow-none py-3 md:py-5 px-3 md:px-4 text-xs md:text-sm gap-1 md:gap-1.5"
            >
              <PrimaryIcon className="size-3 md:size-4" />
              {primaryAction.text}
            </Button>

            {/* Secondary Actions */}
            <div className="grid grid-cols-2 md:flex md:items-center gap-x-4 gap-y-2 md:gap-2">
              {actions.map(({ id, ariaLabel, icon: ActionIcon, iconClassName, onClick }) => (
                <Button
                  key={id}
                  variant="secondary"
                  size="icon-sm"
                  aria-label={ariaLabel}
                  onClick={onClick}
                  className="rounded-full bg-white text-slate-500 hover:bg-white hover:text-slate-500 p-3 md:p-5"
                >
                  <ActionIcon className={iconClassName ?? "size-4 md:size-5"} />
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Toggle Button */}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Collapse quick actions" : "Expand quick actions"}
          className="rounded-full bg-white text-slate-500 hover:bg-white hover:text-slate-500 p-3 md:p-5"
        >
          <Icon className="size-5 md:size-6" />
        </Button>
      </div>
    </div>
  );
}
