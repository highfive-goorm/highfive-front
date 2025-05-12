// src/pages/admin/Dashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from './AdminHeader';

export default function Dashboard() {
  const nav = useNavigate();

  return (
    <>
      <AdminHeader />

      <main className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-semibold mb-6">관리자 대시보드</h1>
        <div className="space-y-4">
          <button
            onClick={() => nav('/admin/products')}
            className="block w-64 mx-auto py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            상품 관리
          </button>
          <button
            onClick={() => nav('/admin/ads')}
            className="block w-64 mx-auto py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            광고 관리
          </button>
          <button
            onClick={() => nav('/admin/alerts')}
            className="block w-64 mx-auto py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            공지 관리
          </button>
        </div>
      </main>
    </>
  );
}
