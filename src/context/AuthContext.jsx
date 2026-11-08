import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('cosmetics_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('cosmetics_token') || null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  // Load user profile on mount if token exists
  useEffect(() => {
    const verifySession = async () => {
      if (token) {
        try {
          const res = await authService.getMe();
          if (res.data?.user) {
            setUser(res.data.user);
            localStorage.setItem('cosmetics_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.warn('Session expired or invalid token');
          logout(false);
        }
      }
      setLoading(false);
    };

    verifySession();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await authService.login({ email, password });
      const { user: loggedInUser, token: authToken } = res.data;
      setUser(loggedInUser);
      setToken(authToken);
      localStorage.setItem('cosmetics_user', JSON.stringify(loggedInUser));
      localStorage.setItem('cosmetics_token', authToken);
      showToast(`Welcome back, ${loggedInUser.name}!`, 'success');
      return loggedInUser;
    } catch (err) {
      showToast(err.message || 'Login failed. Please verify your credentials.', 'error');
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      const res = await authService.register(userData);
      const { user: registeredUser, token: authToken } = res.data;
      setUser(registeredUser);
      setToken(authToken);
      localStorage.setItem('cosmetics_user', JSON.stringify(registeredUser));
      localStorage.setItem('cosmetics_token', authToken);
      showToast(`Account created successfully! Welcome, ${registeredUser.name}.`, 'success');
      return registeredUser;
    } catch (err) {
      showToast(err.message || 'Registration failed.', 'error');
      throw err;
    }
  };

  const logout = (notify = true) => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('cosmetics_user');
    localStorage.removeItem('cosmetics_token');
    if (notify) {
      showToast('You have been logged out successfully.', 'info');
    }
  };

  const updateProfile = async (updateData) => {
    try {
      const res = await authService.updateMe(updateData);
      const updatedUser = res.data.user;
      setUser(updatedUser);
      localStorage.setItem('cosmetics_user', JSON.stringify(updatedUser));
      showToast('Profile updated successfully!', 'success');
      return updatedUser;
    } catch (err) {
      showToast(err.message || 'Failed to update profile.', 'error');
      throw err;
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user && !!token,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
