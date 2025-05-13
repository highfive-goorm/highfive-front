// src/pages/pay/payApprove.jsx
import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { approveKakaoPay } from '../../api/kakaopay'; // 경로는 프로젝트에 맞게 수정
import { createOrder } from '../../api/orders';

export default function PayApprove() {
  const location = useLocation();
  const navigate = useNavigate();
  const executedRef = useRef(false); // ✅ 실행 여부 추적

  useEffect(() => {
    if (executedRef.current) return; // 이미 실행했으면 skip
    executedRef.current = true;

    const url_params = new URLSearchParams(location.search);
    const pg_token = url_params.get('pg_token');
    const tid = sessionStorage.getItem('kakao_tid');
    const user_id = sessionStorage.getItem('kakao_user_id');

    // 주문 정보 불러오기
    const order_items = JSON.parse(sessionStorage.getItem('order_items') || '[]');
    const total_price = Number(sessionStorage.getItem('total_price')) || 0;
    const is_from_cart = sessionStorage.getItem('is_from_cart') === 'true';

    if (!pg_token || !tid) return navigate('/pay/fail');

    approveKakaoPay({ tid, pg_token, user_id })
      .then(async () => {
        await createOrder({
          user_id,
          items: order_items,
          total_price,
          is_from_cart,
          status: 'paid',
        });
        navigate('/mypage/orders');
      })
      .catch(() => navigate('/pay/fail'));
  }, [location, navigate]);

  return null; // ✅ 메시지 안 보이게 처리
}
