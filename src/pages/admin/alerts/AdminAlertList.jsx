// src/pages/admin/alerts/AdminAlertList.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from '../AdminHeader';
import { getAlerts, deleteAlert } from './alertApi';

export default function AdminAlertList() {
  const [alerts, setAlerts] = useState([]);
  const navigate = useNavigate();

  const fetchAlerts = async () => {
    try {
      const data = await getAlerts();
      setAlerts(data);
    } catch (err) {
      console.error(err);
      alert('공지 목록을 불러오는데 실패했습니다.');
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await deleteAlert(id);
        fetchAlerts();
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
        <h1 className="text-2xl font-semibold mb-6">공지사항 관리</h1>
        <div className="mb-4">
          <button
            onClick={() => navigate('/admin/alerts/new')}
            className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800"
          >
            새 공지 등록
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead className="bg-black text-white">
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">제목</th>
                <th className="px-4 py-2">전체공지</th>
                <th className="px-4 py-2">액션</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map(alert => (
                <tr key={alert.id} className="text-center border-t border-gray-200">
                  <td className="px-4 py-2">{alert.id}</td>
                  <td className="px-4 py-2">{alert.title}</td>
                  <td className="px-4 py-2">
                    {alert.is_global ? '✔' : '✘'}
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => navigate(`/admin/alerts/${alert.id}`)}
                      className="bg-black text-white py-1 px-3 rounded hover:bg-gray-800"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(alert.id)}
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
