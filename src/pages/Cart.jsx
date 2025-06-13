// src/pages/Cart.jsx
import React, { useEffect } from 'react';
import { useCart } from '../hooks/useCart';
import CartItem from '../components/CartItem';
import CartSummary from '../components/CartSummary';

export default function CartPage() {
  const { items, loading, error, changeQuantity, removeItem } = useCart();

  useEffect(() => {
    document.title = '장바구니 | 하이파이브';

    // 컴포넌트가 언마운트될 때 실행될 클린업 함수
    return () => {
      document.title = '하이파이브'; // 기본 제목으로 복원
    };
  }, []);
  
  return (
    <main className="max-w-screen-lg mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">장바구니</h1>

      {loading ? (
        <p>장바구니를 불러오는 중…</p>
      ) : error || items.length === 0 ? ( // 에러가 있거나 아이템이 없을 경우 "비어 있습니다" 표시
        <p>장바구니가 비어 있습니다.</p>
      ) : (
        <div className="md:flex md:space-x-6">
          {/* 아이템 그룹 없이 단순 리스트 */}
          <div className="md:flex-1 space-y-4">
            {items.map(item => (
              <CartItem
                key={item.product_id}
                item={item}
                onQuantityChange={changeQuantity}
                onRemove={removeItem}
              />
            ))}
          </div>

          {/* 요약 섹션 */}
          <div className="md:w-80">
            <CartSummary items={items} loading={loading} />
          </div>
        </div>
      )}
    </main>
  );
}
