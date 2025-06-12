// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { refreshAccessToken } from '../api/auth';

const AuthContext = createContext({
  user: null, // 초기 상태는 null 또는 sessionStorage에서 로드
  login: (tokens) => {},
  logout: () => {},
  isLoading: true, // 초기 로딩 상태 추가 (선택적)
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태

  // 컴포넌트 마운트 시 세션 스토리지에서 토큰 확인 및 사용자 정보 설정
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true); // 로딩 시작
      const accessToken = sessionStorage.getItem('accessToken');
      if (accessToken) {
        try {
          const decodedToken = jwtDecode(accessToken);
          if (decodedToken.exp * 1000 > Date.now()) {
            // 토큰이 유효하면 사용자 정보 설정
            setUser({ user_id: decodedToken.user_id }); // 토큰에서 user_id 추출
          } else {
            // Access 토큰 만료, 리프레시 시도
            try {
              const newAccess = await refreshAccessToken(); // refreshAccessToken은 sessionStorage 사용하도록 수정 필요
              const { user_id: newUserId } = jwtDecode(newAccess);
              setUser({ user_id: newUserId });
            } catch (refreshError) {
              console.warn("Failed to refresh token on init:", refreshError);
              sessionStorage.removeItem('accessToken');
              sessionStorage.removeItem('refreshToken');
              sessionStorage.removeItem('user'); // 사용자 정보도 제거
              setUser(null);
            }
          }
        } catch (error) {
          console.error("Error decoding token on init:", error);
          sessionStorage.removeItem('accessToken');
          sessionStorage.removeItem('refreshToken');
          sessionStorage.removeItem('user'); // 사용자 정보도 제거
          setUser(null);
        }
      }
      setIsLoading(false);
    };
    initializeAuth();
  }, []);


  const login = useCallback(({ access, refresh }) => {
    sessionStorage.setItem('accessToken', access);
    sessionStorage.setItem('refreshToken', refresh);
    try {
      const decodedToken = jwtDecode(access);
      const userData = { user_id: decodedToken.user_id }; // 토큰에서 user_id 추출
      setUser(userData);
      sessionStorage.setItem('user', JSON.stringify(userData)); // 사용자 정보도 sessionStorage에 저장
    } catch (error) {
        console.error("Error decoding token on login:", error);
        // 로그인 실패 처리 (예: setUser(null), 토큰 제거 등)
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('refreshToken');
        sessionStorage.removeItem('user');
        setUser(null);
    }
  }, []);

  const logout = useCallback(() => {
    // api.post('/auth/logout'); // 실제 백엔드 로그아웃 API 호출 (선택적)
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('user'); // 로그아웃 시 사용자 정보 제거
    setUser(null);
  }, []);

  // Access 토큰 자동 갱신 로직 (기존 로직 유지하되, sessionStorage 사용)
  useEffect(() => {
    let refreshTimeoutId;

    const scheduleRefresh = async () => {
      const accessToken = sessionStorage.getItem('accessToken');
      const refreshToken = sessionStorage.getItem('refreshToken'); // 리프레시 토큰도 확인

      if (!accessToken || !refreshToken) {
        if (user) logout(); // 토큰이 없는데 사용자 정보가 있으면 로그아웃
        return;
      }

      try {
        const { exp } = jwtDecode(accessToken);
        const currentTime = Date.now() / 1000;
        const expiresIn = exp - currentTime; // 초 단위 만료까지 남은 시간

        // 만료 1분 전에 갱신 시도
        const timeoutDuration = (expiresIn - 60) * 1000;

        if (timeoutDuration > 0) {
          console.log(`Token refresh scheduled in ${timeoutDuration / 1000} seconds.`);
          refreshTimeoutId = setTimeout(async () => {
            try {
              const newAccess = await refreshAccessToken(); // 이 함수는 내부적으로 sessionStorage 사용
              const { user_id: newUserId } = jwtDecode(newAccess);
              setUser({ user_id: newUserId }); // 사용자 정보 업데이트
              scheduleRefresh(); // 다음 갱신 스케줄링
            } catch (refreshError) {
              console.error('Failed to refresh token, logging out:', refreshError);
              logout();
            }
          }, timeoutDuration);
        } else if (expiresIn <= 0) { // 이미 만료되었지만 아직 로그아웃 안된 경우
            console.warn('Access token already expired, attempting refresh.');
            try {
                const newAccess = await refreshAccessToken();
                const { user_id: newUserId } = jwtDecode(newAccess);
                setUser({ user_id: newUserId });
                scheduleRefresh();
            } catch (refreshErrorOnExpiry) {
                console.error('Failed to refresh expired token, logging out:', refreshErrorOnExpiry);
                logout();
            }
        }
      } catch (decodeError) {
        console.error('Error decoding token for scheduling refresh, logging out:', decodeError);
        logout();
      }
    };

    if (user) { // 사용자가 로그인 상태일 때만 토큰 갱신 스케줄링
        scheduleRefresh();
    } else { // 사용자가 로그아웃 상태면, 스케줄된 갱신 취소
        clearTimeout(refreshTimeoutId);
    }

    return () => clearTimeout(refreshTimeoutId); // 컴포넌트 언마운트 시 타임아웃 클리어
  }, [user, logout]); // user 상태 변경 시 재실행하여 스케줄링 업데이트

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}