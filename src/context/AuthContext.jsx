// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
// getSessionId, clearSessionStorage는 SessionContext에서 관리하므로 여기서 직접 호출할 필요는 없어 보입니다.
// import { getSessionId, clearSession as clearSessionStorage } from '../utils/session';
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
      const accessToken = sessionStorage.getItem('accessToken');
      if (accessToken) {
        try {
          const decodedToken = jwtDecode(accessToken);
          if (decodedToken.exp * 1000 > Date.now()) {
            setUser({ user_id: decodedToken.user_id }); // 또는 필요한 다른 정보
          } else {
            // Access 토큰이 만료되었지만, Refresh 토큰이 있을 수 있음
            // 애플리케이션 시작 시 자동 리프레시 시도 (선택적)
            try {
              const newAccess = await refreshAccessToken(); // refreshAccessToken은 sessionStorage 사용하도록 수정 필요
              const { user_id: newUserId } = jwtDecode(newAccess);
              setUser({ user_id: newUserId });
            } catch (refreshError) {
              console.warn("Failed to refresh token on init:", refreshError);
              sessionStorage.removeItem('accessToken');
              sessionStorage.removeItem('refreshToken');
              setUser(null);
            }
          }
        } catch (error) {
          console.error("Error decoding token on init:", error);
          sessionStorage.removeItem('accessToken');
          sessionStorage.removeItem('refreshToken');
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
      const { user_id } = jwtDecode(access); // 또는 필요한 다른 사용자 정보
      setUser({ user_id });
      // getSessionId(); // 이 부분은 SessionContext에서 자동으로 처리될 것이므로 여기서 호출 불필요
    } catch (error) {
        console.error("Error decoding token on login:", error);
        // 로그인 실패 처리 (예: setUser(null), 토큰 제거 등)
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('refreshToken');
        setUser(null);
    }
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    // clearSessionStorage(); // SessionContext의 clearSession이 호출되도록 유도하거나, 여기서 직접 호출
    setUser(null);
    // window.location.replace('/'); // 페이지 강제 이동보다는 라우터의 navigate 사용 권장
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
            console.warn('Access token already expired, attempting refresh or logout.');
            try {
                const newAccess = await refreshAccessToken();
                const { user_id: newUserId } = jwtDecode(newAccess);
                setUser({ user_id: newUserId });
                scheduleRefresh();
            } catch (e) {
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