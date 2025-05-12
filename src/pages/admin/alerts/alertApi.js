import api from '../../../api/index';

/**
 * 관리자용 Alert(CRUD) API
 */
export const getAlerts = () =>
  api.get('/admin/alerts').then(res => res.data);

export const getAlertById = (id) =>
  api.get(`/admin/alerts/${id}`).then(res => res.data);

export const createAlert = ({ title, content, is_global }) =>
  api.post('/admin/alerts', { title, content, is_global }).then(res => res.data);

export const updateAlert = (id, { title, content, is_global }) =>
  api.put(`/admin/alerts/${id}`, { title, content, is_global }).then(res => res.data);

export const deleteAlert = (id) =>
  api.delete(`/admin/alerts/${id}`);
