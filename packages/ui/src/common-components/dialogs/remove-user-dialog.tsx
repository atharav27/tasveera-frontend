"use client";

import type { ComponentType } from "react";
import { Loader2 } from "lucide-react";

import { CommonAlertDialog } from "./common-alert-dialog";

interface UserData {
  id: string;
  name: string;
}

interface RemoveUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserData | null;
  isSuspending: boolean;
  onSuspendUser: (userId: string, data: { reason: string }) => Promise<void>;
  onConfirm: () => void;
  /** Next.js Image component or any compatible image component */
  ImageComponent: ComponentType<{ src: string; alt: string; width: number; height: number; className?: string }>;
}

export function RemoveUserDialog({
  open,
  onOpenChange,
  user,
  isSuspending,
  onSuspendUser,
  onConfirm,
  ImageComponent,
}: RemoveUserDialogProps) {
  const handleRemove = async () => {
    if (!user) return;
    try {
      await onSuspendUser(user.id, { reason: "Suspended by admin" });
      onConfirm();
      onOpenChange(false);
    } catch (error) {
      console.error("Error suspending user:", error);
    }
  };

  const handleGoBack = () => {
    onOpenChange(false);
  };

  if (!user) return null;

  return (
    <CommonAlertDialog
      open={open}
      onOpenChange={onOpenChange}
      ImageComponent={ImageComponent}
      variant="warning"
      title={`Suspend ${user.name}?`}
      subtitle="The account and its data will be deleted permanently and cannot be restored."
      maxWidth="sm"
      buttons={[
        {
          label: isSuspending ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Suspending...</span>
            </div>
          ) : (
            "Suspend User"
          ),
          variant: "destructive",
          onClick: handleRemove,
          disabled: isSuspending,
        },
        {
          label: "Go Back",
          variant: "default",
          onClick: handleGoBack,
        },
      ]}
    />
  );
}
