import api from './index';

const USE_STUB = process.env.REACT_APP_USE_STUB === 'true';

// 메모리 상에서 동작할 스텁용 데이터 저장소
let stub_items = [
  {
    product_id: 'p1',
    name: '더미 상품 1',
    price: 10000,
    quantity: 2,
    img_url: '/images/dummy1.png',
  },
  {
    product_id: 'p2',
    name: '더미 상품 2',
    price: 25000,
    quantity: 1,
    img_url: '/images/dummy2.png',
  },
];

// 유저 cart 조회
// GET /cart/{user_id}
export function fetchCart(user_id) {
  if (USE_STUB) {
    return new Promise((res) => {
      setTimeout(() => res([...stub_items]), 200);
    });
  }
  return api.get(`/carts/${user_id}`).then(res => res.data);
}

// 상품 수량 추가
// 이거 하기로 했는지 아닌지 까먹었음. 일단 써놓고 보기
// PATCH /cart/{user_id}/{product_id}
export function updateCartItemQuantity(user_id, product_id, quantity) {
  if (USE_STUB) {
    return new Promise((res) => {
      setTimeout(() => {
        // 메모리상의 항목 업데이트
        stub_items = stub_items.map(item =>
          item.product_id === product_id
            ? { ...item, quantity }
            : item
        );
        res();
      }, 100);
    })
    .then(() => fetchCart(user_id));  // 다시 fetchCart 실행하면 바뀐 stub_items 반환
  }
  return api
    .patch(`/cart/${user_id}/${product_id}`, { quantity })
    .then(res => res.data);
}

// 상품 삭제
// DELETE /cart/{account}/{product_id}
export function removeCartItem(user_id, product_id) {
  if (USE_STUB) {
    return new Promise((res) => {
      setTimeout(() => {
        // 메모리상의 항목 제거
        stub_items = stub_items.filter(item => item.product_id !== product_id);
        res();
      }, 100);
    })
    .then(() => fetchCart(user_id));  // 다시 fetchCart 실행하면 바뀐 stub_items 반환
  }
  return api
    .delete(`/cart/${user_id}/${product_id}`)
    .then(res => res.data);
}
