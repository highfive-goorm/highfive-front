import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserInfo } from '../lib/api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const account = localStorage.getItem('account');
    if (token && account) {
      getUserInfo(account)
        .then((userData) => {
          setUser(userData);
        })
        .catch(() => {
          logout();
        });
    }
  }, []); // 최초 1회 실행

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
