// src/hooks/useProducts.js
import { useState, useEffect } from 'react';
import { fetchProducts } from '../api/product';

/**
 * @param {string} name 검색어
 * @param {number} page 페이지 번호
 * @param {number} size 페이지 크기
 * @param {string} category major_category 필터
 */
export function useProducts(name = '', page = 1, size = 15, category = '') {
  const [items, setItems]     = useState([]);
  const [total, setTotal]     = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    let canceled = false;
    setLoading(true);
    setError(null);

    fetchProducts(name, page, size, category)
      .then(({ total, items }) => {
        if (!canceled) {
          setTotal(total);
          setItems(items);
        }
      })
      .catch(err => {
        if (!canceled) setError(err);
      })
      .finally(() => {
        if (!canceled) setLoading(false);
      });

    return () => { canceled = true; };
  }, [name, page, size, category]);

  return { items, total, loading, error };
}
