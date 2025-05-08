import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  fetchCart,
  updateCartItemQuantity,
  removeCartItem,
} from '../api/cart';

export function useCart() {
  const { user } = useAuth();
  const user_id = user?.user_id;   // ← 이제 user_id 사용. user가 없을 때 undefined를 반환함

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadCart = () => {
    if (!user_id) return;
    setLoading(true);
    fetchCart(user_id)
      .then(data => setItems(data))
      .catch(() => setError('장바구니를 불러오는 중 오류가 발생했습니다.'))
      .finally(() => setLoading(false));
  };

  const changeQuantity = (product_id, qty) =>
    updateCartItemQuantity(user_id, product_id, qty).then(loadCart);

  const removeItem = product_id =>
    removeCartItem(user_id, product_id).then(loadCart);

  useEffect(loadCart, [user_id]);

  return { items, loading, error, changeQuantity, removeItem };
}
