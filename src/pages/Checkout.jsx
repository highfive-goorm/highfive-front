import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api'; // axios 인스턴스
import { useAuth } from '../context/AuthContext';

export default function Checkout() {
  const location = useLocation();
  const items = location.state?.items || [];
  const { user } = useAuth(); // 로그인된 유저 정보 (user_id 포함)
  const [address, setAddress] = useState(''); // 유저 주소 상태

  // 유저 주소 가져오기
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`https://68144d36225ff1af162871b7.mockapi.io/signup/${user.user_id}`);
        setAddress(res.data.address || '주소 정보 없음');
      } catch (err) {
        console.error('주소 가져오기 실패:', err);
        setAddress('주소 로드 실패');
      }
    };

    if (user?.user_id) {
      fetchUser();
    }
  }, [user]);

  const subtotal = items.reduce((sum, i) => sum + i.ori_price * i.quantity, 0);
  const discount = items.reduce((sum, i) => {
    return sum + (i.ori_price - i.price) * i.quantity;
  }, 0);
  const shipping = (subtotal - discount) >= 30000 ? 0 : 3000;
  const total = subtotal - discount + shipping;
  const discountRate = discount > 0 ? Math.floor((discount / subtotal) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto p-6 flex flex-col md:flex-row gap-8">
      {/* 왼쪽: 배송 정보 + 상품 목록 */}
      <div className="md:w-2/3 space-y-6">
        {/* 배송지 */}
        <div className="border p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">배송지</h2>
          <p className="text-sm text-gray-700">{address}</p>
        </div>

        {/* 상품 목록 */}
        <div className="border p-4 rounded">
          <h2 className="text-lg font-semibold mb-4">주문 상품 {items.length}개</h2>
          {items.map((item) => (
            <div key={item.product_id} className="flex items-center border-b pb-4 mb-4 last:mb-0 last:border-0">
              <img src={item.img_url} alt={item.name} className="w-20 h-20 object-cover rounded" />
              <div className="ml-4">
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {item.ori_price && item.ori_price > item.price ? (
                    <>
                      <span className="line-through mr-2 text-gray-400">
                        {(item.ori_price * item.quantity).toLocaleString()}원
                      </span>
                      <span className="text-black font-bold">
                        {(item.price * item.quantity).toLocaleString()}원
                      </span>
                    </>
                  ) : (
                    <span className="text-black font-bold">
                      {(item.price * item.quantity).toLocaleString()}원
                    </span>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 오른쪽: 결제 금액 */}
      <div className="md:w-1/3 border rounded-lg p-6 bg-white h-fit">
        <h3 className="font-semibold text-lg mb-4">결제 금액</h3>

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
              {discountRate > 0 ? `${discountRate}%` : ''}
            </span>
            {total.toLocaleString()}원
          </span>
        </div>

        <button
          disabled={items.length === 0}
          className={`w-full py-2 mt-6 rounded-lg text-white font-medium ${
            items.length
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          결제 진행하기
        </button>
      </div>
    </div>
  );
}
