// src/pages/admin/products/AdminProductForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminHeader from '../AdminHeader';
import {
  getProduct,
  createProduct,
  updateProduct,
} from './productApi';

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    brand: '',
    cost: '',
    discount_rate: '',
    img_url: '',
    gender: 'U',
    main_category: '',
    sub_category: '',
  });

  useEffect(() => {
    if (id) {
      getProduct(id)
        .then(data => {
          setForm({
            name: data.name,
            brand: data.brand,
            cost: data.cost,
            discount_rate: data.discount_rate,
            img_url: data.img_url,
            gender: data.gender,
            main_category: data.main_category,
            sub_category: data.sub_category,
          });
        })
        .catch(err => {
          console.error(err);
          alert('상품 정보를 불러오는데 실패했습니다.');
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
        await updateProduct(id, form);
      } else {
        await createProduct(form);
      }
      navigate('/admin/products');
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
          {id ? '상품 수정' : '새 상품 등록'}
        </h1>
        <form
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto bg-white p-6 border border-gray-300 rounded"
        >
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-800 mb-2">상품명</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-gray-800 mb-2">브랜드</label>
              <input
                type="text"
                name="brand"
                value={form.brand}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-800 mb-2">원가</label>
              <input
                type="number"
                name="cost"
                value={form.cost}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-gray-800 mb-2">할인률(%)</label>
              <input
                type="number"
                name="discount_rate"
                value={form.discount_rate}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
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
              <label className="block text-gray-800 mb-2">성별</label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="M">남성(M)</option>
                <option value="F">여성(F)</option>
                <option value="U">공용(U)</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-800 mb-2">대분류</label>
              <input
                type="text"
                name="main_category"
                value={form.main_category}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-800 mb-2">소분류</label>
            <input
              type="text"
              name="sub_category"
                value={form.sub_category}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-black"
            />
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
              onClick={() => navigate('/admin/products')}
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
