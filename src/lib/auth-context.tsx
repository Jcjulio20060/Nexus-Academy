'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { apiFetch } from '@/lib/api';
import type { Aluno, Professor, User } from '@/lib/types';

interface AuthContextValue {
  user: User | null;
  aluno: Aluno | null;
  professor: Professor | null;
  loading: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [aluno, setAluno] = useState<Aluno | null>(null);
  const [professor, setProfessor] = useState<Professor | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const data = await apiFetch<{
        user: User;
        aluno: Aluno | null;
        professor: Professor | null;
      }>('/api/auth/me');
      setUser(data.user);
      setAluno(data.aluno);
      setProfessor(data.professor);
    } catch {
      setUser(null);
      setAluno(null);
      setProfessor(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await apiFetch<{
          user: User;
          aluno: Aluno | null;
          professor: Professor | null;
        }>('/api/auth/me');
        if (cancelled) return;
        setUser(data.user);
        setAluno(data.aluno);
        setProfessor(data.professor);
      } catch {
        if (cancelled) return;
        setUser(null);
        setAluno(null);
        setProfessor(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout');
    } catch {
      // ignore network errors
    }
    setUser(null);
    setAluno(null);
    setProfessor(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, aluno, professor, loading, refresh, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
