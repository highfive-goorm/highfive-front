import { useState, useEffect } from 'react';
import { fetchAlerts } from '../api/alerts';

/**
 * use_alerts 훅
 * - alerts: 공지사항 배열
 * - total: 전체 공지 개수
 * - loading / error: 로딩·에러 상태
 */
const useAlerts = (user_id, { page = 1, size = 10 } = {}) => {
  const [alerts, setAlerts]     = useState([]);
  const [total, setTotal]       = useState(0);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchAlerts(user_id, page, size)
      .then(({ alerts, total }) => {
        setAlerts(alerts);
        setTotal(total);
      })
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, [user_id, page, size]);


  return { alerts, total, loading, error };
};

export default useAlerts;
