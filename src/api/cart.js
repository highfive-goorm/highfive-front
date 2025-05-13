import api from './index';
import axios from 'axios';

const USE_STUB = process.env.REACT_APP_USE_STUB === 'true';
const MOCK_BASE = 'https://68144d36225ff1af162871b7.mockapi.io';

export function fetchCart(user_id) {
  if (USE_STUB) {
    return axios
      .get(`${MOCK_BASE}/cart`, { params: { user_id } })
      .then(res => res.data);
  }
  return api
    .get('/cart', { params: { user_id } })
    .then(res => res.data);
}

/**
 * 수량 변경
 * - stub 모드: mockapi.io PUT /cart/{item_id}
 * - 실제 모드: 백엔드 PUT /cart/{item_id}
 */
export function updateCartItemQuantity(item_id, quantity) {
  if (USE_STUB) {
    return axios
      .put(`${MOCK_BASE}/cart/${item_id}`, { quantity })
      .then(res => res.data);
  }
  return api
    .put(`/cart/${item_id}`, { quantity })
    .then(res => res.data);
}

/**
 * 항목 삭제
 * - stub 모드: mockapi.io DELETE /cart/{item_id}
 * - 실제 모드: 백엔드 DELETE /cart/{item_id}
 */
export function removeCartItem(item_id) {
  if (USE_STUB) {
    return axios
      .delete(`${MOCK_BASE}/cart/${item_id}`)
      .then(res => res.data);
  }
  return api
    .delete(`/cart/${item_id}`)
    .then(res => res.data);
}
