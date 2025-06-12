// src/hooks/useTracking.js
import { useCallback } from 'react';
import { useSession } from '../context/SessionContext'; // SessionContext에서 anonymous_id와 session_id를 가져옴
import { useAuth } from '../context/AuthContext';
import { trackEventApi } from '../api/tracking'; // 백엔드로 로그를 보내는 API 함수
import { v4 as uuidv4 } from 'uuid';
import { getLandingUrl, getPreviousPath } from '../utils/trackingUtils'; // landing_url 및 previous_path 가져오기
// getAnonymousId는 SessionContext를 통해 간접적으로 사용되거나, SessionContext가 업데이트되어야 함

export function useTracking() {
  const { anonymous_id, session_id } = useSession();
  const { user, isLoading: isAuthLoading } = useAuth();

  const trackEvent = useCallback(
    async (eventType, properties = {}) => { // eventProperties를 properties로 변경 (스키마와 일치)
      if (isAuthLoading) {
        // console.log('[Tracking Hook] Auth data is loading, event tracking deferred or skipped.');
        return; // 인증 정보 로딩 중에는 트래킹을 지연하거나 스킵할 수 있습니다.
      }

      if (!anonymous_id || !session_id) {
        console.warn(
          'Tracking: anonymous_id or session_id from useSession is missing. Log will not be sent.',
          { anonymous_id, session_id }
        );
        return;
      }

      if (!eventType) {
        console.warn('Tracking: eventType is required. Log will not be sent.');
        return;
      }

      // 새 스키마에 따른 로그 데이터 구성
      const logData = {
        event_id: uuidv4(),
        anonymous_id: anonymous_id, // SessionContext에서 제공 (SessionContext가 trackingUtils.getAnonymousId를 사용하도록 업데이트 필요)
        user_id: user ? user.user_id : null,
        session_id: session_id,     // SessionContext에서 제공
        event_type: eventType,
        event_timestamp: new Date().toISOString(),
        // utm_params: getUtmParams(), // 추후 확장 가능
        page_url: window.location.href,
        page_view: document.title, // 필요시 컴포넌트에서 더 구체적인 페이지 제목 전달 가능
        page_referrer: getPreviousPath() || document.referrer || null, // SPA 내부 이전 경로 우선 사용
        landing_url: getLandingUrl(), // 유틸리티 함수로 가져옴
        event_properties: Object.keys(properties).length > 0 ? properties : null, // 이벤트별 속성 (키 이름 변경)
      };

      try {
        // console.log('[Tracking Hook] Sending event:', JSON.stringify(logData, null, 2));
        await trackEventApi(logData);
        // console.log('[Tracking Hook] Event logged:', logData.event_type);
      } catch (error) {
        console.error('[Tracking Hook] Error sending tracking event:', error, logData);
      }
    },
    [anonymous_id, session_id, user, isAuthLoading]
  );

  return { trackEvent, isAuthReady: !isAuthLoading };
}