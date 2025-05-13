// src/pages/admin/products/productApi.js
import api from '../../../api/index';
/**
 * 관리자용 Product(CRUD) API
 * 일단 admin이 아닌, 일반 post, put, delete로 하고 추후 수정
 */
export const getProducts = async () => {
  const res = await api.get('/product');
  return res.data;
};

export const getProduct = async (id) => {
  const res = await api.get(`/product/${id}`);
  return res.data;
};

export const createProduct = async (product) => {
  const res = await api.post('/product', product);
  return res.data;
};

export const updateProduct = async (id, product) => {
  const res = await api.put(`/product/${id}`, product);
  return res.data;
};

export const deleteProduct = async (id) => {
  await api.delete(`/product/${id}`);
};