"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../components/dialog";
import { cn } from "../../lib/utils";

interface DialogWrapperProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode;
  description?: string;
  content: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  showCloseButton?: boolean;
  overlayClassName?: string;
}

const maxWidthClasses = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-lg",
  xl: "sm:max-w-xl",
  "2xl": "sm:max-w-2xl",
  "3xl": "sm:max-w-3xl",
  "4xl": "sm:max-w-4xl",
};

export function DialogWrapper({
  open,
  onOpenChange,
  title,
  description,
  content,
  footer,
  className,
  maxWidth = "lg",
  showCloseButton = true,
  overlayClassName,
}: DialogWrapperProps) {
  // Skip maxWidthClasses if className contains max-w classes (to allow responsive overrides)
  const hasMaxWidthOverride = Boolean(className && /max-w-/.test(className));
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          !hasMaxWidthOverride && maxWidthClasses[maxWidth],
          "max-h-[80vh] sm:max-h-[90vh] flex flex-col",
          "p-4 md:p-8",
          className,
        )}
        showCloseButton={showCloseButton}
      >
        <DialogHeader className="gap-0 pb-3 md:pb-5 shrink-0">
          <DialogTitle className="text-slate-900 text-2xl md:text-3xl font-medium text-start">{title}</DialogTitle>
          {description && <DialogDescription className="text-slate-600 text-sm md:text-base font-normal text-start">{description}</DialogDescription>}
        </DialogHeader>
        <div className="min-w-0 p-0.5 w-full overflow-x-hidden flex-1 overflow-y-auto scrollbar-hide [&::-webkit-scrollbar]:hidden">
          {content}
        </div>
        {footer && <DialogFooter className="shrink-0 pt-4">{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
}

