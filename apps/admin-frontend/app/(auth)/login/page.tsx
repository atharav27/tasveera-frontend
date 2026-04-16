"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { ArrowRight, Loader2 } from "lucide-react";

import Image from "next/image";
import { Button } from "@corpora/ui";
import { Label } from "@corpora/ui";
import { AuthLayout } from "@corpora/ui";
import { signIn, useSession } from "@/lib/auth-client";
import { FormInputField } from "@corpora/ui";

interface LoginFormData {
    email: string;
    password: string;
}

export default function LoginPage() {
    const router = useRouter();
    const { data: session, isPending } = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { control, handleSubmit } = useForm<LoginFormData>({
        defaultValues: {
            email: "",
            password: "",
        },
    });

    // Redirect if already logged in
    if (session) {
        router.push("/");
        return null;
    }

    if (isPending) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true);
        setError(null);

        await signIn.email({
            email: data.email,
            password: data.password,
            fetchOptions: {
                onResponse: () => {
                    setIsLoading(false);
                },
                onRequest: () => {
                    setIsLoading(true);
                },
                onError: (ctx) => {
                    setError(ctx.error.message);
                },
                onSuccess: async () => {
                    router.push("/");
                }
            }
        });
    };

    return (
        <AuthLayout
            title="Welcome back"
            subtitle="Enter your email to sign in to your account"
            ImageComponent={Image}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <FormInputField
                    control={control}
                    name="email"
                    label="Email"
                    type="email"
                    placeholder="name@example.com"
                    disabled={isLoading}
                />

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label className="text-xs md:text-sm text-slate-900 font-medium">
                            Password
                        </Label>
                        <Link
                            href="/forgot-password"
                            className="text-sm font-medium text-primary hover:underline underline-offset-4"
                        >
                            Forgot password?
                        </Link>
                    </div>
                    <FormInputField
                        control={control}
                        name="password"
                        label=""
                        type="password"
                        placeholder="Enter your password"
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
                            Signing in...
                        </>
                    ) : (
                        <>
                            Sign in
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                    )}
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                    Demo: include <span className="font-medium">super</span> in your email (e.g.{" "}
                    <span className="font-mono">super@admin.com</span>) for SUPER_ADMIN navigation such as Admin Users.
                </p>
            </form>

            {/* <div className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="font-semibold text-primary hover:underline underline-offset-4">
                    Sign up
                </Link>
            </div> */}
        </AuthLayout>
    );
}
