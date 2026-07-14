import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api, { setAuthToken } from '../api/axios';

const AuthContext = createContext(null);

const getStoredAuth = () => {
  if (typeof window === 'undefined') {
    return { token: null, user: null };
  }

  try {
    const token = window.localStorage.getItem('wf-auth-token');
    const user = window.localStorage.getItem('wf-auth-user');

    return {
      token,
      user: user ? JSON.parse(user) : null,
    };
  } catch {
    return { token: null, user: null };
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredAuth().user);
  const [token, setToken] = useState(() => getStoredAuth().token);
  const [loading, setLoading] = useState(true);

  const persistAuth = (nextUser, nextToken) => {
    setUser(nextUser);
    setToken(nextToken);
    window.localStorage.setItem('wf-auth-user', JSON.stringify(nextUser));
    if (nextToken) {
      window.localStorage.setItem('wf-auth-token', nextToken);
    } else {
      window.localStorage.removeItem('wf-auth-token');
    }
  };

  useEffect(() => {
    const verifySession = async () => {
      const storedAuth = getStoredAuth();

      if (!storedAuth.token) {
        setLoading(false);
        return;
      }

      try {
        setAuthToken(storedAuth.token);
        const response = await api.get('/api/auth/me');

        persistAuth(response.data.user, storedAuth.token);
      } catch {
        persistAuth(null, null);
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/api/auth/login', {
      email,
      password,
    });

    const nextUser = response.data.user;
    const nextToken = response.data.token;

    setAuthToken(nextToken);
    persistAuth(nextUser, nextToken);

    return response.data;
  };

  const logout = async () => {
    try {
      if (token) {
        await api.post('/api/auth/logout');
      }
    } catch {
      // Ignore logout errors and clear local session state.
    } finally {
      setAuthToken(null);
      persistAuth(null, null);
    }
  };

  const refreshUser = async () => {
    const response = await api.get('/api/auth/me');
    persistAuth(response.data.user, token);
    return response.data.user;
  };

  const updateProfile = async (payload) => {
    const response = await api.put('/api/auth/profile', payload, { _skipToast: true });
    persistAuth(response.data.user, token);
    return response.data;
  };

  const changePassword = async (payload) => {
    const response = await api.put('/api/auth/change-password', payload, { _skipToast: true });
    return response.data;
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(token),
      isAdmin: user?.role === 'admin',
      login,
      logout,
      refreshUser,
      updateProfile,
      changePassword,
    }),
    [loading, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}