"use client";

import { Mail, Sparkles, User, Users, Loader2, type LucideIcon } from "lucide-react";

import { cn } from "../../lib/utils";
import { BadgeVariant } from "../badge/badge-variant";
import { DialogWrapper } from "./dialog-wrapper";

interface UserActivity {
  id: string;
  action: string;
  timestamp: string;
  ipAddress: string;
  category: string;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  department?: {
    id: string;
    name: string;
  } | null;
}

interface ContactInfoRowProps {
  icon: LucideIcon;
  label: string;
  value: string;
  labelColor?: string;
}

function ContactInfoRow({ icon: Icon, label, value, labelColor = "text-slate-500" }: ContactInfoRowProps) {
  return (
    <div className=" gap-3">
      <div className="flex items-center gap-2">
        <Icon className="size-5 text-slate-500" strokeWidth={1.5} />
        <span className={cn("text-sm font-normal", labelColor)}>{label}:</span>
      </div>

      <span className="text-sm font-normal text-slate-900">{value}</span>

    </div>
  );
}

interface ViewUserDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserData | null | undefined;
  isLoading?: boolean;
  recentActivity?: UserActivity[];
  /** Optional function to format role for display */
  formatRole?: (role: string) => string;
  /** Optional function to format status for display */
  formatStatus?: (status: string) => string;
}

const defaultFormatRole = (role: string) => {
  return role
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const defaultFormatStatus = (status: string) => {
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
};

export function ViewUserDetailsDialog({
  open,
  onOpenChange,
  user,
  isLoading = false,
  recentActivity = [],
  formatRole = defaultFormatRole,
  formatStatus = defaultFormatStatus,
}: ViewUserDetailsDialogProps) {
  if (isLoading && open) {
    return (
      <DialogWrapper
        open={open}
        onOpenChange={onOpenChange}
        title="Loading User Details..."
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
      onOpenChange={onOpenChange}
      title={user.name}
      description={user.email}
      maxWidth="xl"
      content={
        <div className="flex flex-col gap-4 md:gap-6">
          {/* Contact Information Section */}
          <div className="rounded-lg border border-brand-blue-base p-4 md:p-6">
            <h3 className="mb-3 md:mb-4 text-sm md:text-base font-medium text-brand-blue-400">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 md:gap-x-16 gap-y-4 md:gap-y-5">
              <ContactInfoRow icon={Mail} label="Email" value={user.email} />
              <ContactInfoRow icon={Users} label="Department" value={user.department?.name || "N/A"} />
              <ContactInfoRow icon={User} label="Role" value={formatRole(user.role)} labelColor="text-slate-600" />
              <ContactInfoRow icon={Sparkles} label="Status" value={formatStatus(user.status)} labelColor="text-slate-600" />
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="rounded-lg border border-brand-blue-base p-4 md:p-6">
            <h3 className="mb-3 md:mb-4 text-sm md:text-base font-medium text-brand-blue-400">Recent Activity</h3>
            <div className="flex flex-col gap-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity: UserActivity) => (
                  <div key={activity.id} className="flex justify-between items-start gap-1">
                    <div>
                      <p className="text-sm font-normal text-slate-900">{activity.action}</p>
                      <span className="text-xs text-slate-500">
                        {activity.timestamp} | IP: {activity.ipAddress}
                      </span>
                    </div>

                    <BadgeVariant
                      text={activity.category}
                      variant="neutral"
                      size="md"
                      rounded="full"
                      className="h-fit font-normal"
                    />
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">No recent activity recorded.</p>
              )}
            </div>
          </div>
        </div>
      }
    />
  );
}
