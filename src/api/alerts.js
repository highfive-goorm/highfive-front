import api from './index';
import axios from 'axios';

const USE_STUB = process.env.REACT_APP_USE_STUB === 'true';
const STUB_BASE_URL = 'https://6822d576b342dce8004f85a8.mockapi.io';

/**
 * 공지사항 목록 조회 (클라이언트 페이지네이션)
 * - mockapi는 페이지네이션 미지원이므로 전체를 가져와서 클라이언트에서 잘라 씁니다.
 * @param {string} user_id 현재 로그인한 유저 ID
 * @param {number} page 페이지 번호 (기본 1)
 * @param {number} size 페이지 크기 (기본 10)
 * @returns {{ alerts: Array, total: number }}
 */
export async function fetchAlerts(user_id, page = 1, size = 10) {
  let allAlerts;

  if (USE_STUB) {
    // stub 모드: mockapi로 전체 공지 불러오기
    const response = await axios.get(`${STUB_BASE_URL}/alert`);
    allAlerts = response.data;
  } else {
    // 실제 API 호출
    const response = await api.get('/alert', { params: { user_id } });
    const payload = response.data;
    // 서버가 { alerts, total } 형태라면 alerts 추출, 아니면 배열 그대로
    allAlerts = Array.isArray(payload) ? payload : payload.alerts || [];
  }

  const total = allAlerts.length;
  const start = (page - 1) * size;
  const alerts = allAlerts.slice(start, start + size);

  return { alerts, total };
}