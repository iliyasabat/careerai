import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('careeros_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser = { id: '1', name: 'Arjun Sharma', email: email, avatar: 'AS' };
        localStorage.setItem('careeros_user', JSON.stringify(mockUser));
        setUser(mockUser);
        resolve(mockUser);
      }, 1000);
    });
  };

  const logout = () => {
    localStorage.removeItem('careeros_user');
    setUser(null);
    window.location.href = '/auth';
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
