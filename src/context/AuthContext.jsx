// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { getSessionId, clearSession as clearSessionStorage } from '../utils/session';

const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = ({ access, refresh }) => {
    // 1) 토큰 저장
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
    // 2) 세션 발급
    getSessionId();
    // 3) payload에서 user_id 추출
    const { user_id } = jwtDecode(access);
    setUser({ user_id });
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    clearSessionStorage();
    setUser(null);
    window.location.replace('/');
  };

  // 새로고침 후에도 토큰이 유효하면 자동 로그인
  useEffect(() => {
    const access = localStorage.getItem('accessToken');
    if (!access) return;
    try {
      const { user_id, exp } = jwtDecode(access);
      if (Date.now() / 1000 > exp) {
        return logout();
      }
      setUser({ user_id });
    } catch {
      logout();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}