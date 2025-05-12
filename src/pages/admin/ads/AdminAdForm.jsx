// src/pages/admin/ads/AdminAdForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminHeader from '../AdminHeader';
import {
  getAd,
  createAd,
  updateAd,
} from './adApi';

export default function AdminAdForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    img_url: '',
    start_time: '',
    end_time: '',
  });

  useEffect(() => {
    if (id) {
      getAd(id)
        .then(data => {
          setForm({
            name: data.name,
            img_url: data.img_url,
            start_time: data.start_time.slice(0, 10),
            end_time: data.end_time.slice(0, 10),
          });
        })
        .catch(err => {
          console.error(err);
          alert('광고 정보를 불러오는데 실패했습니다.');
        });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await updateAd(id, form);
      } else {
        await createAd(form);
      }
      navigate('/admin/ads');
    } catch (err) {
      console.error(err);
      alert('저장에 실패했습니다.');
    }
  };

  return (
    <>
      <AdminHeader />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-6">
          {id ? '광고 수정' : '새 광고 등록'}
        </h1>
        <form
          onSubmit={handleSubmit}
          className="max-w-lg mx-auto bg-white p-6 border border-gray-300 rounded"
        >
          <div className="mb-4">
            <label className="block text-gray-800 mb-2">광고 이름</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-800 mb-2">이미지 URL</label>
            <input
              type="url"
              name="img_url"
              value={form.img_url}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-800 mb-2">시작일</label>
              <input
                type="date"
                name="start_time"
                value={form.start_time}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-gray-800 mb-2">종료일</label>
              <input
                type="date"
                name="end_time"
                value={form.end_time}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>
          <div className="flex justify-center space-x-4">
            <button
              type="submit"
              className="bg-black text-white py-2 px-6 rounded hover:bg-gray-800"
            >
              {id ? '수정 완료' : '등록'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/ads')}
              className="bg-gray-500 text-white py-2 px-6 rounded hover:bg-gray-400"
            >
              취소
            </button>
          </div>
        </form>
      </main>
    </>
  );
}
