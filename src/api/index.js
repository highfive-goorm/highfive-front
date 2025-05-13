// src/api/index.js
import axios from 'axios';
import { getSessionId } from '../utils/session';
import { refreshAccessToken } from './auth';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// 요청마다 accessToken & SessionId 헤더 자동 삽입
api.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers['X-Session-Id'] = getSessionId();
  return config;
});

// 401 받으면 refresh → 원래 요청 재시도
api.interceptors.response.use(
  res => res,
  async error => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const newToken = await refreshAccessToken();
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch {
        // 갱신 실패 시 로그인 페이지로
        window.location.replace('/login');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
