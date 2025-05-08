// 📁 src/utils/session.js

// 로컬 스토리지 키
const KEY_ID = 'session_id';
const KEY_EXP = 'session_expires_at';
const DURATION = 30 * 60 * 1000;

/**
 * 안전한 랜덤 세션 ID 생성
 * - crypto.randomUUID()가 있으면 그대로 사용
 * - 없으면 RFC 4122 v4 규격에 맞춰 직접 생성
 */
export function generateSessionId() {
  // 1) 최신 브라우저/Node.js 19+ 환경
  if (typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  // 2) fallback: 16바이트 랜덤 → UUID v4 포맷
  const bytes = crypto.getRandomValues(new Uint8Array(16));

  // 버전(4)과 변형(variant) 비트 설정
  bytes[6] = (bytes[6] & 0x0f) | 0x40; // xxxx4xxx
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // 10xxxxxx

  // 헥사 문자열로 변환
  const hex = Array.from(bytes).map(b =>
    b.toString(16).padStart(2, '0')
  );

  // segments: 8-4-4-4-12
  return [
    hex.slice(0, 4).join('') + hex.slice(4, 4).join(''),          // 8 chars
    hex.slice(4, 6).join(''),                                     // 4 chars
    hex.slice(6, 8).join(''),                                     // 4 chars
    hex.slice(8, 10).join(''),                                    // 4 chars
    hex.slice(10, 16).join('')                                    // 12 chars
  ].join('-');
}

/**
 * session_id 발급 & 만료시간 설정
 */
function initSession() {
  const sid      = generateSessionId();
  const expires  = Date.now() + DURATION;
  localStorage.setItem(KEY_ID, sid);
  localStorage.setItem(KEY_EXP, expires.toString());
  return sid;
}

/**
 * 세션 리턴  
 * - 없으면 init  
 * - 있으면 만료 검사 → 만료됐으면 init  
 */
export function getSessionId() {
  const sid = localStorage.getItem(KEY_ID);
  const exp = Number(localStorage.getItem(KEY_EXP));
  if (!sid || !exp || Date.now() > exp) {
    return initSession();
  }
  return sid;
}

/**
 * 만료시간만 연장  
 */
export function refreshSession() {
  const sid     = getSessionId();               // sid는 그대로
  const expires = Date.now() + DURATION;        // now+30분
  localStorage.setItem(KEY_EXP, expires.toString());
  return sid;
}

/**
 * 세션 완전 삭제
 */
export function clearSession() {
  localStorage.removeItem(KEY_ID);
  localStorage.removeItem(KEY_EXP);
}