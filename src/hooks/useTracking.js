// src/hooks/useTracking.js
import { useCallback } from 'react';
import { useSession } from '../context/SessionContext';
import { useAuth } from '../context/AuthContext'; // 수정된 AuthContext 사용
import { trackEventApi } from '../api/tracking';

export function useTracking() {
  const { anonymous_id, session_id } = useSession();
  const { user, isLoading: isAuthLoading } = useAuth(); // AuthContext에서 user와 로딩 상태 가져오기

  const trackEvent = useCallback(
    async (eventType, eventProperties = {}, additionalFields = {}) => {
      // 인증 정보 로딩 중에는 user_id가 확정되지 않았을 수 있으므로, 로깅을 지연하거나 user_id 없이 보낼 수 있음
      if (isAuthLoading) {
        // console.log('[Tracking Hook] Auth data is loading, event tracking deferred or skipped.');
        // 필요하다면 로깅을 큐에 넣었다가 나중에 보내는 로직 추가 가능
        // 또는, user_id 없이 일단 보내고, 나중에 user_id가 확정되면 별도 이벤트로 보낼 수도 있음
        // 가장 간단하게는, user_id가 필요한 이벤트는 isAuthLoading이 false일 때만 보내도록 호출부에서 제어
      }

      if (!anonymous_id || !session_id) {
        console.warn('Tracking: anonymous_id or session_id is missing. Log will not be sent.');
        return;
      }

      if (!eventType) {
        console.warn('Tracking: eventType is required. Log will not be sent.');
        return;
      }

      const commonEventData = {
        anonymous_id,
        session_id,
        // user 객체가 있고, 그 안에 user_id 필드가 있다고 가정. 실제 필드명에 맞춰야 함.
        user_id: user ? user.user_id : null,
        event_type: eventType,
        event_timestamp: new Date().toISOString(),
        // referrer_url, utm_parameters 등은 필요시 additionalFields로 받거나,
        // 여기서 document.referrer, window.location.search 등을 활용해 채울 수 있음
      };

      const finalEventData = {
        ...commonEventData,
        event_properties: Object.keys(eventProperties).length > 0 ? eventProperties : null,
        ...additionalFields,
      };

      try {
        // console.log('[Tracking Hook] Sending event:', JSON.stringify(finalEventData, null, 2)); // 디버깅용
        const response = await trackEventApi(finalEventData);
        // if (response.success) {
        //   console.log('[Tracking Hook] Event logged:', response.stub ? '(Stubbed)' : finalEventData.event_type);
        // } else {
        //   console.warn('[Tracking Hook] Failed to log event:', response.message, finalEventData.event_type);
        // }
      } catch (error) {
        console.error('[Tracking Hook] Unexpected error during trackEventApi call:', error);
      }
    },
    [anonymous_id, session_id, user, isAuthLoading] // 의존성 배열에 isAuthLoading 추가
  );

  return { trackEvent, isAuthReady: !isAuthLoading }; // isAuthReady 같은 플래그 반환 가능
}