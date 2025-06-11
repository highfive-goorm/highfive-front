// src/hooks/useProducts.js
import { useState, useEffect } from 'react';
import { fetchProducts } from '../api/product';

/**
 * 상품 목록 및 총 개수를 가져오는 커스텀 훅
 * @param {string} name - 검색어
 * @param {number} page - 페이지 번호
 * @param {number} size - 페이지 크기
 * @param {object} filters - 필터 객체 (예: { gender: 'F', category: 'outer' })
 */
export function useProducts(name = '', page = 1, size = 15, filters = { gender: '', category: '' }) {
  const [items, setItems]     = useState([]);
  const [total, setTotal]     = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    let canceled = false;
    setLoading(true);
    setError(null);

    // 수정된 fetchProducts 함수에 filters 객체 그대로 전달
    fetchProducts(name, page, size, filters)
      .then(({ total, items }) => {
        if (!canceled) {
          setTotal(total || 0); // total이 null/undefined일 경우 대비
          setItems(items || []);  // items가 null/undefined일 경우 대비
        }
      })
      .catch(err => {
        if (!canceled) {
          console.error("Error fetching products:", err); // 에러 로깅 추가
          setError(err);
          setItems([]); // 에러 발생 시 빈 배열로 설정
          setTotal(0);  // 에러 발생 시 총 개수 0으로 설정
        }
      })
      .finally(() => {
        if (!canceled) setLoading(false);
      });

    return () => { canceled = true; };
  }, [name, page, size, filters]); // 의존성 배열에 filters 추가 (객체이므로 참조 변경 시 재실행 주의)

  return { items, total, loading, error };
}