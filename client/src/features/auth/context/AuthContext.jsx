import React, { createContext, useState, useEffect, useCallback } from 'react';
import api from '../../../shared/utils/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);

          // Verify token is still valid
          try {
            const response = await api.get('/auth/me');
            setUser(response.data.data);
            localStorage.setItem('user', JSON.stringify(response.data.data));
          } catch (err) {
            // Token invalid, clear storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Auth load error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = useCallback(async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const userData = response.data.data;

    localStorage.setItem('token', userData.token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);

    return userData;
  }, []);

  const googleLogin = useCallback(async (credential) => {
    const response = await api.post('/auth/google', { credential });
    const userData = response.data.data;

    localStorage.setItem('token', userData.token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);

    return userData;
  }, []);

  const register = useCallback(async (formData) => {
    const response = await api.post('/auth/register', formData);
    const userData = response.data.data;

    localStorage.setItem('token', userData.token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);

    return userData;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  const updateUser = useCallback((updatedData) => {
    setUser((prev) => {
      const newUser = { ...prev, ...updatedData };
      localStorage.setItem('user', JSON.stringify(newUser));
      return newUser;
    });
  }, []);

  const selectLevel = useCallback(async (level) => {
    const response = await api.put('/auth/select-level', { level });
    updateUser(response.data.data);
    return response.data.data;
  }, [updateUser]);

  const value = {
    user,
    loading,
    login,
    googleLogin,
    register,
    logout,
    updateUser,
    selectLevel,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};