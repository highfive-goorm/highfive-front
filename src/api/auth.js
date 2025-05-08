import api from './index';

const USE_STUB = process.env.REACT_APP_USE_STUB === 'true';

/**
 * 로그인 요청
 * - 실제: { access, refresh } 만 내려옴
 * - 스텁: test/test 계정만 허용
 */
export async function loginRequest(account, password) {
  if (USE_STUB) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (account === 'test' && password === 'test') {
          // header.payload.signature
          const header  = btoa(JSON.stringify({ alg: 'none', typ: 'JWT' }));
          const payload = btoa(JSON.stringify({ user_id: 'test' }));
          const fakeToken = `${header}.${payload}.`;
          resolve({ access: fakeToken, refresh: fakeToken });
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 200);
    });
  }

  const res = await api.post('/login', { account, password });
  return res.data; // { access, refresh }
}

/**
 * (필요시) 유저 정보 재조회
 */
export function getUserInfo(account) {
  if (USE_STUB) {
    return Promise.resolve({
      user_id: 'test'
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
