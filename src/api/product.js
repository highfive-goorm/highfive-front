// src/api/product.js
import api from './index';

/**
 * 상품 목록 조회
 * @param {string} name - 검색어 (빈 문자열이면 전체)
 * @param {number} page - 페이지 번호
 * @param {number} size - 페이지 크기
 * @param {object} filters - 필터 객체 (예: { gender: 'F', category: 'outer' })
 * @param {string} [filters.gender] - 성별 필터
 * @param {string} [filters.category] - 카테고리 필터 (API에서는 major_category로 매핑될 수 있음)
 * @returns {Promise<{ total: number, items: Array }>}
 */
export async function fetchProducts(
  name = '',
  page = 1,
  size = 15,
  filters = {}
) {
  const params = { page, size };
  if (name) params.name = name;

  // 필터 객체에서 각 필터 값 적용
  if (filters.gender) {
    params.gender = filters.gender;
  }
  if (filters.category) {
    // API 엔드포인트의 파라미터명이 'major_category'라면 여기서 매핑
    params.major_category = filters.category;
  }
  // 만약 다른 필터들이 추가된다면 여기서 유사하게 처리
  // if (filters.price_range) params.price_range = filters.price_range;

  // 실제 모드: backend가 { total, items } 반환
  return api
    .get('/product', { params })
    .then(r => r.data);
}

/**
 * 단일 상품 조회
 * GET /product/:id
 * @param {number|string} id
 */
export async function fetchProductById(id) {
  return api
    .get(`/product/${id}`)
    .then(r => r.data);
}