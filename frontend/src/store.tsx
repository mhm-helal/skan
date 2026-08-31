import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import api from './api';
import type { User } from './types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await api.get('/api/auth/me');
      setUser(res.data);
    } catch {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (email: string, password: string) => {
    const res = await api.post('/api/auth/login', { email, password });
    const t = res.data.access_token || res.data.token;
    localStorage.setItem('token', t);
    setToken(t);
    const meRes = await api.get('/api/auth/me');
    setUser(meRes.data);
  };

  const register = async (name: string, email: string, password: string, phone?: string) => {
    const res = await api.post('/api/auth/register', { name, email, password, phone });
    const userRes = res.data;
    const loginRes = await api.post('/api/auth/login', { email, password });
    const t = loginRes.data.access_token || loginRes.data.token;
    localStorage.setItem('token', t);
    setToken(t);
    setUser(userRes);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
