// src/hooks/useFavories.js (스텁)
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export function useFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  useEffect(() => {
    // 스텁 더미
    setFavorites([{ id: 1, name: '준비중' }]);
  }, []);
  return { favorites };
}