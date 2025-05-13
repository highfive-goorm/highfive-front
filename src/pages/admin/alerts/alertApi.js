import api from '../../../api/index';

/**
 * 관리자용 Alert(CRUD) API
 * 일단 admin이 아닌, 일반 post, put, delete로 하고 추후 수정
 */
export const getAlerts = () =>
  api.get('/alert').then(res => res.data);

export const getAlertById = (id) =>
  api.get(`/alert/${id}`).then(res => res.data);

export const createAlert = ({ title, content, is_global }) =>
  api.post('/alert', { title, content, is_global }).then(res => res.data);

export const updateAlert = (id, { title, content, is_global }) =>
  api.put(`/alert/${id}`, { title, content, is_global }).then(res => res.data);

export const deleteAlert = (id) =>
  api.delete(`/alert/${id}`);
