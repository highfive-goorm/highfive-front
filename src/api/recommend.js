// src/api/recommend.js
import api from './index';
import axios from 'axios';

const STUB_BASE_URL = 'https://6822bd75b342dce8004f37fb.mockapi.io';
const USE_STUB = process.env.REACT_APP_USE_STUB === 'true';

/**
 * 회원/비회원 추천 상품 조회
 * @param {string|null} user_id - 로그인된 유저 ID (없으면 비회원)
 * @returns {Promise<{user_account: string, recommends: Array}>}
 */
export function fetchRecommendedProducts(user_id) {
  if (USE_STUB) {
    const account = user_id || '비회원';
    return axios
      .get(`${STUB_BASE_URL}/product`)
      .then(res => res.data)
      .then(all => {
        // stub 추천 로직:
        // 비회원: 상위 6개, 회원: user_id 기반 해시로 offset 후 6개 추출
        const sorted = all.sort((a, b) => (b.like_count || 0) - (a.like_count || 0));
        let recommends;
        if (user_id) {
          // 간단 해시 함수: 유저 ID 문자열의 char code 합
          const uid = parseInt(user_id, 10) || 0;
          const maxStart = Math.max(0, sorted.length - 6);
          const start = uid % (maxStart + 1);
          recommends = sorted.slice(start, start + 6);
        } else {
          recommends = sorted.slice(0, 6);
        }
        return { user_account: account, recommends };
      });
  }
  return api
    .get(user_id ? `/recommend/${user_id}` : '/recommend/guest')
    .then(res => res.data);
}