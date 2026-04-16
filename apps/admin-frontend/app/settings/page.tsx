"use client";
import React from "react";

import {
  SettingsCategorySection,
  ChangePasswordContent,
  NotificationPreferencesContent,
  type NotificationPreferenceItem,
} from "@corpora/ui";

import { DashboardLayout } from "@/components/dashboard-layout";

import { ProfileAccountContent } from "../../components/settings/components/profile-account-content";
import { TravelPolicyContent } from "../../components/settings/components/travel-policy-content";
import {
  settingsCategories,
  mockNotificationPreferencesData,
  mockProfileAccountData,
  mockTravelPolicies,
} from "@/_data/mock-settings";

// Notification preference items for corporate users
const corporateNotificationPreferences: NotificationPreferenceItem[] = [
  {
    key: "bookingConfirmations",
    label: "Booking Confirmations",
    description: "Email updates when bookings are confirmed.",
  },
  {
    key: "invoiceReady",
    label: "Invoice Ready",
    description: "Alerts when new invoices are generated.",
  },
  {
    key: "paymentReminders",
    label: "Payment Reminders",
    description: "Upcoming or overdue payment alerts.",
  },
  {
    key: "supportUpdates",
    label: "Support Updates",
    description: "Status updates for your support tickets.",
  },
];

function ChangePasswordSection() {
  const [isChanging, setIsChanging] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  const handleChangePassword = async (data: { currentPassword: string; newPassword: string; otp?: string }) => {
    setError(null);
    setIsChanging(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      void data;
    } catch (e) {
      setError(e instanceof Error ? e : new Error("Could not update password"));
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <ChangePasswordContent
      onChangePassword={handleChangePassword}
      isChanging={isChanging}
      error={error}
    />
  );
}

export default function SettingsPage() {
  const handleNotificationSubmit = (values: Record<string, boolean>) => {
    console.log("Notification Preferences:", values);
    // TODO: Implement update functionality
  };

  return (
    <DashboardLayout
      breadcrumbs={[
        { label: "Settings", active: true },
      ]}
    >
      <div className="flex flex-col gap-4 md:gap-6">
        <div className="flex flex-col gap-4 md:gap-6">
          {settingsCategories.map((category) => (
            <SettingsCategorySection
              key={category.id}
              title={category.title}
              description={category.description}
              defaultExpanded={category.defaultExpanded}
            >
              {category.id === "profile-account" && (
                <ProfileAccountContent data={mockProfileAccountData} />
              )}
              {category.id === "notification-preferences" && (
                <NotificationPreferencesContent
                  preferences={corporateNotificationPreferences}
                  defaultValues={{ ...mockNotificationPreferencesData }}
                  onSubmit={handleNotificationSubmit}
                />
              )}
              {category.id === "change-password" && <ChangePasswordSection />}
              {category.id === "travel-policy" && <TravelPolicyContent policies={mockTravelPolicies} />}
            </SettingsCategorySection>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
