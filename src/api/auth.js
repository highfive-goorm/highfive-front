// src/api/auth.js
import api from './index';
import axios from 'axios';

const USE_STUB = process.env.REACT_APP_USE_STUB === 'true';

/**
 * 로그인 요청
 * - stub 모드: mockapi 에서 account/password 매칭 후 임의 JWT 생성
 * - 실제 모드: POST /user/login 으로 { access, refresh } 반환
 */
export async function loginRequest(account, password) {
  if (USE_STUB) {
    // mockapi 에서 가입된 유저 목록 조회
    const users = await axios
      .get('https://68144d36225ff1af162871b7.mockapi.io/signup')
      .then(res => res.data);

    // account/password가 모두 일치하는 유저 찾기
    const user = users.find(u => u.account === account && u.password === password);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // 학습용 임의 JWT 생성 (header.payload.)
    const header  = btoa(JSON.stringify({ alg: 'none', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({ user_id: user.id }));
    const fakeToken = `${header}.${payload}.`;

    return { access: fakeToken, refresh: fakeToken };
  } else {
    // 실제 백엔드 호출
    // POST /user/login { account, password } → { access, refresh }
    const res = await api.post('/user/login', { account, password });
    return res.data;
  }
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

// 토큰 갱신 함수
export async function refreshAccessToken() {
  const refresh = localStorage.getItem('refreshToken');
  if (!refresh) throw new Error('No refresh token stored');

  // 백엔드에 refresh token 전송
  const { data } = await api.post('/user/token/refresh', { refresh });
  const { access, refresh: newRefresh } = data;

  // 로컬 스토리지에 재저장
  localStorage.setItem('accessToken', access);
  localStorage.setItem('refreshToken', newRefresh);

  return access;
}