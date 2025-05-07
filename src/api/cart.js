// src/api/cart.js

import api from './index';

const USE_STUB = process.env.REACT_APP_USE_STUB === 'true';

// 메모리 상에서 동작할 스텁용 데이터 저장소
let stubItems = [
  {
    productId: 'p1',
    name: '더미 상품 1',
    price: 10000,
    quantity: 2,
    imageUrl: '/card_bg01.jpg',
  },
  {
    productId: 'p2',
    name: '더미 상품 2',
    price: 25000,
    quantity: 1,
    imageUrl: '/card_bg02.jpg',
  },
];

export function fetchCart(account) {
  if (USE_STUB) {
    return new Promise((res) => {
      setTimeout(() => res([...stubItems]), 200);
    });
  }
  return api.get(`/cart/${account}`).then(res => res.data);
}

export function updateCartItemQuantity(account, productId, quantity) {
  if (USE_STUB) {
    return new Promise((res) => {
      setTimeout(() => {
        // 메모리상의 항목 업데이트
        stubItems = stubItems.map(item =>
          item.productId === productId
            ? { ...item, quantity }
            : item
        );
        res();
      }, 100);
    })
    .then(() => fetchCart(account));  // 다시 fetchCart 실행하면 바뀐 stubItems 반환
  }
  return api
    .patch(`/cart/${account}/${productId}`, { quantity })
    .then(res => res.data);
}

export function removeCartItem(account, productId) {
  if (USE_STUB) {
    return new Promise((res) => {
      setTimeout(() => {
        // 메모리상의 항목 제거
        stubItems = stubItems.filter(item => item.productId !== productId);
        res();
      }, 100);
    })
    .then(() => fetchCart(account));  // 다시 fetchCart 실행하면 바뀐 stubItems 반환
  }
  return api
    .delete(`/cart/${account}/${productId}`)
    .then(res => res.data);
}
