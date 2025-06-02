// src/api/index.js
import axios from 'axios';
import { getSessionId } from '../utils/session';
import { refreshAccessToken } from './auth';
import { getApiBaseUrl } from '../config'; 

const api = axios.create({
  headers: { 'Content-Type': 'application/json' },
});

// 요청마다 accessToken & SessionId 헤더 자동 삽입
api.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers['X-Session-Id'] = getSessionId();

  if (config.url && !config.url.startsWith('http://') && !config.url.startsWith('https://')) {
    const baseUrl = getApiBaseUrl();
    if (baseUrl) { // baseUrl이 정상적으로 로드되었을 경우
        config.url = baseUrl + (config.url.startsWith('/') ? config.url : '/' + config.url);
    } else {
        // baseUrl을 아직 가져오지 못했거나 문제가 있는 경우에 대한 처리 (선택 사항)
        // 예를 들어, 에러를 던지거나 기본값을 사용하도록 할 수 있습니다.
        // 현재 로직에서는 loadAppConfig가 먼저 완료되므로 이 경우는 드뭅니다.
        console.warn('API Base URL not available yet or invalid. Request might fail for:', config.url);
    }
  }
  
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
