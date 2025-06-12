// 📁 src/utils/session.js
import { v4 as uuidv4 } from 'uuid'; // uuid 라이브러리 import

const SESSION_ID_KEY = 'session_id';
const SESSION_EXP_KEY = 'session_expires_at';
const SESSION_DURATION = 30 * 60 * 1000; // 30분

function initSession() {
  const sid = uuidv4(); // 직접 uuidv4 사용
  const expires = Date.now() + SESSION_DURATION;
  sessionStorage.setItem(SESSION_ID_KEY, sid);
  sessionStorage.setItem(SESSION_EXP_KEY, expires.toString());
  return sid;
}

export function getSessionId() {
  const sid = sessionStorage.getItem(SESSION_ID_KEY);
  const exp = Number(sessionStorage.getItem(SESSION_EXP_KEY));
  if (!sid || !exp || Date.now() > exp) {
    return initSession();
  }
  return sid;
}

export function refreshSession() {
  const sid = getSessionId(); // 만료됐으면 여기서 새로 발급됨
  const expires = Date.now() + SESSION_DURATION;
  sessionStorage.setItem(SESSION_EXP_KEY, expires.toString());
  return sid;
}

export function clearSession() {
  sessionStorage.removeItem(SESSION_ID_KEY);
  sessionStorage.removeItem(SESSION_EXP_KEY);
}
