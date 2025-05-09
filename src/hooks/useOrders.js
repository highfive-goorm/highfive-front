// src/hooks/useOrders.js
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchOrders, updateOrderStatus } from '../api/orders';

export function useOrders() {
  const { user } = useAuth();
  const user_id   = user?.user_id;

  const [orders, setOrders] = useState([]);
  const reload = useCallback(() => {
    if (!user_id) return;
    fetchOrders(user_id).then(setOrders).catch(console.error);
  }, [user_id]);

  useEffect(() => {
    reload();
  }, [reload]);

  /** 주문 환불(→status='refunded') */
  const refund = order_id =>
    updateOrderStatus(order_id, 'refunded')
      .then(() => reload());

  return { orders, refund };
}
