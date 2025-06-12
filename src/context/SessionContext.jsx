// src/context/SessionContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getSessionId, refreshSession, clearSession as clearSessionStorage } from '../utils/session';
import { getAnonymousId } from '../utils/trackingUtils'; // getAnonymousId 경로 변경

const SessionContext = createContext({
  session_id: null,
  anonymous_id: null, // 추가
  clearSession: () => {}, // 이름 변경 (함수와 혼동 방지)
});

export function SessionProvider({ children }) {
  const [session_id, setSessionId] = useState(() => getSessionId());
  const [anonymous_id] = useState(() => getAnonymousId()); // anonymous_id 상태 추가

  const touchSession = useCallback(() => { // 이름 변경
    const sid = refreshSession();
    if (session_id !== sid) { // 세션 ID가 변경된 경우에만 상태 업데이트
        setSessionId(sid);
    }
  }, [session_id]); // session_id 의존성 추가

  const clearUserSession = useCallback(() => { // 이름 변경
    clearSessionStorage();
    setSessionId(null);
    // anonymous_id는 사용자가 직접 지우지 않는 한 유지
  }, []);

  useEffect(() => {
    window.addEventListener('click', touchSession);
    window.addEventListener('keydown', touchSession);
    // anonymous_id는 한 번 설정되면 변경되지 않으므로, 별도 useEffect 불필요
    return () => {
      window.removeEventListener('click', touchSession);
      window.removeEventListener('keydown', touchSession);
    };
  }, [touchSession]);

  return (
    <SessionContext.Provider value={{ session_id, anonymous_id, clearSession: clearUserSession }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}