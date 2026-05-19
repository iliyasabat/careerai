import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser } from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('careeros_user');
    const storedToken = localStorage.getItem('careeros_token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const persistSession = (data) => {
    localStorage.setItem('careeros_token', data.token);
    localStorage.setItem('careeros_user', JSON.stringify(data.user));
    setUser(data.user);
  };

  const login = async (email, password) => {
    const data = await loginUser(email, password);
    if (data.error) {
      throw new Error(data.message || 'Login failed');
    }
    persistSession(data);
    return data.user;
  };

  const register = async (name, email, password) => {
    const data = await registerUser(name, email, password);
    if (data.error) {
      throw new Error(data.message || 'Registration failed');
    }
    persistSession(data);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('careeros_token');
    localStorage.removeItem('careeros_user');
    setUser(null);
    window.location.href = '/auth';
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
