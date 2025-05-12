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
      .then(data => {
        // 응답이 정상이라면 enrich해서 저장
        if (Array.isArray(data)) {
          const userItems = data.filter(item => Number(item.user_id) === Number(user_id));
          setItems(enrichCartItems(userItems));
          setError('');
        } else {
          // 응답이 배열이 아닌 경우는 문제로 간주
          setItems([]);
          setError('장바구니 데이터를 불러오는 데 문제가 발생했습니다.');
        }
      })
      .catch(err => {
        const status = err?.response?.status;
        if (status === 404) {
          // user_id에 대한 장바구니 데이터가 없을 경우 → 정상 처리
          setItems([]);
          setError('');
        } else {
          // 그 외 네트워크/서버 에러 → 진짜 오류로 간주
          setItems([]);
          setError('장바구니를 불러오는 중 오류가 발생했습니다.');
        }
      })
      .finally(() => setLoading(false));
  };

  const changeQuantity = (item_id, qty) =>
    updateCartItemQuantity(item_id, qty).then(loadCart);

  const removeItem = item_id =>
    removeCartItem(item_id).then(loadCart);

  useEffect(loadCart, [user_id]);

  return { items, loading, error, changeQuantity, removeItem };
}
