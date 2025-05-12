// src/pages/admin/AdminHeader.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import api from '../../api/index'; // axios 인스턴스

export default function AdminHeader() {
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window !== 'undefined' && !sessionStorage.getItem('adminId')) {
      navigate('/admin', { replace: true });
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await api.post('/admin/logout');
    } catch (error) {
      console.error('로그아웃 오류:', error);
    } finally {
      sessionStorage.removeItem('adminId');
      navigate('/admin');
    }
  };

  return (
    <header className="bg-black w-full h-[150px] flex items-center justify-between px-5 box-border">
      {/* 네비게이션 */}
      <nav className="flex items-center space-x-6">
        <Link
          to="/admin/dashboard"
          className="text-white text-xl px-4 py-2 transition-colors duration-300 rounded"
        >
          Dashboard
        </Link>
        <Link
          to="/admin/products"
          className="text-white text-xl px-4 py-2 transition-colors duration-300 rounded hover:bg-gray-100 hover:text-black"
        >
          상품관리
        </Link>
        <Link
          to="/admin/ads"
          className="text-white text-xl px-4 py-2 transition-colors duration-300 rounded hover:bg-gray-100 hover:text-black"
        >
          광고관리
        </Link>
        <Link
          to="/admin/alerts"
          className="text-white text-xl px-4 py-2 transition-colors duration-300 rounded hover:bg-gray-100 hover:text-black"
        >
          공지관리
        </Link>
      </nav>

      {/* 로그아웃 */}
      <button
        onClick={handleLogout}
        className="text-white text-base border border-gray-100 px-6 py-2 rounded-full transition-colors duration-300 hover:bg-gray-100 hover:text-gray-800"
      >
        로그아웃
      </button>
    </header>
  );
}