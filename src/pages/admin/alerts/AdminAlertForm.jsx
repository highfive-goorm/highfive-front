// src/pages/admin/alerts/AdminAlertForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminHeader from '../AdminHeader';
import {
  getAlertById,
  createAlert,
  updateAlert,
} from './alertApi';

export default function AdminAlertForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    content: '',
    is_global: true,
  });

  useEffect(() => {
    if (id) {
      getAlertById(id)
        .then(data => {
          setForm({
            title: data.title,
            content: data.content,
            is_global: data.is_global,
          });
        })
        .catch(err => {
          console.error(err);
          alert('공지 정보를 불러오는데 실패했습니다.');
        });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await updateAlert(id, form);
      } else {
        await createAlert(form);
      }
      navigate('/admin/alerts');
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
          {id ? '공지 수정' : '새 공지 등록'}
        </h1>
        <form
          onSubmit={handleSubmit}
          className="max-w-lg mx-auto bg-white p-6 border border-gray-300 rounded"
        >
          <div className="mb-4">
            <label className="block text-gray-800 mb-2">제목</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-800 mb-2">내용</label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              required
              rows="6"
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              name="is_global"
              checked={form.is_global}
              onChange={handleChange}
              id="is_global"
              className="mr-2"
            />
            <label htmlFor="is_global" className="text-gray-800">
              전체공지 설정
            </label>
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
              onClick={() => navigate('/admin/alerts')}
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
