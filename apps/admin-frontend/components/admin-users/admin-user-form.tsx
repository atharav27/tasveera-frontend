"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { 
  Button, 
  Card,
  CardContent
} from "@corpora/ui";
import { FormInputField, FormSelectField } from "@corpora/ui";
import { AdminUser, AdminRole } from "./mock-data";
import { useRouter } from "next/navigation";
import { Shield, Lock } from "lucide-react";

interface AdminUserFormProps {
  initialData?: AdminUser;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

type FormSnapshot = {
  name: string;
  email: string;
  password?: string;
  role: AdminRole;
};

export function AdminUserForm({ initialData, onSubmit, isLoading }: AdminUserFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;
  
  const { control, handleSubmit } = useForm<FormSnapshot>({
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      password: "",
      role: initialData?.role || "SUPPORT",
    }
  });

  const onFormSubmit = (data: FormSnapshot) => {
    const payload: any = { ...data };
    
    // Manual Validation Layer
    if (!payload.name.trim()) {
        alert("Full Name is strictly required.");
        return;
    }

    if (isEditing) {
        // Can't patch email or password via this route in edit mode
        delete payload.email;
        delete payload.password;
    } else {
        if (!payload.email.trim()) {
            alert("Email Address is required.");
            return;
        }
        
        // Password Complexity Regex Validation
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!payload.password || !passwordRegex.test(payload.password)) {
            alert("Password must contain: 8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 special character.");
            return;
        }

        payload.email = payload.email.toLowerCase();
    }

    // Ensure we don't send empty updates
    if (isEditing && payload.name === initialData.name && payload.role === initialData.role) {
        router.back();
        return;
    }

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-[1.5rem] border-slate-200/60 shadow-sm overflow-hidden">
            <CardContent className="p-8 space-y-6">
              <h3 className="text-sm font-bold text-slate-900 border-b pb-2">Identity Configuration</h3>
              
              <FormInputField
                control={control}
                name="name"
                label="Full Name"
                placeholder="Ex. John Doe"
                className="h-12 rounded-xl bg-slate-50/50 border-slate-200 shadow-none focus:bg-white transition-colors"
                type="text"
              />

              {!isEditing && (
                  <FormInputField
                    control={control}
                    name="email"
                    label="Secure Email Address"
                    type="email"
                    placeholder="john@tasveera.in"
                    className="h-12 rounded-xl bg-slate-50/50 border-slate-200 shadow-none focus:bg-white transition-colors"
                  />
              )}

              <div className="w-full relative -top-1">
                  <FormSelectField
                      control={control}
                      name="role"
                      label="Authorization Tier"
                      options={[
                          { label: "System Architect (SUPER ADMIN)", value: "SUPER_ADMIN" },
                          { label: "Platform Manager (ADMIN)", value: "ADMIN" },
                          { label: "Catalog Modeler (DESIGNER)", value: "DESIGNER" },
                          { label: "Customer Representative (SUPPORT)", value: "SUPPORT" }
                      ]}
                      className="h-12 rounded-xl bg-slate-50/50 border-slate-200 shadow-none hover:bg-white transition-colors"
                  />
              </div>
            </CardContent>
          </Card>

          {!isEditing && (
              <Card className="rounded-[1.5rem] border-slate-200/60 shadow-sm overflow-hidden">
                <CardContent className="p-8 space-y-6">
                    <div className="flex items-center gap-2 border-b pb-2">
                        <Lock className="h-4 w-4 text-slate-500" />
                        <h3 className="text-sm font-bold text-slate-900">Security Uplink</h3>
                    </div>
                    
                    <FormInputField
                        control={control}
                        name="password"
                        label="Initial Vault Key"
                        type="password"
                        placeholder="••••••••"
                        className="h-12 rounded-xl bg-slate-50/50 border-slate-200 shadow-none focus:bg-white transition-colors"
                    />
                    <p className="text-xs text-muted-foreground font-medium italic">
                        The user will be required to change this upon their first system login.
                    </p>
                </CardContent>
              </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="rounded-[1.5rem] border-slate-200/60 shadow-sm bg-slate-50/50">
            <CardContent className="p-6">
                <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-slate-200/50 flex items-center justify-center shrink-0">
                        <Shield className="h-5 w-5 text-slate-500" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-slate-900 mb-1">Privilege Disclaimer</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                            Generating a new administrative identity implies granting deep access to the Tasveera architecture. Proceed with strict operational security.
                        </p>
                    </div>
                </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-3">
              <Button type="submit" className="w-full h-12 rounded-full font-semibold shadow-sm" disabled={isLoading}>
                {isLoading ? "Executing..." : isEditing ? "Save Configuration" : "Provision Identity"}
              </Button>
              <Button type="button" variant="outline" className="w-full h-12 rounded-full font-medium bg-transparent" onClick={() => router.back()}>
                Cancel / Return
              </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
