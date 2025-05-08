// src/hooks/useAnalytics.js
import { useAuth } from '../context/AuthContext';
import { useSession } from '../context/SessionContext';
import { logEvent } from '../api/analytics';

export function useAnalytics() {
  const { user } = useAuth();
  const { session_id } = useSession();

  function track(event_type, event_data = {}) {
    return logEvent({
      user_id:    user?.user_id,
      session_id,
      event_type,
      event_data,
      timestamp: new Date().toISOString(),
    });
  }

  return { track };
}
