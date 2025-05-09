import api from './index';

const USE_STUB = process.env.REACT_APP_USE_STUB === 'true';

// 샘플 stub 데이터 - length 변화시키면서 확인
const stubAlerts = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  title: `테스트 공지 ${i + 1}`,
  content: `내용 ${i + 1} 입니다.`,
  created_at: new Date(2025, 4, i + 1).toISOString(),  // 2025-05-01 ~ 2025-05-05
  is_global: i % 2 === 0,
}));

/**
 * 공지사항 목록 조회
 * - user_id: 현재 로그인한 유저의 ID
 * - page, size: 페이지네이션 옵션 (기본 page=1, size=10)
 * @returns { data: { alerts: Array, total: number } }
 */
export const fetchAlerts = async (user_id, page = 1, size = 10) => {
  if (USE_STUB) {
    const total = stubAlerts.length;
    const start = (page - 1) * size;
    const paged = stubAlerts.slice(start, start + size);
    // 느린 네트워크 흉내
    await new Promise(res => setTimeout(res, 200));
    return { alerts: paged, total };
  }

  // 실제 API 호출
  const params = { user_id, page, size };
  const response = await api.get('/alerts', { params });
  return response.data;
};