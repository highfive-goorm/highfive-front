// src/api/analytics.js
import api from './index';

const USE_STUB = process.env.REACT_APP_USE_STUB === 'true';

/**
 * 단일 이벤트 로깅
 * @param {{ user_id?: string|number, session_id?: string, event_type: string, event_data: object, timestamp: string }} payload
 */
export function logEvent(payload) {
  if (USE_STUB) {
    console.log('[Analytics Stub] event logged:', payload);
    // stub 환경에서는 즉시 resolved promise 반환
    return Promise.resolve({ stub: true });
  }

  // 실제 운영 환경에서는 백엔드로 전송
  return api
    .post('/analytics/events', payload)
    .catch(err => {
      console.error('Event log failed:', err);
      // 에러 무시하고 싶은 경우에도 resolved Promise로 핸들링
      return Promise.resolve({ error: true });
    });
}
