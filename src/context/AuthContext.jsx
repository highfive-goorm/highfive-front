// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { getSessionId, clearSession as clearSessionStorage } from '../utils/session';
import { refreshAccessToken } from '../api/auth';

const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const access = localStorage.getItem('accessToken');
    if (!access) return null;
    try {
      const { user_id, exp } = jwtDecode(access);
      // 토큰 만료 확인
      if (Date.now() / 1000 > exp) return null;
      return { user_id };
    } catch {
      return null;
    }
  });
  
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
      const { exp } = jwtDecode(access);
      if (Date.now() / 1000 > exp) {
        logout();
      }
    } catch {
      logout();
    }
  }, []);

  useEffect(() => {
    const scheduleRefresh = () => {
      const access = localStorage.getItem('accessToken');
      if (!access) return;
      const { exp } = jwtDecode(access);
      // exp: seconds 단위 UNIX timestamp
      const timeout = exp * 1000 - Date.now() - 60 * 1000; 
      if (timeout > 0) {
        setTimeout(async () => {
          try {
            const newAccess = await refreshAccessToken();
            const { user_id } = jwtDecode(newAccess);
            setUser({ user_id });
            scheduleRefresh();  // 다음 갱신도 스케줄링
          } catch {
            logout();  // 갱신 실패 시 로그아웃
          }
        }, timeout);
      }
    };
  
    scheduleRefresh();
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