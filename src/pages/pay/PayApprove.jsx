// src/pages/pay/payApprove.jsx
import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { approveKakaoPay } from '../../api/kakaopay'; // 경로는 프로젝트에 맞게 수정
import { useTracking } from '../../hooks/useTracking'; // 트래킹 훅 추가

export default function PayApprove() {
  const location = useLocation();
  const navigate = useNavigate();
  const executedRef = useRef(false); // 실행 여부 추적

  const { trackEvent } = useTracking(); // 트래킹 훅 사용
  useEffect(() => {
    if (executedRef.current) return; // 이미 실행했으면 skip
    executedRef.current = true;

    const url_params = new URLSearchParams(location.search);
    const pg_token = url_params.get('pg_token');
    const order_id = sessionStorage.getItem('current_order_id'); // sessionStorage에서 order_id 가져오기

    if (!pg_token || !order_id) { // pg_token 또는 order_id가 없으면 실패 처리
      sessionStorage.removeItem('current_order_id'); // 불필요한 order_id 제거
      return navigate('/pay/fail');
    }

    approveKakaoPay({ pg_token, order_id }) // order_id 전달
      .then(async () => {
        sessionStorage.removeItem('current_order_id'); // 성공 시 order_id 제거
        navigate('/mypage/orders');
      })
      .catch(() => {
        sessionStorage.removeItem('current_order_id'); // 실패 시에도 order_id 제거
        navigate('/pay/fail');
      });
  }, [location, navigate, trackEvent]);

  return null; // 메시지 안 보이게 처리
}
