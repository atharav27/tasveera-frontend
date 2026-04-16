"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2 } from "lucide-react";

import Image from "next/image";
import { Button } from "@corpora/ui";
import { Input } from "@corpora/ui";
import { Label } from "@corpora/ui";
import { AuthLayout } from "@corpora/ui";
import { resetPassword, useSession } from "@/lib/auth-client";

export default function ResetPasswordPage() {
    const router = useRouter();
    const { data: session, isPending } = useSession();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Redirect if already logged in
    if (session) {
        router.push("/");
        return null;
    }

    if (isPending) {
        return (
            <div className="flex items-center justify-center min-vh-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters");
            return;
        }

        setIsLoading(true);

        await resetPassword({
            newPassword: password,
            fetchOptions: {
                onResponse: () => setIsLoading(false),
                onRequest: () => setIsLoading(true),
                onError: (ctx) => setError(ctx.error.message),
                onSuccess: () => {
                    setIsSuccess(true);
                    setTimeout(() => {
                        router.push("/login");
                    }, 3000);
                },
            },
        });
    };

    if (isSuccess) {
        return (
            <AuthLayout
                title="Password reset"
                subtitle="Your password has been successfully reset"
                ImageComponent={Image}
            >
                <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="p-4 rounded-full bg-green-50 text-green-600">
                        <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <p className="text-center text-muted-foreground">
                        You can now log in with your new password. Redirecting you to login page...
                    </p>
                    <Button asChild className="w-full mt-4">
                        <Link href="/login">
                            Continue to Login
                        </Link>
                    </Button>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            title="Set new password"
            subtitle="Please enter your new password below"
            ImageComponent={Image}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                        minLength={8}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        disabled={isLoading}
                        minLength={8}
                    />
                </div>

                {error && (
                    <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
                        {error}
                    </div>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Resetting password...
                        </>
                    ) : (
                        "Reset password"
                    )}
                </Button>
            </form>
        </AuthLayout>
    );
}
