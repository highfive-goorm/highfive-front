// src/pages/mypage/Orders.jsx
import React from 'react';
import { Link }      from 'react-router-dom';
import { useOrders } from '../../hooks/useOrders';
import { useTracking } from '../../hooks/useTracking'; // 트래킹 훅 추가

// status 코드 → 레이블 매핑
const STATUS_LABEL = {
  paid:      '결제완료',
  shipping:  '배송중',
  shipped:   '배송완료',
  cancelled: '환불완료'
};

export default function OrdersPage() {
  const { orders, cancel } = useOrders();
  const { trackEvent } = useTracking(); // 트래킹 훅 사용
  const visibleOrders = orders.filter(order => order.status !== 'pending_payment');

  const handleRefundClick = (order) => {
    trackEvent('refund', {
      order_id: order._id,
      total_price: order.total,
    });
    // 기존 환불 로직 호출
    cancel(order._id);
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h2 className="text-xl font-semibold mb-6">주문 내역</h2>

      {visibleOrders.length === 0 ? (
        <p>주문 내역이 없습니다.</p>
      ) : (
        <ul className="space-y-6">
          {visibleOrders.map(o => (
            <li key={o._id} className="p-4 border rounded-lg space-y-3">
              <div className="flex justify-between items-center">
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
                  onClick={() => handleRefundClick(o)} // 수정된 핸들러 사용
                  disabled={o.status === 'cancelled'}
                  className={`px-4 py-1 text-sm rounded
                    ${o.status === 'cancelled'
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
