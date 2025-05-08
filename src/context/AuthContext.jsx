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

  const login = ({ user_id }) => {
    getSessionId(); // 로그인 시점에 세션 발급
    setUser({ user_id });
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    clearSessionStorage();
    setUser(null);
    window.location.replace('/');
  };

  useEffect(() => {
    const access = localStorage.getItem('accessToken');
    if (!access) return;
    try {
      const { user_id, exp } = jwtDecode(access);

      // 만료 시 자동 로그아웃
      if (Date.now() / 1000 > exp) return logout();

      // user 객체는 { user_id } 형태로 통일
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
