import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnalytics } from '../hooks/useAnalytics';

export default function CartSummary({ items, loading }) {
  const navigate = useNavigate();
  const { track } = useAnalytics();

  // 금액 계산
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const discount = items.reduce((sum, i) => {
    const ori_price = i.ori_price || i.price;
    return sum + (ori_price - i.price) * i.quantity;
  }, 0);
  const shipping = subtotal >= 30000 ? 0 : 3000;
  const total = subtotal + shipping;
  const rate = discount > 0 ? Math.floor((discount / (subtotal + discount)) * 100) : 0;

  // 결제 페이지 이동
  const handleCheckout = () => {
    // 분석 로그
    track('checkout', {
      product_ids: items.map(i => i.product_id),
      total,
    });

    // Checkout 페이지로 상품 정보 전달
    navigate('/checkout', {
      state: {
        items,
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
