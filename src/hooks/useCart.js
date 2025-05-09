import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  fetchCart,
  updateCartItemQuantity,
  removeCartItem,
} from '../api/cart';
import products from '../api/products.json';

export function useCart() {
  const { user } = useAuth();
  const user_id = user?.user_id; // 사용자 계정 ID 기준

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const enrichCartItems = (rawItems) => {
    return rawItems.map(item => {
      const product = products.find(p => p.id === Number(item.product_id));
      return {
        ...item,
        name: product?.name || '알 수 없음',
        price: product?.price || 0,
        ori_price: product?.ori_price || null,
        img_url: product?.img_url || '',
      };
    });
  };

  const loadCart = () => {
    if (!user_id) return;
    setLoading(true);
    fetchCart(user_id)
      .then(data => setItems(enrichCartItems(data)))
      .catch(() => setError('장바구니를 불러오는 중 오류가 발생했습니다.'))
      .finally(() => setLoading(false));
  };

  const changeQuantity = (item_id, qty) =>
    updateCartItemQuantity(item_id, qty).then(loadCart);

  const removeItem = item_id =>
    removeCartItem(item_id).then(loadCart);

  useEffect(loadCart, [user_id]);

  return { items, loading, error, changeQuantity, removeItem };
}
