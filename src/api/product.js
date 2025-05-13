import api from './index';
import axios from "axios";

const STUB_BASE_URL = 'https://6822bd75b342dce8004f37fb.mockapi.io';
const USE_STUB = process.env.REACT_APP_USE_STUB === 'true';

// 상품 리스트 전체 조회
export const fetchProducts = async () => {
  if (USE_STUB) {
    return axios.get(`${STUB_BASE_URL}/product`).then(r => r.data);
  }
  return api.get(`/product`).then(r => r.data);
};

// 브랜드 전체 조회
export const fetchBrands = async () => {
  if (USE_STUB) {
    return axios.get(`${STUB_BASE_URL}/brand`);
  }
  return api.get(`/brand`).then(r => r.data);
};