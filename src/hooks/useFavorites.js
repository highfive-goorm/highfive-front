// src/hooks/useFavorites.js
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserLikedProducts } from '../api/likes'; // API 함수 임포트

export function useFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]); // 좋아요한 상품 목록
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user && user.user_id) {
      setIsLoading(true);
      setError(null);
      getUserLikedProducts(user.user_id)
        .then(data => {
          // data.like_products는 {id, name, img_url} 형태의 배열
          setFavorites(data.like_products || []);
        })
        .catch(err => {
          console.error("즐겨찾기 목록 조회 실패:", err.response?.data || err.message);
          setError("즐겨찾기 목록을 불러오는데 실패했습니다.");
          setFavorites([]); // 에러 시 빈 배열로 설정
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      // 비로그인 시 또는 사용자 ID가 없을 경우
      setFavorites([]);
      setIsLoading(false);
      setError(null); // 에러 상태도 초기화
    }
  }, [user]); // user 정보가 변경되면 (로그인/로그아웃 등) 다시 로드

  return { favorites, isLoading, error };
}