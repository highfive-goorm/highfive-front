// src/api/likes.js
import api from './index';

/**
 * 상품 좋아요 토글
 * POST /product/{product_id}/like
 */
export function toggleProductLike(product_id, user_id, liked) {
  return api
    .post(`/product/${product_id}/like`, { user_id, product_id, liked })
    .then(res => res.data);
}
