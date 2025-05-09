// src/pages/mypage/Orders.jsx
import React from 'react';
import { Link }      from 'react-router-dom';
import { useOrders } from '../../hooks/useOrders';

// status 코드 → 레이블 매핑
const STATUS_LABEL = {
  shipping:  '배송중',
  delivered: '배송완료',
  refunded:  '환불완료'
};

export default function OrdersPage() {
  const { orders, refund } = useOrders();

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h2 className="text-xl font-semibold mb-6">주문 내역</h2>

      {orders.length === 0 ? (
        <p>주문 내역이 없습니다.</p>
      ) : (
        <ul className="space-y-6">
          {orders.map(o => (
            <li key={o.id} className="p-4 border rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">주문 번호: {o.id}</span>
                <span className="text-sm text-gray-500">
                  {o.created_at}
                </span>
              </div>

              {/* 상품 리스트 */}
              <p className="text-sm text-gray-700">
                상품:{' '}
                {o.items.map(item => (
                  <span key={item.name} className="inline-block ml-2">
                    {item.name} x{item.quantity}
                  </span>
                ))}
              </p>

              {/* 총액 · 상태 */}
              <div className="flex justify-between items-center">
                <p className="font-semibold">총액: ₩{o.total.toLocaleString()}</p>
                <p className="px-2 py-1 text-sm rounded 
                  {o.status === 'shipping' ? 'bg-yellow-100 text-yellow-800' :
                   o.status === 'delivered'? 'bg-green-100 text-green-800' :
                   'bg-red-100 text-red-800'}">
                  {STATUS_LABEL[o.status] || o.status}
                </p>
              </div>

              {/* 환불 버튼 */}
              <div className="text-right">
                <button
                  onClick={() => refund(o.id)}
                  disabled={o.status === 'refunded'}
                  className={`px-4 py-1 text-sm rounded
                    ${o.status === 'refunded'
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : 'bg-red-600 text-white hover:bg-red-700'}`}
                >
                  환불
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-8">
        <Link to="/mypage" className="text-blue-600 hover:underline">
          ← 마이페이지로 돌아가기
        </Link>
      </div>
    </main>
  );
}
