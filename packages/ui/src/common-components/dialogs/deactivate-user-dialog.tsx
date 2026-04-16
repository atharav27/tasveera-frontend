"use client";

import type { ComponentType } from "react";
import { Loader2 } from "lucide-react";

import { CommonAlertDialog } from "./common-alert-dialog";

interface UserData {
  id: string;
  name: string;
}

interface DeactivateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserData | null;
  isUpdating: boolean;
  onUpdateStatus: (userId: string, data: { status: string }) => Promise<void>;
  onConfirm: () => void;
  /** Next.js Image component or any compatible image component */
  ImageComponent: ComponentType<{ src: string; alt: string; width: number; height: number; className?: string }>;
}

export function DeactivateUserDialog({
  open,
  onOpenChange,
  user,
  isUpdating,
  onUpdateStatus,
  onConfirm,
  ImageComponent,
}: DeactivateUserDialogProps) {
  const handleDeactivate = async () => {
    if (!user) return;
    try {
      await onUpdateStatus(user.id, { status: "Inactive" });
      onConfirm();
      onOpenChange(false);
    } catch (error) {
      console.error("Error deactivating user:", error);
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
      title={`Deactivate ${user.name}?`}
      subtitle="Deactivating this user will disable their account and stop them from accessing the system."
      maxWidth="sm"
      buttons={[
        {
          label: isUpdating ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Deactivating...</span>
            </div>
          ) : (
            "Deactivate"
          ),
          variant: "destructive",
          onClick: handleDeactivate,
          disabled: isUpdating,
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
