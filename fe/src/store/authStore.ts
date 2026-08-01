import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: number;
  email: string;
  roles: string[];
}

interface AuthState {
  token: string | null;
  user: User | null;
  setToken: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      setToken: (token: string) => {
        try {
          const decoded: any = jwtDecode(token);
          set({
            token,
            user: {
              id: decoded.userId || decoded.sub, // adjust based on your JWT payload
              email: decoded.email || decoded.sub,
              roles: decoded.roles || [],
            },
            isAuthenticated: true,
          });
          localStorage.setItem('access_token', token);
        } catch (e) {
          console.error("Invalid token", e);
        }
      },
      logout: () => {
        set({ token: null, user: null, isAuthenticated: false });
        localStorage.removeItem('access_token');
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
