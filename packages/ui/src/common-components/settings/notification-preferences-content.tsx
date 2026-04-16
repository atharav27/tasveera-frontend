"use client";

import { useController, useForm, type Control, type FieldValues, type Path } from "react-hook-form";

import { Button } from "../../components/button";
import { Checkbox } from "../../components/checkbox";
import { Label } from "../../components/label";

/**
 * Configuration for a single notification preference item.
 */
export interface NotificationPreferenceItem {
    /** Unique key for the preference (used as form field name) */
    key: string;
    /** Display label for the preference */
    label: string;
    /** Description text explaining the preference */
    description: string;
}

/**
 * Props for NotificationCheckboxItem component.
 */
interface NotificationCheckboxItemProps<T extends FieldValues> {
    control: Control<T>;
    name: Path<T>;
    label: string;
    description: string;
    /** Optional callback when checkbox value changes */
    onChange?: (checked: boolean) => void;
}

/**
 * A single notification preference checkbox item.
 */
export function NotificationCheckboxItem<T extends FieldValues>({
    control,
    name,
    label,
    description,
    onChange,
}: NotificationCheckboxItemProps<T>) {
    const { field } = useController({
        control,
        name,
    });

    return (
        <div className="flex items-center space-x-2 md:space-x-3 space-y-0 rounded-md p-3 md:p-4 border border-transparent hover:bg-slate-50 transition-colors">
            <Checkbox
                checked={field.value as boolean}
                onCheckedChange={(checked) => {
                    field.onChange(checked);
                    if (onChange) {
                        onChange(checked as boolean);
                    }
                }}
                className="size-4 md:size-5"
                id={name}
            />
            <div className="flex flex-col gap-0.5 md:gap-1">
                <Label htmlFor={name} className="text-xs md:text-sm font-medium text-slate-900 cursor-pointer">
                    {label}
                </Label>
                <p className="text-xs md:text-sm text-slate-500">{description}</p>
            </div>
        </div>
    );
}

/**
 * Props for NotificationPreferencesContent component.
 */
export interface NotificationPreferencesContentProps {
    /** Array of notification preference items to display */
    preferences: NotificationPreferenceItem[];
    /** Initial values for each preference (keyed by preference key) */
    defaultValues: Record<string, boolean>;
    /** Callback when form is submitted */
    onSubmit?: (values: Record<string, boolean>) => void;
    /** Whether to show the submit button. Defaults to true. */
    showSubmitButton?: boolean;
    /** Label for the submit button. Defaults to "Save Preferences". */
    submitButtonLabel?: string;
    /** Optional callback when a preference value changes (for auto-save) */
    onPreferenceChange?: (key: string, value: boolean) => void;
}

/**
 * A configurable notification preferences form component.
 *
 * @example
 * ```tsx
 * const preferences = [
 *   { key: "bookingConfirmations", label: "Booking Confirmations", description: "Email updates when bookings are confirmed." },
 *   { key: "invoiceReady", label: "Invoice Ready", description: "Alerts when new invoices are generated." },
 * ];
 *
 * <NotificationPreferencesContent
 *   preferences={preferences}
 *   defaultValues={{ bookingConfirmations: true, invoiceReady: false }}
 *   onSubmit={(values) => console.log(values)}
 * />
 * ```
 */
export function NotificationPreferencesContent({
    preferences,
    defaultValues,
    onSubmit,
    showSubmitButton = true,
    submitButtonLabel = "Save Preferences",
    onPreferenceChange,
}: NotificationPreferencesContentProps) {
    const form = useForm<Record<string, boolean>>({
        defaultValues,
    });

    const handleSubmit = (values: Record<string, boolean>) => {
        if (onSubmit) {
            onSubmit(values);
        } else {
            console.log("Notification Preferences:", values);
        }
    };

    const handlePreferenceChange = (key: string) => (checked: boolean) => {
        if (onPreferenceChange) {
            onPreferenceChange(key, checked);
        }
    };

    if (showSubmitButton) {
        return (
            <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
                {preferences.map((pref) => (
                    <NotificationCheckboxItem
                        key={pref.key}
                        control={form.control}
                        name={pref.key as Path<Record<string, boolean>>}
                        label={pref.label}
                        description={pref.description}
                        onChange={handlePreferenceChange(pref.key)}
                    />
                ))}
                <div className="flex justify-end pt-4">
                    <Button type="submit">{submitButtonLabel}</Button>
                </div>
            </form>
        );
    }

    // No submit button version (for auto-save scenarios)
    return (
        <div className="flex flex-col gap-2">
            {preferences.map((pref) => (
                <NotificationCheckboxItem
                    key={pref.key}
                    control={form.control}
                    name={pref.key as Path<Record<string, boolean>>}
                    label={pref.label}
                    description={pref.description}
                    onChange={handlePreferenceChange(pref.key)}
                />
            ))}
        </div>
    );
}
