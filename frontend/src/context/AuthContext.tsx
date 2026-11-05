import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { api, getToken } from '../api';

export interface UserInfo { id: number; name: string; email: string; cpf: string; }
interface AuthValue { user: UserInfo | null; loading: boolean; signIn(token: string, user: UserInfo): void; signOut(): void; setUser(u: UserInfo): void; }
const AuthContext = createContext<AuthValue | null>(null);

function store(token: string | null): void {
  try { if (token) localStorage.setItem('token', token); else localStorage.removeItem('token'); } catch { /* storage indisponível */ }
}
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(!!getToken());
  useEffect(() => {
    if (!getToken()) return;
    api<UserInfo>('/users/me').then(setUser).catch(() => store(null)).finally(() => setLoading(false));
  }, []);
  const signIn = useCallback((token: string, u: UserInfo) => { store(token); setUser(u); }, []);
  const signOut = useCallback(() => { store(null); setUser(null); }, []);
  return <AuthContext.Provider value={{ user, loading, signIn, signOut, setUser }}>{children}</AuthContext.Provider>;
}
export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth precisa estar dentro de AuthProvider');
  return ctx;
}
