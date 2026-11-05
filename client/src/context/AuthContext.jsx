import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('hackmate_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('hackmate_token'));
  const [loading, setLoading] = useState(true);

  // Sync user profile on mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const storedToken = localStorage.getItem('hackmate_token');
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get('/auth/me');
        if (data.success && data.user) {
          setUser(data.user);
          localStorage.setItem('hackmate_user', JSON.stringify(data.user));
        }
      } catch (err) {
        console.error('Failed to load authenticated user profile:', err);
        logout(false);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      if (data.success) {
        localStorage.setItem('hackmate_token', data.token);
        localStorage.setItem('hackmate_user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        toast.success(`Welcome back, ${data.user.name}!`);
        return { success: true, user: data.user };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to sign in. Please verify credentials.';
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  const register = async (formData) => {
    try {
      const { data } = await api.post('/auth/register', formData);
      if (data.success) {
        localStorage.setItem('hackmate_token', data.token);
        localStorage.setItem('hackmate_user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        toast.success('Account created! Welcome to HackMate.');
        return { success: true, user: data.user };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please check your inputs.';
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  const logout = (showToast = true) => {
    localStorage.removeItem('hackmate_token');
    localStorage.removeItem('hackmate_user');
    setToken(null);
    setUser(null);
    if (showToast) {
      toast.success('Signed out successfully.');
    }
  };

  const updateUser = (updatedData) => {
    setUser((prev) => {
      const merged = { ...prev, ...updatedData };
      localStorage.setItem('hackmate_user', JSON.stringify(merged));
      return merged;
    });
  };

  const refreshUser = async () => {
    try {
      const { data } = await api.get('/auth/me');
      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem('hackmate_user', JSON.stringify(data.user));
        return data;
      }
    } catch (err) {
      console.error('Error refreshing user stats:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        login,
        register,
        logout,
        updateUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
