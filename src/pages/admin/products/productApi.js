// src/pages/admin/products/productApi.js
import api from '../../../api/index';
import axios from 'axios';

const STUB_BASE_URL = 'https://6822bd75b342dce8004f37fb.mockapi.io';
const USE_STUB = process.env.REACT_APP_USE_STUB === 'true';

export const fetchProducts = async () => {
  if (USE_STUB) {
    return axios.get(`${STUB_BASE_URL}/product`).then(r => r.data);
  }
  return api.get(`/product`).then(r => r.data);
};
/**
 * 관리자용 Product(CRUD) API
 * 일단 admin이 아닌, 일반 post, put, delete로 하고 추후 수정
 */
export const getProducts = async () => {
  if (USE_STUB) {
    return axios.get(`${STUB_BASE_URL}/product`).then(r => r.data);
  }
  const res = await api.get('/product');
  return res.data;
};

export const getProduct = async (id) => {
  if (USE_STUB) {
    return axios.get(`${STUB_BASE_URL}/product/${id}`).then(r => r.data);
  }
  const res = await api.get(`/product/${id}`);
  return res.data;
};

export const createProduct = async (product) => {
  if (USE_STUB) {
    return axios.post(`${STUB_BASE_URL}/product`, product).then(r => r.data);
  }
  const res = await api.post('/product', product);
  return res.data;
};

export const updateProduct = async (id, product) => {
  if (USE_STUB) {
    return axios.put(`${STUB_BASE_URL}/product/${id}`, product).then(r => r.data);
  }
  const res = await api.put(`/product/${id}`, product);
  return res.data;
};

export const deleteProduct = async (id) => {
  if (USE_STUB) {
    await axios.delete(`${STUB_BASE_URL}/product/${id}`);
  }
  await api.delete(`/product/${id}`);
};