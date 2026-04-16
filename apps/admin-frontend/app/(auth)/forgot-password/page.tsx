"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Mail } from "lucide-react";

import Image from "next/image";
import { Button } from "@corpora/ui";
import { Input } from "@corpora/ui";
import { Label } from "@corpora/ui";
import { AuthLayout } from "@corpora/ui";
import { requestPasswordReset, useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const { data: session, isPending } = useSession();
    const [email, setEmail] = useState("");
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
        setIsLoading(true);
        setError(null);

        await requestPasswordReset({
            email,
            redirectTo: "/reset-password",
            fetchOptions: {
                onResponse: () => setIsLoading(false),
                onRequest: () => setIsLoading(true),
                onError: (ctx) => setError(ctx.error.message),
                onSuccess: () => setIsSuccess(true),
            },
        });
    };

    if (isSuccess) {
        return (
            <AuthLayout
                title="Check your email"
                subtitle="We've sent you a password reset link"
                ImageComponent={Image}
            >
                <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="p-4 rounded-full bg-green-50 text-green-600">
                        <Mail className="w-8 h-8" />
                    </div>
                    <p className="text-center text-muted-foreground">
                        We have sent a password reset link to <span className="font-medium text-foreground">{email}</span>.
                        Please check your email and click the link to reset your password.
                    </p>
                    <Button asChild variant="outline" className="w-full mt-4">
                        <Link href="/login">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to login
                        </Link>
                    </Button>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            title="Forgot password?"
            subtitle="No worries, we'll send you reset instructions"
            ImageComponent={Image}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
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
                            Sending link...
                        </>
                    ) : (
                        "Send reset link"
                    )}
                </Button>

                <Button asChild variant="link" className="w-full" disabled={isLoading}>
                    <Link href="/login">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to login
                    </Link>
                </Button>
            </form>
        </AuthLayout>
    );
}
