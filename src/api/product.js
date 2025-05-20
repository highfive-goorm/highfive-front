// src/api/product.js
import api from './index';
import axios from "axios";

const STUB_BASE_URL = 'https://6822bd75b342dce8004f37fb.mockapi.io';
const USE_STUB      = process.env.REACT_APP_USE_STUB === 'true';

/**
 * 상품 목록 조회
 * @param {string} name     검색어 (빈 문자열이면 전체)
 * @param {number} page     페이지 번호
 * @param {number} size     페이지 크기
 * @param {string} filter   major_category 또는 gender 필터 ('' 이면 전체)
 * @returns {Promise<{ total: number, items: Array }>}
 */
export async function fetchProducts(
  name = '',
  page = 1,
  size = 15,
  filter = ''
) {
  const params = { page, size };
  if (name) params.name = name;

  // 'F','M','U' 면 gender 필터, 그 외 non-empty면 major_category 필터
  if (filter) {
    if (['F', 'M', 'U'].includes(filter)) {
      params.gender = filter;
    } else {
      params.major_category = filter;
    }
  }

  if (USE_STUB) {
    // Stub 모드: 전체 불러와서 흉내
    return axios
      .get(`${STUB_BASE_URL}/product`, { params: { name } })
      .then(r => {
        let all = r.data;
        // 이름 필터
        if (name) {
          const q = name.toLowerCase();
          all = all.filter(p => p.name.toLowerCase().includes(q));
        }
        // 성별 or 카테고리 필터
        if (filter) {
          if (['F', 'M', 'U'].includes(filter)) {
            all = all.filter(p => p.gender === filter);
          } else {
            all = all.filter(p => p.major_category === filter);
          }
        }
        const total = all.length;
        const start = (page - 1) * size;
        const items = all.slice(start, start + size);
        return { total, items };
      });
  }

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
  if (USE_STUB) {
    // stub 모드: mockapi에 단건 엔드포인트가 있다면
    return axios
      .get(`${STUB_BASE_URL}/product?id=^${id}$`)
      .then(r => (r.data.length > 0 ? r.data[0] : null));
  }

  return api
    .get(`/product/${id}`)
    .then(r => r.data);
}