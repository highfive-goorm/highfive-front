// src/api/auth.js
import api from './index';

/**
 * 로그인 요청
 * - 실제 모드: POST /user/login 으로 { access, refresh } 반환
 */
export async function loginRequest(account, password) {
  const res = await api.post('/user/login', { account, password });
  return res.data;
}

/**
 * 회원가입 요청
 * - REACT_APP_USE_STUB=true : mockapi.io 로 POST
 * - 그렇지 않으면 실제 백엔드 /user 으로 POST (201 응답 기대)
 */
export function signupRequest(data) {
  return api
    .post('/user', data)
    .then(res => {
      if (res.status === 201) return res.data;
      throw new Error(`Expected 201, got ${res.status}`);
    });
}

// 토큰 갱신 함수 (sessionStorage 사용)
export async function refreshAccessToken() {
  const refresh = sessionStorage.getItem('refreshToken'); // localStorage -> sessionStorage
  if (!refresh) {
    throw new Error('No refresh token stored');
  }

  try {
    // 백엔드에 refresh token 전송
    // api.post는 Gateway를 통해 실제 /user/token/refresh 엔드포인트로 갈 것임
    const response = await api.post('/user/token/refresh', { refresh });
    const { access, refresh: newRefresh } = response.data; // 실제 응답 구조에 따라 data.access 등 조정

    // 세션 스토리지에 재저장
    sessionStorage.setItem('accessToken', access);
    if (newRefresh) { // 백엔드가 새 리프레시 토큰을 줄 수도 있음
        sessionStorage.setItem('refreshToken', newRefresh);
    }
    
    return access;
  } catch (error) {
    console.error('Error refreshing access token:', error.response?.data || error.message);
    // 여기서 에러를 throw하면 AuthContext의 catch 블록에서 처리됨 (로그아웃 등)
    throw error;
  }
}