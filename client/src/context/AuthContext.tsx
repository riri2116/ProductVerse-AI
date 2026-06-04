import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  role: 'USER' | 'ADMIN';
  plan: 'FREE' | 'PRO' | 'ENTERPRISE';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, checkPass: string) => Promise<void>;
  register: (name: string, email: string, checkPass: string) => Promise<void>;
  googleLogin: (credential: string) => Promise<void>;
  logout: () => void;
  updateUserPlan: (plan: User['plan']) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage
    const savedToken = localStorage.getItem('pv_token');
    const savedUser = localStorage.getItem('pv_user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, checkPass: string) => {
    try {
      const res = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: checkPass })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed.');

      localStorage.setItem('pv_token', data.token);
      localStorage.setItem('pv_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const register = async (name: string, email: string, checkPass: string) => {
    try {
      const res = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password: checkPass })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed.');

      localStorage.setItem('pv_token', data.token);
      localStorage.setItem('pv_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const googleLogin = async (credential: string) => {
    try {
      const res = await fetch('http://localhost:3001/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Google login failed.');

      localStorage.setItem('pv_token', data.token);
      localStorage.setItem('pv_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const logout = () => {
    localStorage.removeItem('pv_token');
    localStorage.removeItem('pv_user');
    setToken(null);
    setUser(null);
  };

  const updateUserPlan = (plan: User['plan']) => {
    if (user) {
      const updated = { ...user, plan };
      localStorage.setItem('pv_user', JSON.stringify(updated));
      setUser(updated);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, loading, login, register, googleLogin, logout, updateUserPlan }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside an AuthProvider');
  return context;
};
