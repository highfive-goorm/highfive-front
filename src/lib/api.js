// src/lib/api.js

import axios from 'axios';

// 테스트용 계정
const VALID_ACCOUNT = 'test';
const VALID_PASSWORD = 'test';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000'; // 백엔드 주소 설정

const api = axios.create({
  baseURL: BASE_URL,    // 백엔드 주소
  headers: { 'Content-Type': 'application/json' },
});

// 요청 시 토큰이 있으면 자동으로 헤더에 추가
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 401 Unauthorized 시 자동 토큰/쿠키 삭제
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('account');
    }
    return Promise.reject(err);
  }
);

// local에서 확인하기 위한 loginRequest 함수와 getUserInfo 함수
export async function loginRequest(account, password) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (account === VALID_ACCOUNT && password === VALID_PASSWORD) {
        const token = 'fake-jwt-token';
        const user = { name: '테스트-유저'};

        localStorage.setItem('token', token);
        localStorage.setItem('account', account);
        resolve({ token, user });
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 300);
  });  
}

export async function getUserInfo(account) {
  return Promise.resolve({ name: '테스트 유저'});
}

// /**
//  * POST /login
//  * @returns {Promise<{ token: string, user: object }>}
//  */
// export function loginRequest(account, password) {
//   return api
//     .post('/login', { account, password })
//     .then((res) => res.data);
// }

// /**
//  * GET /user/{account}
//  * @returns {Promise<object>}
//  */
// export function getUserInfo(account) {
//   return api
//     .get(`/user/${account}`)
//     .then((res) => res.data);
// }

export default api;
