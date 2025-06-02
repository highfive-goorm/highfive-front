// src/api/likes.js
import api from './index';

/**
 * 상품 좋아요
 * POST /product/{productId}/like
 * @param {number|string} productId - 상품 ID
 * @param {string} userId - 사용자 ID
 */
export const likeProduct = (productId, userId) => {
  return api.post(`/product/${productId}/like`, { user_id: userId });
};

/**
 * 상품 좋아요 취소
 * DELETE /product/{productId}/like/{userId}
 * @param {number|string} productId - 상품 ID
 * @param {string} userId - 사용자 ID
 */
export const unlikeProduct = (productId, userId) => {
  return api.delete(`/product/${productId}/like/${userId}`);
};

/**
 * 사용자가 좋아요한 상품 목록 조회
 * GET /product/like/count/{userId}
 * @param {string} userId - 사용자 ID
 * @returns {Promise<{user_id: string, like_products: Array<{id: number, name: string, img_url: string|null}>}>}
 */
export const getUserLikedProducts = async (userId) => {
  try {
    const response = await api.get(`/product/like/count/${userId}`);
    // 백엔드가 UserLikedProductsResponse 스키마를 따르고, 내용 없을 시 like_products가 빈 배열일 것으로 기대
    // 또는 백엔드가 200 OK 와 함께 {"detail": "좋아요 내역이 없습니다."} 를 보낼 경우
    if (response.data && response.data.detail === "좋아요 내역이 없습니다.") {
        return { user_id: userId, like_products: [] };
    }
    return response.data;
  } catch (error) {
    // 백엔드가 좋아요 내역 없을 때 404를 반환할 경우 (getUserLikedBrands 처럼)
    if (error.response && error.response.status === 404) {
      return { user_id: userId, like_products: [] }; // 빈 목록으로 정상 처리
    }
    // 그 외 에러는 그대로 throw
    throw error;
  }
};

// --- Brand Likes ---

/**
 * 브랜드 좋아요
 * POST /brand/{brandId}/like
 * @param {number|string} brandId - 브랜드 ID
 * @param {string} userId - 사용자 ID
 */
export const likeBrand = (brandId, userId) => {
  return api.post(`/brand/${brandId}/like`, { user_id: userId });
};

/**
 * 브랜드 좋아요 취소
 * DELETE /brand/{brandId}/like/{userId}
 * @param {number|string} brandId - 브랜드 ID
 * @param {string} userId - 사용자 ID
 */
export const unlikeBrand = (brandId, userId) => {
  return api.delete(`/brand/${brandId}/like/${userId}`);
};

/**
 * 사용자가 좋아요한 브랜드 목록 조회
 * GET /brand/like/count/{userId}
 * @param {string} userId - 사용자 ID
 * @returns {Promise<{user_id: string, like_brands: Array<{id: number, brand_kor: string, brand_eng: string|null, like_count: number}>}>}
 */
export const getUserLikedBrands = async (userId) => {
  try {
    const response = await api.get(`/brand/like/count/${userId}`);
    return response.data;
  } catch (error) {
    // 백엔드가 좋아요 내역 없을 때 404를 반환하는 것을 명시적으로 처리
    if (error.response && error.response.status === 404) {
      return { user_id: userId, like_brands: [] }; // 빈 목록으로 정상 처리
    }
    // 그 외 에러는 그대로 throw
    throw error;
  }
};