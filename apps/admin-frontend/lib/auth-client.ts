"use client";

/**
 * Frontend-only mock auth: any email/password signs in. Session is stored in sessionStorage.
 */

import * as React from "react";

import type { UserRole } from "@/config/navigation";

const STORAGE_KEY = "corpora-admin-mock-session";
const AUTH_EVENT = "corpora-admin-mock-auth";

export type MockUser = {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image?: string | null;
    corporateId?: string;
    /** When set, drives sidebar visibility (e.g. Admin Users for `super-admin`). */
    role?: UserRole;
};

export type MockSession = {
    user: MockUser;
    session: { id: string };
};

function readSession(): MockSession | null {
    if (typeof window === "undefined") return null;
    try {
        const raw = sessionStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        return JSON.parse(raw) as MockSession;
    } catch {
        return null;
    }
}

function writeSession(data: MockSession | null) {
    if (typeof window === "undefined") return;
    if (data) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    else sessionStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event(AUTH_EVENT));
}

type FetchOpts = {
    onRequest?: () => void;
    onResponse?: () => void;
    onSuccess?: () => void | Promise<void>;
    onError?: (ctx: { error: { message: string } }) => void;
};

async function withFetchOptions(fetchOptions: FetchOpts | undefined, run: () => Promise<void>) {
    fetchOptions?.onRequest?.();
    try {
        await run();
        await fetchOptions?.onSuccess?.();
    } catch (e) {
        fetchOptions?.onError?.({ error: { message: e instanceof Error ? e.message : "Something went wrong" } });
    } finally {
        fetchOptions?.onResponse?.();
    }
}

export function useSession() {
    const [isPending, setIsPending] = React.useState(true);
    const [data, setData] = React.useState<MockSession | null>(null);

    React.useEffect(() => {
        setData(readSession());
        setIsPending(false);
        const sync = () => setData(readSession());
        window.addEventListener(AUTH_EVENT, sync);
        return () => window.removeEventListener(AUTH_EVENT, sync);
    }, []);

    return { data, isPending };
}

export const signIn = {
    email: async ({
        email,
        password: _password,
        fetchOptions,
    }: {
        email: string;
        password: string;
        fetchOptions?: FetchOpts;
    }) => {
        await withFetchOptions(fetchOptions, async () => {
            await new Promise((r) => setTimeout(r, 150));
            const safeEmail = email?.trim() || "demo@example.com";
            const role: UserRole = /\bsuper\b/i.test(safeEmail) ? "super-admin" : "corporate-admin";
            const user: MockUser = {
                id: "mock-user",
                name: safeEmail.split("@")[0] || "User",
                email: safeEmail,
                emailVerified: true,
                corporateId: "demo-corporate",
                role,
            };
            writeSession({ user, session: { id: "mock-session" } });
        });
    },
};

export const signUp = signIn;

export const signOut = async (opts?: { fetchOptions?: { onSuccess?: () => void } }) => {
    writeSession(null);
    await opts?.fetchOptions?.onSuccess?.();
};

export const requestPasswordReset = async ({
    email: _email,
    redirectTo: _redirectTo,
    fetchOptions,
}: {
    email: string;
    redirectTo?: string;
    fetchOptions?: FetchOpts;
}) => {
    await withFetchOptions(fetchOptions, async () => {
        await new Promise((r) => setTimeout(r, 200));
    });
};

export const resetPassword = async ({
    newPassword: _newPassword,
    token: _token,
    fetchOptions,
}: {
    newPassword: string;
    token?: string;
    fetchOptions?: FetchOpts;
}) => {
    await withFetchOptions(fetchOptions, async () => {
        await new Promise((r) => setTimeout(r, 200));
    });
};

export const authClient = {
    signIn,
    signOut,
    signUp,
    useSession,
    requestPasswordReset,
    resetPassword,
};
