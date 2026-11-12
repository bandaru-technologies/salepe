import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { AuthApi } from '../api/client';

interface AuthContextValue {
  isAuthenticated: boolean;
  phoneNumber: string | null;
  token: string | null;
  login: (phoneNumber: string, token: string) => void;
  logout: () => void;
}

const PHONE_KEY = 'salepe_auth_phone';
const TOKEN_KEY = 'salepe_auth_token';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedPhone = localStorage.getItem(PHONE_KEY);
    const storedToken = localStorage.getItem(TOKEN_KEY);
    if (storedPhone && storedToken) {
      setPhoneNumber(storedPhone);
      setToken(storedToken);
    }
  }, []);

  const login = (phone: string, sessionToken: string) => {
    localStorage.setItem(PHONE_KEY, phone);
    localStorage.setItem(TOKEN_KEY, sessionToken);
    setPhoneNumber(phone);
    setToken(sessionToken);
  };

  const logout = () => {
    if (token) {
      // Best-effort server-side invalidation; ignore failures so the user
      // can still log out locally even if the auth service is unreachable.
      AuthApi.logout(token).catch(() => undefined);
    }
    localStorage.removeItem(PHONE_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setPhoneNumber(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated: token !== null, phoneNumber, token, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
