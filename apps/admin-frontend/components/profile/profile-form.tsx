"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { 
  Button, 
  Card,
  CardContent,
  Label,
  StatusBadge,
} from "@corpora/ui";
import { FormInputField } from "@corpora/ui";
import { User, Shield, Mail, Calendar } from "lucide-react";
import { format } from "date-fns";

export interface AdminProfile {
    id: string;
    email: string;
    name: string;
    role: string;
    isActive: boolean;
    createdAt: string;
}

interface ProfileFormProps {
  initialData: AdminProfile;
  onUpdate: (data: any) => void;
  isLoading?: boolean;
}

export function ProfileForm({ initialData, onUpdate, isLoading }: ProfileFormProps) {
  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      name: initialData.name,
      currentPassword: "",
      newPassword: "",
    }
  });

  const currentPassword = watch("currentPassword");
  const newPassword = watch("newPassword");

  const onSubmit = (data: any) => {
    const payload: any = {};
    if (data.name !== initialData.name) payload.name = data.name;
    if (data.currentPassword && data.newPassword) {
        payload.currentPassword = data.currentPassword;
        payload.newPassword = data.newPassword;
    }

    if (Object.keys(payload).length > 0) {
        onUpdate(payload);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto space-y-6">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4 py-2">
        <div className="flex items-center gap-5">
            <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border shadow-inner">
                <User className="h-10 w-10" />
            </div>
            <div className="space-y-1">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{initialData.name}</h1>
                <div className="flex items-center gap-2">
                    <StatusBadge 
                        status={initialData.isActive ? "Active" : "Inactive"} 
                        text={initialData.isActive ? "Active Account" : "Inactive"} 
                        statusToVariant={{ "Active": "green", "Inactive": "red" }}
                        className="scale-90 origin-left"
                    />
                    <span className="text-sm text-muted-foreground font-medium">• {initialData.role}</span>
                </div>
            </div>
        </div>
        <div className="flex gap-3">
             <Button type="submit" disabled={isLoading} className="rounded-full px-8 font-semibold">
                {isLoading ? "Saving..." : "Save Changes"}
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* LEFT COLUMN: ACCOUNT METADATA */}
        <div className="md:col-span-4 space-y-6">
             <Card className="rounded-[1.5rem] border-slate-200/60 shadow-sm overflow-hidden">
                <CardContent className="p-6 space-y-5">
                    <div className="space-y-1">
                        <Label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Email Address</Label>
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                            <Mail className="h-3.5 w-3.5 text-slate-400" />
                            {initialData.email}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <Label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Permissions</Label>
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                            <Shield className="h-3.5 w-3.5 text-slate-400" />
                            Full Administrative Access
                        </div>
                    </div>
                    <div className="space-y-1">
                        <Label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Member Since</Label>
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                            <Calendar className="h-3.5 w-3.5 text-slate-400" />
                            {format(new Date(initialData.createdAt), "MMMM d, yyyy")}
                        </div>
                    </div>
                </CardContent>
             </Card>
        </div>

        {/* RIGHT COLUMN: EDITABLE FORMS */}
        <div className="md:col-span-8 space-y-6">
            <Card className="rounded-[1.5rem] border-slate-200/60 shadow-sm overflow-hidden">
                <CardContent className="p-8 space-y-8">
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-slate-900 border-b pb-2 italic">Personal Information</h3>
                        <FormInputField
                            control={control}
                            name="name"
                            label="Display Name"
                            placeholder="Your name"
                            className="h-12 rounded-xl bg-slate-50/50 border-slate-200 shadow-none focus:bg-white transition-colors"
                        />
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-sm font-bold text-slate-900 border-b pb-2 italic">Security</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormInputField
                                control={control}
                                name="currentPassword"
                                label="Current Password"
                                type="password"
                                placeholder="••••••••"
                                className="h-12 rounded-xl bg-slate-50/50 border-slate-200 shadow-none focus:bg-white transition-colors"
                            />
                            <FormInputField
                                control={control}
                                name="newPassword"
                                label="New Password"
                                type="password"
                                placeholder="Min. 8 characters"
                                className="h-12 rounded-xl bg-slate-50/50 border-slate-200 shadow-none focus:bg-white transition-colors"
                            />
                        </div>
                        <p className="text-[10px] text-muted-foreground italic font-medium">To keep your account secure, change your password periodically.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </form>
  );
}
