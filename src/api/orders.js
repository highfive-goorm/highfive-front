// src/api/orders.js
import api from './index';

const USE_STUB = process.env.REACT_APP_USE_STUB === 'true';

// 스텁용 메모리
let stub_orders = [
  {
    id:         123,
    created_at: '2025-05-09',
    items:      [
      { name: '티셔츠', quantity: 1 },
      { name: '청바지', quantity: 2 }
    ],
    total:      45000,
    status:     'shipping'   // 배송중
  },
  {
    id:         124,
    created_at: '2025-05-08',
    items:      [ { name: '스니커즈', quantity: 1 } ],
    total:      75000,
    status:     'delivered'  // 배송완료
  }
];

/** GET /orders/{user_id} */
export function fetchOrders(user_id) {
  if (USE_STUB) {
    return new Promise(res => setTimeout(() => res([...stub_orders]), 200));
  }
  return api.get(`/orders/${user_id}`).then(r => r.data);
}

/**
 * PATCH /orders/{order_id}/status
 * 바디: { status: string }
 */
export function updateOrderStatus(order_id, status) {
  if (USE_STUB) {
    return new Promise(res => {
      setTimeout(() => {
        stub_orders = stub_orders.map(o =>
          o.id === order_id ? { ...o, status } : o
        );
        res();
      }, 200);
    });
  }
  return api
    .put(`/orders/${order_id}`, { status })
    .then(r => r.data);
}
