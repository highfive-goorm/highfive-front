// 📁 src/utils/session.js

const SESSION_ID_KEY = 'session_id';
const SESSION_EXP_KEY = 'session_expires_at';
const ANONYMOUS_ID_KEY = 'anonymous_id'; // 추가
const SESSION_DURATION = 30 * 60 * 1000; // 30분

// generateUUID 함수로 이름 변경 (범용성)
export function generateUUID() {
  if (typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0'));
  return `${hex.slice(0, 4).join('')}-${hex.slice(4, 6).join('')}-${hex.slice(6, 8).join('')}-${hex.slice(8, 10).join('')}-${hex.slice(10, 16).join('')}`;
}

function initSession() {
  const sid = generateUUID();
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
  localStorage.setItem(SESSION_EXP_KEY, expires.toString());
  if (localStorage.getItem(SESSION_ID_KEY) !== sid) { // getSessionId에서 새로 발급된 경우
    localStorage.setItem(SESSION_ID_KEY, sid);
  }
  return sid;
}

export function clearSession() {
  sessionStorage.removeItem(SESSION_ID_KEY);
  sessionStorage.removeItem(SESSION_EXP_KEY);
}

// Anonymous ID 관련 함수 추가
export function getAnonymousId() {
  let aid = localStorage.getItem(ANONYMOUS_ID_KEY);
  if (!aid) {
    aid = generateUUID();
    localStorage.setItem(ANONYMOUS_ID_KEY, aid);
  }
  return aid;
}