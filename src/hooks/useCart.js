import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  fetchCart,
  updateCartItemQuantity,
  removeCartItem,
} from '../api/cart';

export function useCart() {
  const { user } = useAuth();
  const account = user?.account;   // ← 이제 user.account 사용. user가 없을 때 undefined를 반환함

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadCart = () => {
    if (!account) return;
    setLoading(true);
    fetchCart(account)
      .then(data => setItems(data))
      .catch(() => setError('장바구니를 불러오는 중 오류가 발생했습니다.'))
      .finally(() => setLoading(false));
  };

  const changeQuantity = (productId, qty) =>
    updateCartItemQuantity(account, productId, qty).then(loadCart);

  const removeItem = productId =>
    removeCartItem(account, productId).then(loadCart);

  useEffect(loadCart, [account]);

  return { items, loading, error, changeQuantity, removeItem };
}
