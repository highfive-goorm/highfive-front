// src/hooks/useCart.js
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  fetchCart,
  updateCartItemQuantity,
  removeCartItem,
} from '../api/cart';

export function useCart() {
  const { user } = useAuth();
  const user_id = user?.user_id;

  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

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
  const changeQuantity = (product_id, qty) =>
    updateCartItemQuantity(user_id, product_id, qty)
      .then(loadCart)
      .catch(err => {
        console.error('수량 변경 실패', err);
        // 필요시 에러 처리
      });

  // 항목 삭제 → 다시 불러오기
  const removeItem = (product_id) =>
    removeCartItem(user_id, product_id)
      .then(loadCart)
      .catch(err => {
        console.error('항목 삭제 실패', err);
        // 필요시 에러 처리
      });

  return { items, loading, error, changeQuantity, removeItem };
}

// // src/hooks/useCart.js
// import { useState, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext';
// import {
//   fetchCart,
//   updateCartItemQuantity,
//   removeCartItem,
// } from '../api/cart';
// import { fetchProducts, fetchBrands } from '../api/product'; // 변경된 부분

// export function useCart() {
//   const { user } = useAuth();
//   const user_id = user?.user_id;

//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   const enrichCartItems = async (rawItems) => {
//     try {
//       const [products, brands] = await Promise.all([
//         fetchProducts(),
//         fetchBrands(),
//       ]);

//       return rawItems.map(item => {
//         const product = products.find(p => String(p.id) === String(item.product_id));
//         const brand = brands.find(b => String(b.id) === String(product?.brand_id)) || {};
//         return {
//           ...item,
//           name: product?.name || '알 수 없음',
//           price: product?.price ?? 0,
//           discounted_price: product?.discounted_price ?? product?.price ?? 0,
//           discount: product?.discount ?? 0,
//           img_url: product?.img_url || '',
//           brand_kor: brand?.brand_kor || '기타',
//           brand_id: brand?.id,
//         };
//       });
//     } catch (err) {
//       console.error("enrich 실패", err);
//       return rawItems;
//     }
//   };

//   const loadCart = () => {
//     if (!user_id) return;
//     setLoading(true);
//     fetchCart(user_id)
//       .then(async data => {
//         if (Array.isArray(data)) {
//           const userItems = data.filter(item => String(item.user_id) === String(user_id));
//           const enriched = await enrichCartItems(userItems);
//           setItems(enriched);
//           setError('');
//         } else {
//           setItems([]);
//           setError('장바구니 데이터를 불러오는 데 문제가 발생했습니다.');
//         }
//       })
//       .catch(err => {
//         const status = err?.response?.status;
//         if (status === 404) {
//           setItems([]);
//           setError('');
//         } else {
//           setItems([]);
//           setError('장바구니를 불러오는 중 오류가 발생했습니다.');
//         }
//       })
//       .finally(() => setLoading(false));
//   };

//   const changeQuantity = (item_id, qty) =>
//     updateCartItemQuantity(item_id, qty).then(loadCart);

//   const removeItem = item_id =>
//     removeCartItem(item_id).then(loadCart);

//   useEffect(loadCart, [user_id]);

//   return { items, loading, error, changeQuantity, removeItem };
// }
