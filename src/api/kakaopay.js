import axios from 'axios';

// const SECRET_KEY = process.env.REACT_APP_KAKAO_SECRET_KEY;

// ✅ 결제 준비 요청
export async function requestKakaoPay(items, user) {
  const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const data = {
    cid: 'TC0ONETIME',
    partner_order_id: 'order1234',
    partner_user_id: user?.user_id || 'guest',
    item_name: items[0]?.name || '테스트상품',
    quantity: items.length,
    total_amount: totalAmount,
    tax_free_amount: 0,
    approval_url: 'http://localhost:3000/pay/approve',
    cancel_url: 'http://localhost:3000/pay/cancel', // 보류
    fail_url: 'http://localhost:3000/pay/fail',
  };

  const headers = {
    Authorization: `SECRET_KEY ${process.env.REACT_APP_KAKAO_SECRET_KEY}`,
    'Content-Type': 'application/json',      // ✅ JSON 형식
  };

  try {
    const response = await axios.post('/kakao/online/v1/payment/ready', data, { headers });
    console.log('✅ 결제 준비 응답:', response.data);
    return response.data; // next_redirect_pc_url, tid 등 포함
  } catch (err) {
    console.error('❌ 결제 준비 실패:', err.response?.data || err.message);
    throw err;
  }
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
    Authorization: `SECRET_KEY ${process.env.REACT_APP_KAKAO_SECRET_KEY}`,
    'Content-Type': 'application/json',
  };

  try {
    const response = await axios.post('/kakao/online/v1/payment/approve', data, { headers });
    console.log('✅ 결제 승인 응답:', response.data);
    return response.data;
  } catch (err) {
    console.error('❌ 결제 승인 실패:', err.response?.data || err.message);
    throw err;
  }
}
