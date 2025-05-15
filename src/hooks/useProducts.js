// src/hooks/useProducts.js
import { useState, useEffect } from 'react';
import { fetchProducts } from '../api/product';

export function useProducts(name = '') {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    let canceled = false;
    setLoading(true);
    setError(null);
    setProducts([]);
    
    fetchProducts(name)
      .then(data => {
        if (!canceled) setProducts(data);
      })
      .catch(err => {
        console.error('상품 조회 실패', err);
        if (!canceled) setError(err);
      })
      .finally(() => {
        if (!canceled) setLoading(false);
      });
    return () => { canceled = true; };
  }, [name]);

  return { products, loading, error };
}
