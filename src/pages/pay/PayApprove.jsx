// src/pages/pay/payApprove.jsx
import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { approveKakaoPay } from '../../api/kakaopay'; // 경로는 프로젝트에 맞게 수정
import { useTracking } from '../../hooks/useTracking'; // 트래킹 훅 추가
import { createOrder } from '../../api/orders';

export default function PayApprove() {
  const location = useLocation();
  const navigate = useNavigate();
  const executedRef = useRef(false); // ✅ 실행 여부 추적

  const { trackEvent } = useTracking(); // 트래킹 훅 사용
  useEffect(() => {
    if (executedRef.current) return; // 이미 실행했으면 skip
    executedRef.current = true;

    const url_params = new URLSearchParams(location.search);
    const pg_token = url_params.get('pg_token');
    const tid = sessionStorage.getItem('kakao_tid');
    // 중요: 여기서 사용되는 user_id는 실제 애플리케이션의 사용자 ID여야 합니다.
    // kakao_user_id가 애플리케이션 user_id와 동일하다면 그대로 사용 가능.
    // 다르다면, AuthContext 등에서 실제 user_id를 가져와야 합니다.
    const app_user_id = sessionStorage.getItem('kakao_user_id'); // 임시로 kakao_user_id 사용, 실제 앱 user_id로 대체 필요

    // 주문 정보 불러오기
    const order_items = JSON.parse(sessionStorage.getItem('order_items') || '[]');
    const total_price = Number(sessionStorage.getItem('total_price')) || 0;
    const is_from_cart = sessionStorage.getItem('is_from_cart') === 'true';

    if (!pg_token || !tid) return navigate('/pay/fail');

    approveKakaoPay({ tid, pg_token, user_id: app_user_id }) // 카카오페이 승인 시에도 app_user_id 사용
      .then(async () => {
        const orderPayload = {
          user_id: app_user_id, // 실제 앱 사용자 ID 사용
          items: order_items,
          total_price,
          is_from_cart,
          status: 'paid',
        };
        const createdOrder = await createOrder(orderPayload); // API 명세에 맞춘 페이로드

        // 주문 성공 이벤트 트래킹
        trackEvent('order', {
          order_items: order_items.map(item => ({ // 스키마에 맞게 qty -> quantity
            product_id: item.product_id,
            quantity: item.quantity, // API 요청 시 quantity, 로그 스키마도 quantity로 가정
            discounted_price: item.discounted_price,
          })),
          total_price: total_price,
          order_status: 'paid',
          // order_id: createdOrder._id, // 백엔드에서 받은 주문 ID (선택적)
        });

        navigate('/mypage/orders');
      })
      .catch(() => navigate('/pay/fail'));
  }, [location, navigate, trackEvent]);

  return null; // ✅ 메시지 안 보이게 처리
}
