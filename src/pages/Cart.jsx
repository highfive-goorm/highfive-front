import React from 'react';
import { useCart } from '../hooks/useCart';
import CartItem from '../components/CartItem';
import CartSummary from '../components/CartSummary';

export default function CartPage() {
  const { items, loading, error, changeQuantity, removeItem } = useCart();

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">장바구니</h1>

      {loading ? (
        <p>장바구니를 불러오는 중…</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : items.length === 0 ? (
        <p>장바구니가 비어 있습니다.</p>
      ) : (
        <div className="md:flex md:space-x-6">
          <div className="md:flex-1">
            {items.map(item => (
              <CartItem
                key={item.product_id}
                item={item}
                onQuantityChange={changeQuantity}
                onRemove={removeItem}
              />
            ))}
          </div>
          <div className="md:w-80">
            <CartSummary items={items} loading={loading} />
          </div>
        </div>
      )}
    </main>
  );
}
