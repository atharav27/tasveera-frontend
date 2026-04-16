"use client";

import React from "react";
import type { ComponentType, ElementType } from "react";

interface ImageProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    fill?: boolean;
    className?: string;
    priority?: boolean;
}

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle: string;
    /** Logo source path - defaults to /logo.png */
    logoSrc?: string;
    /** Background image URL */
    backgroundImageUrl?: string;
    /** Testimonial quote text */
    testimonialQuote?: string;
    /** Testimonial author name */
    testimonialAuthor?: string;
    /** Image component (Next.js Image or standard img) */
    ImageComponent?: ComponentType<ImageProps> | ElementType;
}

export function AuthLayout({
    children,
    title,
    subtitle,
    logoSrc = "/logo.png",
    backgroundImageUrl = "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=2940&auto=format&fit=crop",
    testimonialQuote = "Corpora has completely transformed how we manage our corporate travel. The transparency and efficiency are unmatched.",
    testimonialAuthor = "Sofia Davis, Head of Operations",
    ImageComponent = "img",
}: AuthLayoutProps) {
    const ImgComponent = ImageComponent as ComponentType<ImageProps>;

    return (
        <div className="w-full min-h-screen grid lg:grid-cols-2">
            <div className="flex items-center justify-center p-8 lg:p-12">
                <div className="mx-auto w-full max-w-[450px] space-y-6">
                    <div className="flex flex-col space-y-2 text-center">
                        <ImgComponent
                            src={logoSrc}
                            alt="Logo"
                            width={180}
                            height={180}
                            className="mx-auto pb-8"
                        />
                        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                        <p className="text-muted-foreground">{subtitle}</p>
                    </div>
                    {children}
                </div>
            </div>
            <div className="hidden bg-muted lg:block relative overflow-hidden">
                <ImgComponent
                    src={backgroundImageUrl}
                    alt="Office background"
                    fill
                    className="object-cover dark:brightness-[0.4] grayscale"
                    priority
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute bottom-10 left-10 text-white z-10 max-w-lg">
                    <blockquote className="space-y-2">
                        <p className="text-lg">
                            &ldquo;{testimonialQuote}&rdquo;
                        </p>
                        <footer className="text-sm opacity-80">{testimonialAuthor}</footer>
                    </blockquote>
                </div>
            </div>
        </div>
    );
}
