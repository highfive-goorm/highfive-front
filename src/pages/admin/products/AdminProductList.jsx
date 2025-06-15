// src/pages/admin/products/AdminProductList.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from '../AdminHeader';
import { getProducts, deleteProduct } from './productApi';

export default function AdminProductList() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
      alert('상품 목록을 불러오는데 실패했습니다.');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await deleteProduct(id);
        fetchProducts();
      } catch (err) {
        console.error(err);
        alert('삭제에 실패했습니다.');
      }
    }
  };

  return (
    <>
      <AdminHeader />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-6">상품 관리</h1>
        <div className="mb-4">
          <button
            onClick={() => navigate('/admin/products/new')}
            className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800"
          >
            새 상품 등록
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead className="bg-black text-white">
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">이름</th>
                <th className="px-4 py-2">브랜드</th>
                <th className="px-4 py-2">액션</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className="text-center border-t border-gray-200">
                  <td className="px-4 py-2">{p.id}</td>
                  <td className="px-4 py-2">{p.name}</td>
                  <td className="px-4 py-2">{p.brand}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => navigate(`/admin/products/${p.id}`)}
                      className="bg-black text-white py-1 px-3 rounded hover:bg-gray-800"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-500"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}
