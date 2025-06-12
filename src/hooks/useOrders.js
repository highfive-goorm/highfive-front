// src/hooks/useOrders.js
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchOrders, updateOrderStatus } from '../api/orders';

export function useOrders() {
  const { user } = useAuth();
  const user_id = user?.user_id;

  const [orders, setOrders] = useState([]);

  const reload = useCallback(() => {
    if (!user_id) return;
    fetchOrders(user_id)
      .then(raw => {
        // API 리턴값을 UI가 쓰기 좋은 형태로 매핑
        const mapped = raw.map(o => ({
          ...o,
          items: o.order_items || [],             // order_items → items
          total: o.total_price != null ? o.total_price : 0, // total_price → total
        }));
        setOrders(mapped);
      })
      .catch(console.error);
  }, [user_id]);

  useEffect(() => {
    reload();
  }, [reload]);

  const cancel = order_id =>
    updateOrderStatus(order_id, { status: 'cancelled' }).then(() => reload());

  return { orders, cancel };
}
