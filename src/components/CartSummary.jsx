import React from 'react';
import { useAnalytics } from '../hooks/useAnalytics';

export default function CartSummary({ items, loading }) {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = items.length ? 3000 : 0;
  const total = subtotal + shipping;

  const { track } = useAnalytics();

  return (
    <div className="p-4 border rounded-lg bg-gray-50 mt-6">
      <div className="flex justify-between mb-2">
        <span>합계</span>
        <span>₩{subtotal.toLocaleString()}</span>
      </div>
      <div className="flex justify-between mb-4">
        <span>배송비</span>
        <span>₩{shipping.toLocaleString()}</span>
      </div>
      <div className="flex justify-between font-semibold mb-6">
        <span>총액</span>
        <span>₩{total.toLocaleString()}</span>
      </div>
      <button
        onClick={() => 
          track('checkout', {
            product_ids: items.map(i => i.product_id),
            total,
          })
        }
        disabled={loading || items.length === 0}
        className={`w-full py-2 rounded-lg text-white font-medium ${
          items.length
            ? 'bg-blue-600 hover:bg-blue-700'
            : 'bg-gray-400 cursor-not-allowed'
        }`}
      >
        결제하기
      </button>
    </div>
  );
}
