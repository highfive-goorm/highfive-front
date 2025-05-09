import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function MyPageHome() {
  const nav = useNavigate();

  return (
    <main className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-2xl font-semibold mb-6">마이페이지</h1>
      <div className="space-y-4">
        <button
          onClick={() => nav('/mypage/profile')}
          className="block w-64 mx-auto py-2 bg-black text-white rounded hover:bg-gray-800"
        >
          회원 정보 관리
        </button>
        <button
          onClick={() => nav('/mypage/orders')}
          className="block w-64 mx-auto py-2 bg-black text-white rounded hover:bg-gray-800"
        >
          주문 내역
        </button>
        <button
          onClick={() => nav('/mypage/favorites')}
          className="block w-64 mx-auto py-2 bg-black text-white rounded hover:bg-gray-800"
        >
          즐겨찾기
        </button>
      </div>
    </main>
  );
}
