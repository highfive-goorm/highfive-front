// src/components/CartSummary.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnalytics } from '../hooks/useAnalytics';

/**
 * @param {Object[]} items         // [{ product_id, quantity, price, discounted_price, discount, name, img_url }]
 * @param {boolean}  loading
 */
export default function CartSummary({ items, loading }) {
  const navigate = useNavigate();
  const { track } = useAnalytics();

  const subtotal = items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );
  const discount = items.reduce(
    (sum, i) => sum + (i.price - i.discounted_price) * i.quantity,
    0
  );
  const shipping = subtotal - discount >= 30000 ? 0 : 3000;
  const total = subtotal - discount + shipping;
  const rate =
    discount > 0
      ? Math.floor((discount / (subtotal + discount)) * 100)
      : 0;

  const handleCheckout = () => {
    if (loading || items.length === 0) return;

    track('checkout', {
      product_ids: items.map(i => i.product_id),
      total,
    });

    navigate('/checkout', {
      state: {
        items,
        is_from_cart: true,
      },
    });
  };

  return (
    <div className="p-4 border rounded-lg bg-white mt-6 text-sm leading-relaxed">
      <h2 className="font-semibold mb-4 text-base">구매 금액</h2>

      <div className="flex justify-between mb-2">
        <span>상품 금액</span>
        <span>{subtotal.toLocaleString()}원</span>
      </div>

      <div className="flex justify-between mb-2">
        <span>할인 금액</span>
        <span className="text-blue-600">-{discount.toLocaleString()}원</span>
      </div>

      <div className="flex justify-between mb-4">
        <span>배송비</span>
        <span>{shipping === 0 ? '무료배송' : `${shipping.toLocaleString()}원`}</span>
      </div>

      <div className="flex justify-between items-center mt-4 border-t pt-4 font-semibold text-lg">
        <span className="text-gray-600">총 결제 금액</span>
        <span>
          <span className="text-red-500 text-sm mr-1">
            {rate > 0 ? `${rate}%` : ''}
          </span>
          {total.toLocaleString()}원
        </span>
      </div>

      <button
        onClick={handleCheckout}
        disabled={loading || items.length === 0}
        className="w-full py-2 bg-black text-white rounded hover:bg-gray-800"
      >
        결제하기
      </button>
    </div>
  )
}
