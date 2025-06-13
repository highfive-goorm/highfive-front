// src/api/kakaopay.js
import api from './index'; // 자체 백엔드 API 호출을 위한 axios 인스턴스

// 프론트엔드에서 자체 백엔드로 결제 준비 요청
export async function requestKakaoPay(items, user, isFromCart) { // isFromCart 파라미터 추가
  // 백엔드로 전달할 주문 정보 구성
  const totalAmount = items.reduce((sum, i) => sum + i.discounted_price * i.quantity, 0);
  const itemName =
    items.length === 1
      ? items[0].name
      : `${items[0].name} 외 ${items.length - 1}건`;

  const data = {
    user_id: user?.user_id || 'guest', // 실제 사용자 ID 전달
    item_name: itemName || '상품',
    total_amount: totalAmount,
    // 백엔드에서 필요한 추가 주문 정보 (예: order_items 상세)
    order_items: items.map(item => ({
      product_id: item.product_id,
      quantity: item.quantity,
      discounted_price: item.discounted_price, // 또는 원가, 할인가 구분
    })),
    is_from_cart: isFromCart, // 전달받은 isFromCart 값 사용
  };

  // 자체 백엔드의 결제 준비 API 호출 (예: /api/payment/kakao/ready)
  // 이 API는 내부적으로 카카오페이 API를 호출하고 next_redirect_pc_url, tid 등을 반환
  const response = await api.post('/payment/kakao/ready', data);
  return response.data;
}

// 프론트엔드에서 자체 백엔드로 결제 승인 요청
export async function approveKakaoPay({ pg_token, order_id }) { // order_id 파라미터 추가
  const data = {
    pg_token,
    order_id, // 백엔드로 order_id 전달
  };
  // 자체 백엔드의 결제 승인 API 호출 (예: /api/payment/kakao/approve)
  // 이 API는 내부적으로 카카오페이 API를 호출하고 최종 결과를 반환
  const response = await api.post('/payment/kakao/approve', data);
  return response.data;
}
