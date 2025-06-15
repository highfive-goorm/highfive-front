// src/api/profile.js
import api from './index';
import axios from 'axios';

const USE_STUB = process.env.REACT_APP_USE_STUB === 'true';
const MOCK_BASE = 'https://68144d36225ff1af162871b7.mockapi.io';

/**
 * 프로필 조회
 * - stub 모드: mockapi의 /signup/:id
 * - 실제 모드: 백엔드 /user/:id
 */
export function fetchProfile(user_id) {
  if (USE_STUB) {
    return axios
      .get(`${MOCK_BASE}/signup/${user_id}`)
      .then(res => res.data);
  }
  return api.get(`/user/${user_id}`).then(res => res.data);
}

/**
 * 프로필 수정
 * - stub 모드: mockapi의 /signup/:id 로 PUT
 * - 실제 모드: 백엔드 /user/:id 로 PUT
 */
export function updateProfile(user_id, data) {
  if (USE_STUB) {
    return axios
      .put(`${MOCK_BASE}/signup/${user_id}`, data)
      .then(res => res.data);
  }
  return api.put(`/user/${user_id}`, data).then(res => res.data);
}
