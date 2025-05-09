// src/api/profile.js
import api from './index';

export function fetchProfile(user_id) {
  return api.get(`/user/${user_id}`).then(res => res.data);
}

export function updateProfile(user_id, data) {
  return api.put(`/user/${user_id}`, data).then(res => res.data);
}