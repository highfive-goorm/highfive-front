// src/config.js
let apiBaseUrl = process.env.NODE_ENV === 'development' 
  ? process.env.REACT_APP_API_BASE_URL 
  : ''; // 초기값 (config.json 로드 전)
let serviceHostUrl = process.env.NODE_ENV === 'development' 
  ? process.env.REACT_APP_SERVICE_HOST_URL 
  : ''; // 초기값

// KAKAO_SECRET_KEY는 빌드 시점에 process.env에 포함되어 있으므로 직접 사용
export const KAKAO_SECRET_KEY = process.env.REACT_APP_KAKAO_SECRET_KEY; 

export const getApiBaseUrl = () => apiBaseUrl;
export const getServiceHostUrl = () => serviceHostUrl;

export const loadAppConfig = async () => {
  if (process.env.NODE_ENV === 'production') { // 프로덕션 모드에서만 config.json 로드
    try {
      const response = await fetch('/config.json');
      // ... (이전과 동일한 config.json 로드 및 값 할당 로직) ...
      // 예:
      if (response.ok) {
        const config = await response.json();
        if (config.REACT_APP_API_BASE_URL && config.REACT_APP_API_BASE_URL !== "__API_BASE_URL_PLACEHOLDER__") {
          apiBaseUrl = config.REACT_APP_API_BASE_URL;
        }
        if (config.REACT_APP_SERVICE_HOST_URL && config.REACT_APP_SERVICE_HOST_URL !== "__SERVICE_HOST_URL_PLACEHOLDER__") {
          serviceHostUrl = config.REACT_APP_SERVICE_HOST_URL;
        }
      }
    } catch (error) { /* ... */ }
  }
  // 로드된 값 또는 기본/개발 값 로깅 (선택 사항)
  console.log("Final API Base URL:", getApiBaseUrl());
  console.log("Final Service Host URL:", getServiceHostUrl());
  if(KAKAO_SECRET_KEY) console.log("Kakao Secret Key available");
};