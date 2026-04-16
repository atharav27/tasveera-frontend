import { createAuthClient } from "better-auth/react";

export interface AuthClientConfig {
  baseURL: string;
}

export function createCorporaAuthClient(config: AuthClientConfig) {
  const authClient = createAuthClient({
    baseURL: config.baseURL,
  });

  return {
    authClient,
    signIn: authClient.signIn,
    signOut: authClient.signOut,
    signUp: authClient.signUp,
    useSession: authClient.useSession,
    requestPasswordReset: authClient.requestPasswordReset,
    resetPassword: authClient.resetPassword,
  };
}


// Default auth client for shared utils usage
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3004",
});

export const {
  signIn,
  signOut,
  signUp,
  useSession,
  requestPasswordReset,
  resetPassword
} = authClient;

export type { createAuthClient };
