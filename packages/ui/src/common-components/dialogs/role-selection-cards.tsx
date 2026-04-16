"use client";

import { BadgeIndianRupee, Car, UserCog } from "lucide-react";

import { cn } from "../../lib/utils";

export type AddUserRole = "Admin" | "Travel Desk" | "Accounts";

interface RoleOption {
  value: AddUserRole;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const roleOptions: RoleOption[] = [
  {
    value: "Admin",
    label: "Admin",
    description: "full system access",
    icon: <UserCog className="size-6" strokeWidth={1.5} />,
  },
  {
    value: "Travel Desk",
    label: "Travel Desk",
    description: "trip operations",
    icon: <Car className="size-6" strokeWidth={1.5} />,
  },
  {
    value: "Accounts",
    label: "Accounts",
    description: "billing & finance",
    icon: <BadgeIndianRupee className="size-6" strokeWidth={1.5} />,
  },
];

interface RoleSelectionCardsProps {
  selectedRole: AddUserRole | null;
  onRoleSelect: (role: AddUserRole) => void;
}

export function RoleSelectionCards({ selectedRole, onRoleSelect }: RoleSelectionCardsProps) {
  return (
    <div className="flex flex-col">
      <h3 className="text-base font-medium text-slate-900 mb-2">Select the User Role</h3>
      <div className="grid grid-cols-3 gap-4">
        {roleOptions.map((role) => {
          const isSelected = selectedRole === role.value;

          return (
            <button
              key={role.value}
              type="button"
              onClick={() => onRoleSelect(role.value)}
              className={cn(
                "flex flex-col items-center justify-center gap-3 p-6 rounded-lg border-2 transition-colors",
                isSelected
                  ? " border-primary/50"
                  : "bg-white border-slate-300 hover:border-brand-blue-base",
              )}
            >
              <div className={cn("transition-colors bg-brand-blue-base p-2 rounded-full border", isSelected ? "text-primary" : "text-slate-600 ")}>
                {role.icon}
              </div>
              <div className="flex flex-col items-center gap-1">
                <span
                  className={cn(
                    "text-sm font-medium",
                    isSelected ? "text-slate-900" : "text-slate-600",
                  )}
                >
                  {role.label}
                </span>
                <span
                  className={cn(
                    "text-xs",
                    isSelected ? "text-slate-600" : "text-slate-500",
                  )}
                >
                  {role.description}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
