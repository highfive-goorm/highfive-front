import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function PayCancel() {
  const navigate = useNavigate();
  return (
    <div className="p-6 text-center">
      <h2 className="text-xl font-bold text-red-500">결제가 취소되었습니다.</h2>
      <button className="mt-6 px-4 py-2 bg-gray-600 text-white rounded" onClick={() => navigate('/')}>
        홈으로 이동
      </button>
    </div>
  );
}
