// src/api/favorites.js (틈만)
import api from './index';

/**
 * GET /favorites/{user_id}
 * @returns {Promise<Array>}
 */
export function fetchFavorites(user_id) {
  return api
    .get(`/favorites/${user_id}`)
    .then(res => res.data);
}