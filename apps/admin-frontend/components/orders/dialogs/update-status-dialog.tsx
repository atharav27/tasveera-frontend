"use client";

import {
  DialogWrapper,
  Button,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Label,
} from "@corpora/ui";
import { useState } from "react";

interface UpdateStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentStatus: string;
  onUpdate: (newStatus: string) => void;
}

export function UpdateStatusDialog({
  open,
  onOpenChange,
  currentStatus,
  onUpdate,
}: UpdateStatusDialogProps) {
  const [status, setStatus] = useState(currentStatus);

  const statuses = [
    "PENDING",
    "PAID",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ];

  return (
    <DialogWrapper
      open={open}
      onOpenChange={onOpenChange}
      title="Update Order Status"
      description="Select the new status for this order. Make sure the transition is valid."
      maxWidth="md"
      content={
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="status">New Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="status" className="h-12 rounded-xl">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      }
      footer={
        <div className="flex gap-3 w-full">
          <Button variant="outline" className="flex-1 rounded-full h-12" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button className="flex-1 rounded-full h-12" onClick={() => onUpdate(status)}>
            Update Status
          </Button>
        </div>
      }
    />
  );
}
