// src/pages/admin/ads/adApi.js
import api from '../../../api/index';

/** GET /admin/ads → 광고 목록 조회 */
export const getAds = () => {
  if (process.env.REACT_APP_USE_STUB === 'true') {
    // 개발 모드라면 아래 임시 데이터 반환
    return Promise.resolve([
      {
        id: 1,
        name: '샘플 광고',
        img_url: 'https://via.placeholder.com/300x100?text=Sample+Ad',
        start_time: '2025-05-01T00:00:00Z',
        end_time:   '2025-05-10T23:59:59Z',
      },
      {
        id: 2,
        name: '테스트 광고 #2',
        img_url: 'https://via.placeholder.com/300x100?text=Test+Ad+2',
        start_time: '2025-06-01T00:00:00Z',
        end_time:   '2025-06-30T23:59:59Z',
      },
    ]);
  }
  // 프로덕션 모드면 실제 API 호출
  return api.get('/admin/ads').then(res => res.data);
};


export const getAd = async (id) => {
    const res = await api.get(`/admin/ads/${id}`);
    return res.data;
};

/** POST /admin/ads → 광고 생성 */
export const createAd = (ad) => {
  if (process.env.REACT_APP_USE_STUB === 'true') {
    // 개발 중엔 성공만 시뮬레이션
    return Promise.resolve({ ...ad, id: Date.now() });
  }
  return api.post('/admin/ads', ad).then(res => res.data);
};

/** PUT /admin/ads/:id → 광고 수정 */
export const updateAd = (id, ad) => {
  if (process.env.REACT_APP_USE_STUB === 'true') {
    return Promise.resolve({ ...ad, id });
  }
  return api.put(`/admin/ads/${id}`, ad).then(res => res.data);
};


/** DELETE /admin/ads/:id → 광고 삭제 */
export const deleteAd = (id) => {
  if (process.env.REACT_APP_USE_STUB === 'true') {
    return Promise.resolve();
  }
  return api.delete(`/admin/ads/${id}`);
};