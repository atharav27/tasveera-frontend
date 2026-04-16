"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Upload } from "lucide-react";
import { useForm } from "react-hook-form";

import { FormInputField, FormSelectField } from "@corpora/ui";
import { Avatar, AvatarFallback } from "@corpora/ui";
import { Button } from "@corpora/ui";

import type { ProfileAccountData } from "@/types/settings";

import { profileAccountSchema, type ProfileAccountFormData } from "./schemas/profile-account-schema";

interface ProfileAccountContentProps {
  data: ProfileAccountData;
}

const departments = ["Operations", "Finance", "HR", "IT", "Sales", "Marketing"];

export function ProfileAccountContent({ data }: ProfileAccountContentProps) {
  const form = useForm<ProfileAccountFormData>({
    resolver: zodResolver(profileAccountSchema),
    defaultValues: {
      companyName: data.companyName,
      gstin: data.gstin,
      pan: data.pan,
      registeredAddress: data.registeredAddress,
      contactPerson: data.contactPerson,
      employeeId: data.employeeId,
      department: data.department,
      corporateEmail: data.corporateEmail,
      phoneNumber: data.phoneNumber,
      bankName: data.bankName,
      accountNumber: data.accountNumber,
      ifscCode: data.ifscCode,
    },
  });

  const onSubmit = (values: ProfileAccountFormData) => {
    console.log("Profile & Account Data:", values);
    // TODO: Implement update functionality
  };

  const onReset = () => {
    form.reset();
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6 md:gap-8">
      {/* Profile Photo Upload */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-5">
        <Avatar className="size-14 md:size-18">
          <AvatarFallback className="bg-slate-100 text-primary text-base md:text-lg font-medium">
            {getInitials(data.contactPerson)}
          </AvatarFallback>
        </Avatar>
        <Button type="button" variant="outline" className="rounded-full text-sm md:text-base text-primary border-primary cursor-pointer px-4 md:px-6 py-4 md:py-5 w-full md:w-auto">
          <Upload className="mr-2 size-3.5 md:size-4" />
          Upload Photo
        </Button>
      </div>

      {/* Company Details */}
      <div className="flex flex-col gap-3 md:gap-4">
        <h3 className="text-sm md:text-base font-medium text-brand-blue-400">Company Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <FormInputField control={form.control} name="companyName" label="Company Name" placeholder="Enter company name" />
          <FormInputField control={form.control} name="gstin" label="GSTIN" placeholder="Enter GSTIN" />
          <FormInputField control={form.control} name="pan" label="PAN" placeholder="Enter PAN" />
          <FormInputField
            control={form.control}
            name="registeredAddress"
            label="Registered Address"
            placeholder="Enter registered address"
          />
        </div>
      </div>

      {/* Contact Information */}
      <div className="flex flex-col gap-3 md:gap-4">
        <h3 className="text-sm md:text-base font-medium text-brand-blue-400">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          <FormInputField control={form.control} name="contactPerson" label="Contact Person" placeholder="Enter contact person" />
          <FormInputField control={form.control} name="employeeId" label="Employee ID" placeholder="Enter employee ID" />
          <FormInputField
            control={form.control}
            name="corporateEmail"
            label="Corporate Email ID"
            placeholder="Enter corporate email"
            type="email"
          />
          <FormSelectField
            control={form.control}
            name="department"
            label="Department"
            placeholder="Select department"
            options={departments}
          />
          <FormInputField
            control={form.control}
            name="phoneNumber"
            label="Phone No."
            placeholder="Enter phone number"
            type="tel"
          />
        </div>
      </div>

      {/* Bank Details */}
      <div className="flex flex-col gap-3 md:gap-4">
        <h3 className="text-sm md:text-base font-medium text-brand-blue-400">Bank Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          <FormInputField control={form.control} name="bankName" label="Bank Name" placeholder="Enter bank name" />
          <FormInputField
            control={form.control}
            name="accountNumber"
            label="Account Number"
            placeholder="Enter account number"
          />
          <FormInputField control={form.control} name="ifscCode" label="IFSC Code" placeholder="Enter IFSC code" />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-start">
        <Button type="button" variant="outline" onClick={onReset} className="rounded-full px-6 py-2.5 h-auto min-w-[120px]">
          Reset
        </Button>
        <Button type="submit" className="rounded-full px-6 py-2.5 h-auto min-w-[120px]">
          Update Changes
        </Button>
      </div>
    </form>
  );
}

