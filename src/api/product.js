import axios from "axios";

const PRODUCT_BASE_URL = 'https://6822bd75b342dce8004f37fb.mockapi.io';

// 상품 리스트 전체 조회
export const fetchProducts = async () => {
  const response = await axios.get(`${PRODUCT_BASE_URL}/product`);
  return response.data;
};

// 브랜드 전체 조회
export const fetchBrands = async () => {
  const response = await axios.get(`${PRODUCT_BASE_URL}/brand`);
  return response.data;
};
