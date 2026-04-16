"use client";

import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "../../components/button";
import { DialogFooter } from "../../components/dialog";
import { FormInputField } from "../form-fields/form-input-field";
import { FormSelectField } from "../form-fields/form-select-field";
import { DialogWrapper } from "./dialog-wrapper";
import { editUserSchema, type EditUserFormData } from "./user-schemas";

interface Department {
  id: string;
  name: string;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  department?: {
    id: string;
    name: string;
  } | null;
}

interface UpdateUserData {
  name: string;
  phone: string;
  departmentId: string;
}

interface EditUserDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserData | null | undefined;
  departments: Department[];
  isUpdating: boolean;
  isLoading?: boolean;
  onUpdateUser: (userId: string, data: UpdateUserData) => Promise<void>;
  onSuccess?: () => void;
}

export function EditUserDetailsDialog({
  open,
  onOpenChange,
  user,
  departments,
  isUpdating,
  isLoading = false,
  onUpdateUser,
  onSuccess,
}: EditUserDetailsDialogProps) {
  const form = useForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      fullName: "",
      contactNumber: "",
      companyEmailId: "",
      department: "",
    },
  });

  // Reset form with user data when dialog opens or user changes
  useEffect(() => {
    if (open && user) {
      form.reset({
        fullName: user.name || "",
        contactNumber: user.phone || "",
        companyEmailId: user.email || "",
        department: user.department?.id || "",
      });
    }
  }, [user, form, open]);

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  const onSubmit = async (data: EditUserFormData) => {
    if (!user?.id) return;
    try {
      await onUpdateUser(user.id, {
        name: data.fullName,
        phone: data.contactNumber,
        departmentId: data.department,
      });
      onSuccess?.();
      handleClose();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  if (isLoading && open) {
    return (
      <DialogWrapper
        open={open}
        onOpenChange={handleClose}
        title="Loading..."
        content={
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        }
      />
    );
  }

  if (!user) return null;

  return (
    <DialogWrapper
      open={open}
      onOpenChange={handleClose}
      title="Edit User Details"
      description="Edit the details and access of the user"
      className="max-w-sm md:max-w-xl"
      content={
        <div className="py-4 md:py-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <FormInputField
                control={form.control}
                name="fullName"
                label="Full Name"
                placeholder="Enter full name"
              />
              <FormInputField
                control={form.control}
                name="contactNumber"
                label="Contact Number"
                placeholder="Enter contact number"
                type="tel"
              />
              <FormInputField
                control={form.control}
                name="companyEmailId"
                label="Company Email ID"
                placeholder="Enter email"
                type="email"
                disabled
              />
              <FormSelectField
                control={form.control}
                name="department"
                label="Department"
                placeholder="Select Department"
                options={departments.map((d) => ({ label: d.name, value: d.id }))}
              />
            </div>
          </form>
        </div>
      }
      footer={
        <DialogFooter className="flex-row gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="rounded-full border-primary text-primary px-6 py-5"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={form.handleSubmit(onSubmit)}
            disabled={isUpdating}
            className="rounded-full bg-primary text-white px-6 py-5"
          >
            {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Update Details
          </Button>
        </DialogFooter>
      }
    />
  );
}
