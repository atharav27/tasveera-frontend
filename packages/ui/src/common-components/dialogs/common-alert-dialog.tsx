"use client";

import * as React from "react";

import { Button } from "../../components/button";
import { Dialog, DialogContent, DialogTitle } from "../../components/dialog";
import { cn } from "../../lib/utils";

import { alertDialogConfig, type AlertDialogVariant } from "./alert-dialog-config";

export interface AlertDialogButton {
  label: string | React.ReactNode;
  onClick: () => void;
  variant?: "default" | "destructive" | "outline" | "link";
  className?: string;
  id?: string;
  disabled?: boolean;
}

type ImageComponentProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
};

interface AlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant: AlertDialogVariant;
  title: string;
  subtitle: string;
  buttons?: AlertDialogButton[];
  maxWidth?: "sm" | "md" | "lg";
  showCloseButton?: boolean;

  /** Injected image renderer (e.g. next/image) */
  ImageComponent: React.ComponentType<ImageComponentProps>;
}

const maxWidthClasses = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-lg",
};

export function CommonAlertDialog({
  open,
  onOpenChange,
  variant,
  title,
  subtitle,
  buttons,
  maxWidth = "md",
  showCloseButton = true,
  ImageComponent,
}: AlertDialogProps) {
  const variantConfig = alertDialogConfig[variant];
  const image = variantConfig.image;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          maxWidthClasses[maxWidth],
          "max-h-[90vh] overflow-y-auto",
          "[&::-webkit-scrollbar]:hidden",
          "scrollbar-hide",
          "p-10"
        )}
        showCloseButton={showCloseButton}
      >
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Image */}
          <div className="flex items-center justify-center mt-10">
            <ImageComponent
              src={image}
              alt={variant}
              width={150}
              height={150}
              className="object-contain"
            />
          </div>

          {/* Title */}
          <DialogTitle className="text-2xl font-medium text-slate-900">
            {title}
          </DialogTitle>

          {/* Subtitle */}
          <p className="text-base text-slate-600">{subtitle}</p>

          {/* Buttons */}
          {buttons && buttons.length > 0 && (
            <div
              className={cn(
                "flex gap-3 w-full mt-4",
                buttons.some((b) => b.variant === "link") &&
                "justify-center"
              )}
            >
              {buttons.map((button, index) => (
                <Button
                  key={
                    button.id ??
                    (typeof button.label === "string"
                      ? button.label
                      : `button-${index}`)
                  }
                  type="button"
                  variant={button.variant ?? "default"}
                  onClick={button.onClick}
                  disabled={button.disabled}
                  className={cn(
                    button.variant === "link" ? "w-auto" : "flex-1",
                    button.className
                  ) + " rounded-full py-5 px-4"}
                >
                  {button.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
