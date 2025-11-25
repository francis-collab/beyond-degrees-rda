// src/components/AuthProvider.tsx
'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import api from '@/lib/api';
import Cookies from 'js-cookie';
import { User } from '@/lib/types';

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'entrepreneur' | 'admin'; // ← backer removed, admin added
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = Cookies.get('access_token');
      if (token) {
        try {
          api.defaults.headers.Authorization = `Bearer ${token}`;
          const res = await api.get('/api/v1/auth/me');
          setUser(res.data);
        } catch {
          Cookies.remove('access_token');
          delete api.defaults.headers.Authorization;
        }
      }
      setIsLoading(false);
    };
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post('/api/v1/auth/login', { email, password });
    const { access_token, user } = res.data;
    Cookies.set('access_token', access_token, { expires: 7 });
    api.defaults.headers.Authorization = `Bearer ${access_token}`;
    setUser(user);
  };

  const register = async (data: RegisterData) => {
    await api.post('/api/v1/auth/register', data);
  };

  const logout = () => {
    Cookies.remove('access_token');
    delete api.defaults.headers.Authorization;
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
