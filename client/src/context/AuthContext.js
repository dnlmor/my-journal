import React, { createContext, useState, useEffect, useContext } from 'react';
import { getCurrentUser, login as authLogin, logout as authLogout, signup as authSignup } from '../services/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    setUser(user);
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await authLogin(email, password);
    setUser(getCurrentUser());
    return response;
  };

  const signup = async (username, email, password) => {
    const response = await authSignup(username, email, password);
    setUser(getCurrentUser());
    return response;
  };

  const logout = () => {
    authLogout();
    setUser(null);
  };

  const value = {
    user,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  };

  if (loading) {
    return <div>Loading...</div>; // Or your custom loading component
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
