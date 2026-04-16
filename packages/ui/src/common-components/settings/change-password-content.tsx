"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";

import { FormInputField } from "../form-fields/form-input-field";
import { Button } from "../../components/button";
import { changePasswordSchema, changePasswordWithOtpSchema } from "./change-password-schema";

// Combined form data type that supports both with and without OTP
interface ChangePasswordFormValues {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
    otp?: string;
}

export interface ChangePasswordContentProps {
    /**
     * Function to call when password change is submitted.
     * Receives currentPassword, newPassword, and optionally otp.
     */
    onChangePassword: (data: { currentPassword: string; newPassword: string; otp?: string }) => Promise<void>;
    /**
     * Whether the password change is in progress.
     */
    isChanging?: boolean;
    /**
     * Error message to display.
     */
    error?: Error | null;
    /**
     * Whether to show the OTP field. Defaults to false.
     */
    showOtpField?: boolean;
    /**
     * Custom error parser function. Used to parse error messages from API responses.
     */
    parseError?: (error: Error) => string;
    /**
     * Success message handler. Called when password is changed successfully.
     */
    onSuccess?: () => void;
}

export function ChangePasswordContent({
    onChangePassword,
    isChanging = false,
    error = null,
    showOtpField = false,
    parseError,
    onSuccess,
}: ChangePasswordContentProps) {
    // Select schema based on whether OTP field is shown
    const schema = showOtpField ? changePasswordWithOtpSchema : changePasswordSchema;

    const form = useForm<ChangePasswordFormValues>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(schema) as Resolver<ChangePasswordFormValues, any>,
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
            ...(showOtpField ? { otp: "" } : {}),
        },
    });

    const onSubmit = async (values: ChangePasswordFormValues) => {
        try {
            await onChangePassword({
                currentPassword: values.currentPassword,
                newPassword: values.newPassword,
                ...(showOtpField && values.otp ? { otp: values.otp } : {}),
            });
            if (onSuccess) {
                onSuccess();
            } else {
                alert("Password changed successfully!");
            }
            form.reset();
        } catch (err) {
            console.error("Failed to change password:", err);
            // Error handling is partly managed by the hook's error state
        }
    };

    const onCancel = () => {
        form.reset();
    };

    const getErrorMessage = (err: Error): string => {
        if (parseError) {
            return parseError(err);
        }
        // Default error parsing: try to parse JSON error message
        try {
            const parsed = JSON.parse(err.message);
            return parsed?.error?.message || parsed?.message || err.message;
        } catch {
            return err.message;
        }
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 md:gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <FormInputField
                    control={form.control}
                    name="currentPassword"
                    label="Current Password"
                    placeholder="Enter your current password"
                    type="password"
                /></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <FormInputField
                    control={form.control}
                    name="newPassword"
                    label="New Password"
                    placeholder="Enter your new password"
                    type="password"
                />
                <FormInputField
                    control={form.control}
                    name="confirmPassword"
                    label="Confirm New Password"
                    placeholder="Confirm your new password"
                    type="password"
                />
            </div>

            {showOtpField && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    <FormInputField
                        control={form.control}
                        name="otp"
                        label="Enter OTP"
                        placeholder="Enter OTP sent to your Email ID"
                    />
                </div>
            )}

            {error && (
                <div className="text-red-500 text-sm font-medium">
                    {getErrorMessage(error)}
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-start">
                <Button type="button" variant="outline" onClick={onCancel} className="rounded-full px-6 py-2.5 h-auto min-w-[120px]" disabled={isChanging}>
                    Cancel
                </Button>
                <Button type="submit" className="rounded-full px-6 py-2.5 h-auto min-w-[120px]" disabled={isChanging}>
                    {isChanging ? "Changing..." : "Change Password"}
                </Button>
            </div>
        </form>
    );
}
