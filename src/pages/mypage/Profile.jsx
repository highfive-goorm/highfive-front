// src/pages/mypage/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate }        from 'react-router-dom';
import { useProfile }         from '../../hooks/useProfile';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { profile, save } = useProfile();

  const [form, setForm] = useState({
    password: '',
    age:      '',
    gender:   '',
    address:  '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  // 기존 프로필이 로드되면 age/gender/address만 채워놓기
  useEffect(() => {
    if (profile) {
      setForm(f => ({
        ...f,
        age:     profile.age || '',
        gender:  profile.gender || '',
        address: profile.address || '',
      }));
    }
  }, [profile]);

  const onChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const onCancel = () => navigate('/mypage');
  const onSubmit = async e => {
    e.preventDefault();
    setError(''); 
    setLoading(true);

    try {
      // password가 빈 문자열이면 비밀번호 미변경 처리
      const { password, age, gender, address } = form;
      await save({ password, age, gender, address });
      navigate('/mypage');
    } catch {
      setError('저장에 실패했습니다. 다시 시도해 주세요.');
      setLoading(false);
    }
  };

  return (
    <main className="max-w-lg mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">회원 정보 관리</h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={onSubmit} className="space-y-5">
        {/* 비밀번호 */}
        <div>
          <label htmlFor="password" className="block mb-1 font-medium">
            비밀번호
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={onChange}
            placeholder="변경할 비밀번호 입력"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* 나이 */}
        <div>
          <label htmlFor="age" className="block mb-1 font-medium">
            나이
          </label>
          <input
            id="age"
            name="age"
            type="number"
            value={form.age}
            onChange={onChange}
            min="0"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* 성별 (라디오 버튼) */}
        <div>
          <span className="block mb-1 font-medium">성별</span>
          <div className="flex items-center space-x-8">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="gender"
                value="M"
                checked={form.gender === 'M'}
                onChange={onChange}
                className="h-4 w-4 text-black border-gray-300 focus:ring-black"
              />
              <span className="ml-2">남성</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="gender"
                value="F"
                checked={form.gender === 'F'}
                onChange={onChange}
                className="h-4 w-4 text-black border-gray-300 focus:ring-black"
              />
              <span className="ml-2">여성</span>
            </label>
          </div>
        </div>

        {/* 주소 */}
        <div>
          <label htmlFor="address" className="block mb-1 font-medium">
            주소
          </label>
          <input
            id="address"
            name="address"
            type="text"
            value={form.address}
            onChange={onChange}
            placeholder="도로명, 상세주소 포함"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* 버튼 그룹: 저장(왼쪽), 취소(오른쪽) */}
        <div className="flex justify-between mt-6">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-black text-white rounded disabled:opacity-50"
          >
            {loading ? '저장 중…' : '저장'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border rounded hover:bg-gray-100"
          >
            취소
          </button>
        </div>
      </form>
    </main>
  );
}
