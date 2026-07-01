import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('spa_user');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const login = async ({ username, password }) => {
    const result = await authApi.login({ username, password });
    const nextUser = result?.user || result;
    localStorage.setItem('spa_user', JSON.stringify(nextUser));
    if (result?.token) localStorage.setItem('spa_token', result.token);
    setUser(nextUser);
    return nextUser;
  };

  const register = async (payload) => {
    const result = await authApi.register({ ...payload, status: 'ACTIVE' });
    const nextUser = result?.user || result;
    localStorage.setItem('spa_user', JSON.stringify(nextUser));
    setUser(nextUser);
    return nextUser;
  };

  const updateLocalUser = (nextUser) => {
    localStorage.setItem('spa_user', JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const logout = () => {
    localStorage.removeItem('spa_user');
    localStorage.removeItem('spa_token');
    setUser(null);
  };

  const value = useMemo(() => ({ user, login, register, logout, updateLocalUser }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
