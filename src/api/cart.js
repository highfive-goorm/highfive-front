import api from './index';

// 유저 cart 조회
// GET /cart/{account}
export function fetchCart(account) {
  return api.get(`/cart/${account}`).then(res => res.data);
}

// 상품 수량 추가
// 이거 하기로 했는지 아닌지 까먹었음. 일단 써놓고 보기
// PATCH /cart/{account}/{productId}
export function updateCartItemQuantity(account, productId, quantity) {
  return api.patch(`/cart/${account}/${productId}`, { quantity })
    .then(res => res.data);
}

// 상품 삭제
// DELETE /cart/{account}/{productId}
export function removeCartItem(account, productId) {
  return api.delete(`/cart/${account}/${productId}`)
    .then(res => res.data);
}
