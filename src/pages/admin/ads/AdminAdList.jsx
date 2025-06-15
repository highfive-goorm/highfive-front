// src/pages/admin/ads/AdminAdList.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from '../AdminHeader';
import { getAds, deleteAd } from './adApi';

export default function AdminAdList() {
  const [ads, setAds] = useState([]);
  const navigate = useNavigate();

  const fetchAds = async () => {
    try {
      const data = await getAds();
      setAds(data);
    } catch (err) {
      console.error(err);
      alert('광고 목록을 불러오는데 실패했습니다.');
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await deleteAd(id);
        fetchAds();
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
        <h1 className="text-2xl font-semibold mb-6">광고 관리</h1>
        <div className="mb-4">
          <button
            onClick={() => navigate('/admin/ads/new')}
            className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800"
          >
            새 광고 생성
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead className="bg-black text-white">
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">이름</th>
                <th className="px-4 py-2">시작일</th>
                <th className="px-4 py-2">종료일</th>
                <th className="px-4 py-2">액션</th>
              </tr>
            </thead>
            <tbody>
              {ads.map(ad => (
                <tr key={ad.id} className="text-center border-t border-gray-200">
                  <td className="px-4 py-2">{ad.id}</td>
                  <td className="px-4 py-2">{ad.name}</td>
                  <td className="px-4 py-2">
                    {new Date(ad.start_time).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">
                    {new Date(ad.end_time).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => navigate(`/admin/ads/${ad.id}`)}
                      className="bg-black text-white py-1 px-3 rounded hover:bg-gray-800"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(ad.id)}
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
