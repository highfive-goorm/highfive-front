import api from './index';
import axios from 'axios';

const BASE_URL = 'https://68144d36225ff1af162871b7.mockapi.io';

// 유저 장바구니 조회
export function fetchCart(user_id) {
  return axios.get(`${BASE_URL}/cart?user_id=${user_id}`).then(res => res.data);
}

// 수량 변경
export function updateCartItemQuantity(item_id, quantity) {
  return axios.put(`${BASE_URL}/cart/${item_id}`, { quantity }).then(res => res.data);
}

//／ 항목 삭제
export function removeCartItem(item_id) {
  return axios.delete(`${BASE_URL}/cart/${item_id}`).then(res => res.data);
}
