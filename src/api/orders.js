// src/api/orders.js
import api from './index';
import axios from 'axios';

const USE_STUB = process.env.REACT_APP_USE_STUB === 'true';
const STUB_BASE_URL = 'https://6822d576b342dce8004f85a8.mockapi.io';

/** GET /order/{user_id} */
export function fetchOrders(user_id) {
  if (USE_STUB) {
    return axios
      .get(`${STUB_BASE_URL}/order`, { params: { user_id } })
      .then(response => response.data);
  }
  return api
    .get(`/order/${user_id}`)
    .then(response => response.data);
}

/**
 * 주문 상태 업데이트
 * PUT /order/{order_id}
 * 바디: { status: string }
 */
export function updateOrderStatus(order_id, status) {
  if (USE_STUB) {
    return axios
      .put(`${STUB_BASE_URL}/order/${order_id}`, { status })
      .then(response => response.data);
  }
  return api
    .put(`/order/${order_id}`, { status })
    .then(response => response.data);
}

/**
 * 주문 생성
 * POST /order 또는 /orders
 * @param {string}   user_id
 * @param {Object[]} items          // [{ product_id, quantity, price }, …]
 * @param {number}   total_price
 * @param {boolean}  is_from_cart
 * @param {string}   status         // 기본 'paid'
 */
export function createOrder({ user_id, items, total_price, is_from_cart, status = 'paid', }) {
  const payload = {
    user_id,
    order_items: items.map(item => ({
      product_id: item.product_id,
      quantity: item.quantity,
      discounted_price: item.price,
    })),
    total_price,
    is_from_cart,
    status,
  };

  if (USE_STUB) {
    return axios.post(`${STUB_BASE_URL}/order`, payload).then(r => r.data);
  }
  return api.post('/order', payload).then(r => r.data);
}