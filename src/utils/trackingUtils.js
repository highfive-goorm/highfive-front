// src/utils/trackingUtils.js
import { v4 as uuidv4 } from 'uuid';

const ANONYMOUS_ID_KEY = 'highfive_anonymous_id'; // session.js에서 이동
const PREVIOUS_PATH_KEY = 'highfive_previous_path';
const LANDING_URL_KEY = 'highfive_landing_url';

export const getAnonymousId = () => {
  let anonymousId = localStorage.getItem(ANONYMOUS_ID_KEY);
  if (!anonymousId) {
    anonymousId = uuidv4(); // uuid 라이브러리 사용
    localStorage.setItem(ANONYMOUS_ID_KEY, anonymousId);
  }
  return anonymousId;
};

export const getLandingUrl = () => {
  return sessionStorage.getItem(LANDING_URL_KEY);
};

export const setLandingUrl = () => {
  // 세션 시작 시 한 번만 설정하거나, 현재 페이지가 랜딩 페이지인 경우 설정
  // 여기서는 앱 로드 시 한 번 호출된다고 가정
  if (!sessionStorage.getItem(LANDING_URL_KEY)) {
    sessionStorage.setItem(LANDING_URL_KEY, window.location.href);
  }
};

export const getPreviousPath = () => {
  return sessionStorage.getItem(PREVIOUS_PATH_KEY) || null;
};

export const setPreviousPath = (path) => {
  sessionStorage.setItem(PREVIOUS_PATH_KEY, path);
};


// UTM 파라미터 파싱 함수 (추후 확장용)
// export const getUtmParams = () => {
//   const params = new URLSearchParams(window.location.search);
//   const utm = {};
//   for (const [key, value] of params) {
//     if (key.startsWith('utm_')) {
//       utm[key] = value;
//     }
//   }
//   return Object.keys(utm).length > 0 ? utm : null;
// };