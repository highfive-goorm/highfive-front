import api from './index';

const USE_STUB = process.env.REACT_APP_USE_STUB === 'true';

/**
 * UTF-8 문자열을 Base64로 안전히 인코딩
 */
function utf8ToB64(str) {
  // TextEncoder로 UTF-8 바이트 배열 생성
  const bytes = new TextEncoder().encode(str);
  // 각 바이트를 이진 문자열로 변환
  let binary = '';
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  // btoa로 Base64 인코딩
  return btoa(binary);
}

/**
 * 로그인 요청
 * - 개발환경 USE_STUB=true 면 test/test 계정만 허용
 * - 한글 name 필드도 제대로 인코딩
 */
export async function loginRequest(account, password) {
  if (USE_STUB) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (account === 'test' && password === 'test') {
          // 한글 이름까지 포함한 페이로드
          const fakePayload = {
            account: 'test',
            name: '홍길동',  // 한글 이름
            role: 'user'
          };
          // 매우 간단한 JWT 포맷 (signature는 빈 문자열)
          const header  = utf8ToB64(JSON.stringify({ alg: 'none', typ: 'JWT' }));
          const payload = utf8ToB64(JSON.stringify(fakePayload));
          const fakeToken = `${header}.${payload}.`;

          resolve({
            access:  fakeToken,
            refresh: fakeToken
          });
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 300);
    });
  }

  // 실제 백엔드 호출
  return api
    .post('/login', { account, password })
    .then(res => res.data);
}

/**
 * (필요시) 유저 정보 재조회: 테스트 스텁에도 한글 이름 유지
 */
export function getUserInfo(account) {
  if (USE_STUB) {
    return Promise.resolve({
      account: 'test',
      name:    '홍길동',
      role:    'user'
    });
  }
  return api.get(`/user/${account}`).then(res => res.data);
}

/**
 * 회원가입 요청
 */
export function signupRequest(data) {
  if (USE_STUB) {
    return Promise.resolve({ success: true });
  }
  return api.post('/signup', data).then(res => res.data);
}
