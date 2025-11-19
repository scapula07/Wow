import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  onboarded: boolean;
  [key: string]: any;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (user: User) => void;
  logout: () => void;
  clearError: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // State
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      setUser: (user) => 
        set({ 
          user, 
          isAuthenticated: !!user 
        }),

      setLoading: (isLoading) => 
        set({ isLoading }),

      setError: (error) => 
        set({ error }),

      login: (user) => 
        set({ 
          user, 
          isAuthenticated: true, 
          error: null 
        }),

      logout: () => 
        set({ 
          user: null, 
          isAuthenticated: false, 
          error: null 
        }),

      clearError: () => 
        set({ error: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);
