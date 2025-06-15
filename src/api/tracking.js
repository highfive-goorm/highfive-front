// src/api/tracking.js
import api from './index';

/**
 * 사용자 행동 이벤트 로깅
 * @param {object} eventData
 * @param {string} eventData.event_type
 * @param {string} eventData.event_timestamp
 * @param {string} eventData.anonymous_id
 * @param {string} eventData.session_id
 * @param {string} [eventData.user_id]
 * @param {string} [eventData.referrer_url]
 * @param {object} [eventData.utm_parameters]
 * @param {object} [eventData.event_properties]
 */
export function trackEventApi(eventData) {
  return api
    .post('/tracking/log/event', eventData)
    .then(response => ({ success: true, data: response.data }))
    .catch(err => {
      console.error('Event log API call failed:', err.response?.data || err.message);
      // 에러 발생 시에도 애플리케이션 흐름을 막지 않도록 처리
      return Promise.resolve({ success: false, error: true, message: err.response?.data?.detail || 'Logging failed' });
    });
}