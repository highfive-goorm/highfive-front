import api from './index';
import axios from 'axios';

const USE_STUB = process.env.REACT_APP_USE_STUB === 'true';

/**
 * 로그인 요청
 * - 실제: { access, refresh } 만 내려옴
 * - 스텁: test/test 계정만 허용
 */
// export async function loginRequest(account, password) {
//   if (USE_STUB) {
//     return new Promise((resolve, reject) => {
//       setTimeout(() => {
//         if (account === 'test' && password === 'test') {
//           // header.payload.signature
//           const header  = btoa(JSON.stringify({ alg: 'none', typ: 'JWT' }));
//           const payload = btoa(JSON.stringify({ user_id: 'test' }));
//           const fakeToken = `${header}.${payload}.`;
//           resolve({ access: fakeToken, refresh: fakeToken });
//         } else {
//           reject(new Error('Invalid credentials'));
//         }
//       }, 200);
//     });
//   }

//   const res = await api.post('/login', { account, password });
//   return res.data; // { access, refresh }
// }

// /**
//  * (필요시) 유저 정보 재조회
//  */
// export function getUserInfo(account) {
//   if (USE_STUB) {
//     return Promise.resolve({
//       user_id: 'test'
//     });
//   }
//   return api.get(`/user/${account}`).then(res => res.data);
// }

// /**
//  * 회원가입 요청
//  */
// export function signupRequest(data) {
//   if (USE_STUB) {
//     return Promise.resolve({ success: true });
//   }
//   return api.post('/signup', data).then(res => res.data);
// }

/**
 * 로그인 요청
 * - 실제: mockapi에서 전체 사용자 목록을 가져와서 클라이언트에서 account/password 매칭
 */
export async function loginRequest(user_id, password) {
  if (!USE_STUB) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (user_id === 'test' && password === 'test') {
          const header = btoa(JSON.stringify({ alg: 'none', typ: 'JWT' }));
          const payload = btoa(JSON.stringify({ user_id: 'test' }));
          const fakeToken = `${header}.${payload}.`;
          resolve({ access: fakeToken, refresh: fakeToken });
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 200);
    });
  }

  try {
    const response = await api.get('https://68144d36225ff1af162871b7.mockapi.io/signup'); // 실제 등록된 사용자 목록 조회
    const users = response.data;

    const user = users.find(u => u.user_id === user_id && u.password === password);
    console.log("✅ 찾은 유저:", user);

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // 임의 JWT 생성 (학습용)
    const header = btoa(JSON.stringify({ alg: 'none', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({ user_id: user.id }));
    const fakeToken = `${header}.${payload}.`;

    return { access: fakeToken, refresh: fakeToken };
  } catch (error) {
    throw new Error('로그인 실패: ' + error.message);
  }
}

/**
 * (필요시) 유저 정보 재조회
 */
export function getUserInfo(user_id) {
  if (USE_STUB) {
    return Promise.resolve({ user_id: 'test' });
  }
  return api.get(`/user/${user_id}`).then(res => res.data);
}

/**
 * 회원가입 요청
 * - REACT_APP_USE_STUB=true : mockapi.io 로 POST
 * - 그렇지 않으면 실제 백엔드 /user 으로 POST (201 응답 기대)
 */
export function signupRequest(data) {
  if (USE_STUB) {
    return axios
      .post('https://68144d36225ff1af162871b7.mockapi.io/signup', data)
      .then(res => res.data);
  } else {
    return api
      .post('/user', data)
      .then(res => {
        if (res.status === 201) return res.data;
        throw new Error(`Expected 201, got ${res.status}`);
      });
  }
}