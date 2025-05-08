// src/context/SessionContext.jsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import {
  getSessionId,
  refreshSession,
  clearSession as clearSessionStorage,
} from '../utils/session';

const SessionContext = createContext({
  session_id: null,
  clear: () => {},
});

export function SessionProvider({ children }) {
  const [session_id, setSessionId] = useState(() => getSessionId());

  // 사용자가 활동할 때마다 세션을 갱신
  const touch = useCallback(() => {
    const sid = refreshSession();
    setSessionId(sid);
  }, []);

  // 로그아웃 시 세션 제거
  const clear = useCallback(() => {
    clearSessionStorage();
    setSessionId(null);
  }, []);

  useEffect(() => {
    // 클릭/키 입력 이벤트가 있으면 만료 연장
    window.addEventListener('click', touch);
    window.addEventListener('keydown', touch);
    return () => {
      window.removeEventListener('click', touch);
      window.removeEventListener('keydown', touch);
    };
  }, [touch]);

  return (
    <SessionContext.Provider value={{ session_id, clear }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}
