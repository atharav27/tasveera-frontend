"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "../../components/button";
import { DialogFooter } from "../../components/dialog";
import { FormInputField } from "../form-fields/form-input-field";
import { FormSelectField } from "../form-fields/form-select-field";
import { DialogWrapper } from "./dialog-wrapper";
import { AddUserProgressStepper } from "./add-user-progress-stepper";
import { RoleSelectionCards, type AddUserRole } from "./role-selection-cards";
import { addUserSchema, type AddUserFormData } from "./user-schemas";

interface Department {
  id: string;
  name: string;
}

interface InviteUserData {
  email: string;
  role: string;
  firstName: string;
  lastName?: string;
  departmentId: string;
}

interface AddNewUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  departments: Department[];
  isInviting: boolean;
  onInviteUser: (data: InviteUserData) => Promise<void>;
  /**
   * Role mapping from display values to API values
   * e.g., { "Admin": "corporate_admin", "Travel Desk": "travel_desk", "Accounts": "accounts" }
   */
  roleMapping?: Record<string, string>;
}

export function AddNewUserDialog({
  open,
  onOpenChange,
  departments,
  isInviting,
  onInviteUser,
  roleMapping = {
    "Admin": "corporate_admin",
    "Travel Desk": "travel_desk",
    "Accounts": "accounts"
  },
}: AddNewUserDialogProps) {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [selectedRole, setSelectedRole] = useState<AddUserRole | null>(null);

  const form = useForm<AddUserFormData>({
    resolver: zodResolver(addUserSchema),
    defaultValues: {
      role: undefined,
      fullName: "",
      contactNumber: "",
      companyEmailId: "",
      departmentId: "",
    },
  });

  const handleRoleSelect = (role: AddUserRole) => {
    setSelectedRole(role);
    form.setValue("role", role);
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (selectedRole) {
        form.setValue("role", selectedRole);
        setCurrentStep(2);
      }
    }
  };

  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const handleClose = () => {
    setCurrentStep(1);
    setSelectedRole(null);
    form.reset();
    onOpenChange(false);
  };

  const onSubmit = async (data: AddUserFormData) => {
    try {
      // Name splitting
      const nameParts = data.fullName.trim().split(/\s+/);
      const firstName = nameParts[0] || data.fullName.trim();
      const lastName = nameParts.slice(1).join(" ") || undefined;

      await onInviteUser({
        email: data.companyEmailId,
        role: roleMapping[data.role] || data.role,
        firstName,
        lastName,
        departmentId: data.departmentId,
      });

      setCurrentStep(3);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="py-4">
            <RoleSelectionCards selectedRole={selectedRole} onRoleSelect={handleRoleSelect} />
          </div>
        );

      case 2:
        return (
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
                />
                <FormSelectField
                  control={form.control}
                  name="departmentId"
                  label="Department"
                  placeholder="Select Department"
                  options={departments.map(d => ({ label: d.name, value: d.id }))}
                />
              </div>
            </form>
          </div>
        );

      case 3:
        return (
          <div className="flex flex-col items-center justify-center py-10 space-y-6">
            <div className="flex items-center justify-center size-24 rounded-full bg-green-50">
              <Check className="size-12 text-green-600" strokeWidth={2} />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-medium text-slate-900">User Added Successfully!!</h3>
              <p className="text-base text-slate-600">
                The profile has been created and onboarding details have been sent to their email.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderFooter = () => {
    switch (currentStep) {
      case 1:
        return (
          <DialogFooter>
            <Button
              type="button"
              onClick={handleNext}
              disabled={!selectedRole}
              className="rounded-full bg-primary text-white px-6 py-5"
            >
              Next &gt;
            </Button>
          </DialogFooter>
        );

      case 2:
        return (
          <DialogFooter className="flex-row gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              className="flex-1 rounded-full border-primary text-primary px-6 py-5"
            >
              &lt; Back
            </Button>
            <Button
              type="button"
              onClick={form.handleSubmit(onSubmit)}
              disabled={isInviting}
              className="flex-1 rounded-full bg-primary text-white px-6 py-5"
            >
              {isInviting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Create &gt;
            </Button>
          </DialogFooter>
        );

      default:
        return null;
    }
  };

  return (
    <DialogWrapper
      open={open}
      onOpenChange={handleClose}
      title="Add New User"
      description="Complete the steps below to onboard a new team member"
      className="max-w-sm md:max-w-xl"
      content={
        <div className="flex flex-col">
          <AddUserProgressStepper currentStep={currentStep} />
          {renderStepContent()}
        </div>
      }
      footer={renderFooter()}
    />
  );
}
