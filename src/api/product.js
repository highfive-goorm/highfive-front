// src/api/product.js
import api from './index';
import axios from "axios";

const STUB_BASE_URL = 'https://6822bd75b342dce8004f37fb.mockapi.io';
const USE_STUB = process.env.REACT_APP_USE_STUB === 'true';

/**
 * 상품 목록 조회
 * @param {string} name 검색어 (빈 문자열이면 전체 조회)
 */
export async function fetchProducts(name = '') {
  const params = name ? { name } : {};

  if (USE_STUB) {
    return axios
      .get(`${STUB_BASE_URL}/product`, { params })
      .then(r => r.data);
  }

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
      .get(`${STUB_BASE_URL}/product?id=id`)
      .then(r => r.data);
  }

  return api
    .get(`/product/${id}`)
    .then(r => r.data);
}