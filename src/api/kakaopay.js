// src/api/kakaopay.js
import axios from 'axios';

const SECRET_KEY = process.env.REACT_APP_KAKAO_SECRET_KEY;

// ✅ 결제 준비 요청
export async function requestKakaoPay(items, user) {
  const totalAmount = items.reduce((sum, i) => sum + i.discounted_price * i.quantity, 0);

  const itemName =
    items.length === 1
      ? items[0].name
      : `${items[0].name} 외 ${items.length - 1}건`;

  const data = {
    cid: 'TC0ONETIME',
    partner_order_id: 'order1234',
    partner_user_id: user?.user_id || 'guest',
    item_name: itemName || '테스트상품',
    quantity: items.length,
    total_amount: totalAmount,
    tax_free_amount: 0,
    approval_url: 'http://localhost:3000/pay/approve',
    cancel_url: 'http://localhost:3000/pay/cancel', // 보류
    fail_url: 'http://localhost:3000/pay/fail',
  };

  const headers = {
    Authorization: `SECRET_KEY ${SECRET_KEY}`,
    'Content-Type': 'application/json',      // ✅ JSON 형식
  };

  const response = await axios.post('/kakao/online/v1/payment/ready', data, { headers });
  return response.data;
}

// ✅ 결제 승인 요청
export async function approveKakaoPay({ tid, pg_token, user_id }) {
  const data = {
    cid: 'TC0ONETIME',
    tid,
    partner_order_id: 'order1234',
    partner_user_id: user_id || 'guest',
    pg_token,
  };

  const headers = {
    Authorization: `SECRET_KEY ${SECRET_KEY}`,
    'Content-Type': 'application/json',
  };

  const response = await axios.post('/kakao/online/v1/payment/approve', data, { headers });
  return response.data;
}
