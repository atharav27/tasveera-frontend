import { create } from 'zustand';

interface AuthState {
    user: {
        name: string | null;
        email: string | null;
        image?: string | null;
        corporateId?: string | null;
    } | null;
    setUser: (user: { name: string | null; email: string | null; image?: string | null; corporateId?: string | null } | null) => void;
    clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    clearUser: () => set({ user: null }),
}));
