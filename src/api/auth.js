// src/api/auth.js
import api from './index';

export function loginRequest(account, password) {
  return api.post('/login', { account, password }).then(res => res.data);
}

export function signupRequest(data) {
  return api.post('/signup', data).then(res => res.data);
}