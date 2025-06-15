import api from '../../../api/index';
import axios from 'axios';

const USE_STUB = process.env.REACT_APP_USE_STUB === 'true';
const STUB_BASE_URL = 'https://6822d576b342dce8004f85a8.mockapi.io';

/**
 * 관리자용 Alert(CRUD) API
 * 일단 admin이 아닌, 일반 post, put, delete로 하고 추후 수정
 */
export const getAlerts = () => {
  if (USE_STUB) {
    return axios.get(`${STUB_BASE_URL}/alert`).then(res => res.data);
  }
  return api.get('/alert').then(res => res.data);
}
  

export const getAlertById = (id) => {
  if (USE_STUB) {
    return axios.get(`${STUB_BASE_URL}/alert/${id}`).then(res => res.data);
  }
  return api.get(`/alert/${id}`).then(res => res.data);
}

export const createAlert = ({ title, content, is_global }) => {
  if (USE_STUB) {
    return axios.post(`${STUB_BASE_URL}/alert`, { title, content, is_global }).then(res => res.data);
  }
  return api.post('/alert', { title, content, is_global }).then(res => res.data);

}

export const updateAlert = (id, { title, content, is_global }) =>
  api.put(`/alert/${id}`, { title, content, is_global }).then(res => res.data);

export const deleteAlert = (id) =>
  api.delete(`/alert/${id}`);
