"use client";

import { type LucideIcon, Ban, CarTaxiFront, CircleCheckBig, CopyX, Download, Eye, MoreHorizontal, Pencil, Send, Ticket, Trash2, UserPlus, Users, XCircle } from "lucide-react";

import { Button } from "@corpora/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@corpora/ui";
import { cn } from "@corpora/ui";

export type ActionIconName = "eye" | "pencil" | "ban" | "trash2" | "ticket" | "xcircle" | "download" | "userPlus" | "carTaxiFront" | "deactivate" | "users" | "send" | "circleCheckBig";

const iconMap: Record<ActionIconName, LucideIcon> = {
  eye: Eye,
  pencil: Pencil,
  ban: Ban,
  trash2: Trash2,
  ticket: Ticket,
  xcircle: XCircle,
  download: Download,
  userPlus: UserPlus,
  carTaxiFront: CarTaxiFront,
  deactivate: CopyX,
  users: Users,
  send: Send ,
  circleCheckBig: CircleCheckBig,
};

export type ActionItem = {
  label: string;
  icon: ActionIconName;
  onClick?: () => void;
  variant?: "default" | "destructive";
  disabled?: boolean;
};

interface ActionsDropdownProps {
  items: ActionItem[];
  className?: string;
}

export function ActionsDropdown({ items, className }: ActionsDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-7 w-7 md:h-8 md:w-8",
            "rounded-full text-slate-500 hover:bg-slate-100 cursor-pointer",
            className
          )}
        >
          <MoreHorizontal className="h-5 w-5 md:h-6 md:w-6" />
          <span className="sr-only">Open actions menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36 md:w-44 rounded-lg border-0 p-0">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isDestructive = item.variant === "destructive";
          const IconComponent = iconMap[item.icon];

          return (
            <DropdownMenuItem
              key={item.label}
              onClick={item.disabled ? undefined : item.onClick}
              disabled={item.disabled}
              className={cn(
                "flex items-center rounded-none cursor-pointer [&_svg]:size-[unset]!",
                "gap-2 py-2 px-3 md:gap-3 md:py-3 md:px-4",
                !isLast && "border-b",
                isDestructive
                  ? "text-red-500 hover:bg-transparent! hover:text-red-500! focus:bg-transparent! focus:text-red-500!"
                  : "focus:bg-transparent!",
                item.disabled && "opacity-50 cursor-not-allowed grayscale pointer-events-none"
              )}
              variant={isDestructive ? "destructive" : "default"}
            >
              <IconComponent
                className={cn(
                  "size-3 md:size-3.5",
                  isDestructive ? "text-red-500" : "text-slate-900",
                )}
                strokeWidth={1}
              />
              <span
                className={cn(
                  "text-xs md:text-sm font-normal",
                  isDestructive ? "text-red-500" : "text-slate-900",
                )}
              >
                {item.label}
              </span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
