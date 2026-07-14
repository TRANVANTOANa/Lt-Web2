import { createContext, useContext, useMemo, useState } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

// Read user from localStorage synchronously to avoid redirect-on-refresh
function getInitialUser() {
  try {
    const saved = localStorage.getItem('spa_user');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getInitialUser);

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
    if (result?.token) localStorage.setItem('spa_token', result.token);
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
