// src/pages/admin/products/productApi.js
import api from '../../../api/index';

export const getProducts = async () => {
  const res = await api.get('/admin/products');
  return res.data;
};

export const getProduct = async (id) => {
  const res = await api.get(`/admin/products/${id}`);
  return res.data;
};

export const createProduct = async (product) => {
  const res = await api.post('/admin/products', product);
  return res.data;
};

export const updateProduct = async (id, product) => {
  const res = await api.put(`/admin/products/${id}`, product);
  return res.data;
};

export const deleteProduct = async (id) => {
  await api.delete(`/admin/products/${id}`);
};