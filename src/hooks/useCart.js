// src/hooks/useCart.js
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  fetchCart,
  updateCartItemQuantity,
  removeCartItem,
} from '../api/cart';
import { useTracking } from './useTracking';

export function useCart() {
  const { user } = useAuth();
  const user_id = user?.user_id;

  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const { trackEvent } = useTracking();

  const loadCart = useCallback(() => {
    if (!user_id) return;
    setLoading(true);
    fetchCart(user_id)
      .then(cart_items => {
        setItems(cart_items);
        setError(null);
      })
      .catch(err => {
        console.error('장바구니 조회 실패', err);
        setItems([]);
        setError('장바구니를 불러오는 중 오류가 발생했습니다.');
      })
      .finally(() => setLoading(false));
  }, [user_id]);

  // 페이지 로드 및 user_id 변경 시 한번만 불러오기
  useEffect(loadCart, [loadCart]);

  // 수량 변경 → 다시 불러오기
  const changeQuantity = (product_id, new_quantity) => {
    const item = items.find(i => i.product_id === product_id);
    if (item) {
      trackEvent('change_cart_item_quantity', {
        product_id: String(product_id),
        previous_quantity: item.quantity,
        new_quantity: new_quantity,
        discounted_price: item.discounted_price,
      });
    }
    return updateCartItemQuantity(user_id, product_id, new_quantity)
      .then(loadCart)
      .catch(err => {
        console.error('수량 변경 실패', err);
        // 필요시 에러 처리
        // 실패 시 롤백 트래킹 또는 사용자 알림
      });
  };

  // 항목 삭제 → 다시 불러오기
  const removeItem = (product_id) => {
    const item = items.find(i => i.product_id === product_id);
    if (item) {
      trackEvent('remove_from_cart', {
        product_id: String(product_id),
        quantity_at_remove: item.quantity,
      });
    }
    return removeCartItem(user_id, product_id)
      .then(loadCart)
      .catch(err => {
        console.error('항목 삭제 실패', err);
        // 필요시 에러 처리
        // 실패 시 롤백 트래킹 또는 사용자 알림
      });
  };

  return { items, loading, error, changeQuantity, removeItem };
}