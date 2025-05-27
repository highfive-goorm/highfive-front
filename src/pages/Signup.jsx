// src/pages/Signup.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { signupRequest } from '../api/auth';
import api from '../api/index';

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    account: '',
    password: '',
    age: '',
    gender: '',
    address: '',
  });
  const [checkResult, setCheckResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 간단 형식 및 필수 입력 검사
  const validate = () => {
    if (form.account.trim().length < 4) {
      setErrorMsg('아이디는 최소 4자 이상이어야 합니다.');
      return false;
    }
    if (form.password.length < 6) {
      setErrorMsg('비밀번호는 최소 6자 이상이어야 합니다.');
      return false;
    }
    if (!form.age) {
      setErrorMsg('나이를 입력해주세요.');
      return false;
    }
    if (!form.gender) {
      setErrorMsg('성별을 선택해주세요.');
      return false;
    }
    if (!form.address.trim()) {
      setErrorMsg('주소를 입력해주세요.');
      return false;
    }
    setErrorMsg('');
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (name === 'account') {
      setCheckResult(null);
    }
  };

  // 중복 검사: 전용 엔드포인트 호출 예시
  const checkDuplicate = async () => {
    if (!form.account.trim()) {
      setCheckResult('아이디를 입력해주세요.');
      return;
    }
    try {
      let exists;

      if (process.env.REACT_APP_USE_STUB === 'true') {
        const users = await axios
        .get('https://68144d36225ff1af162871b7.mockapi.io/signup')
        .then(res => res.data);
        exists = users.some(u => u.account === form.account);  
      } else {
        const resp = await api.post('/user/check-duplicate', { 
          account: form.account,
        });
        exists = resp.data.exists;
      }      

      setCheckResult(
        exists ? '이미 사용 중인 아이디입니다.' : '사용 가능한 아이디입니다.'
      );
    } catch (err) {
      console.error(err);
      setCheckResult('중복 확인 중 오류가 발생했습니다.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (checkResult !== '사용 가능한 아이디입니다.') {
      setErrorMsg('아이디 중복 확인을 해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      await signupRequest(form);
      navigate('/login');
    } catch {
      setErrorMsg('회원가입에 실패했습니다.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 px-4">
      <main className="flex-grow flex items-center justify-center py-16">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-center">회원가입</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 계정 */}
            <div>
              <label className="block mb-1 font-medium">아이디</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="account"
                  value={form.account}
                  onChange={handleChange}
                  placeholder="아이디 (4자 이상)"
                  className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                />
                <button
                  type="button"
                  onClick={checkDuplicate}
                  className="bg-gray-300 px-4 rounded hover:bg-gray-400"
                >
                  중복 확인
                </button>
              </div>
              {checkResult && (
                <p
                  className={`text-sm mt-1 ${
                    checkResult.includes('사용 가능')
                      ? 'text-green-600'
                      : 'text-red-500'
                  }`}
                >
                  {checkResult}
                </p>
              )}
            </div>

            {/* 비밀번호 */}
            <div>
              <label className="block mb-1 font-medium">비밀번호</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="비밀번호 (6자 이상)"
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* 나이 */}
            <div>
              <label className="block mb-1 font-medium">나이</label>
              <input
                type="number"
                name="age"
                value={form.age}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* 성별 */}
            <div>
              <label className="block mb-1 font-medium">성별</label>
              <div className="flex items-center gap-4 mt-1">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="M"
                    checked={form.gender === 'M'}
                    onChange={handleChange}
                    className="form-radio text-black"
                  />
                  <span className="ml-2">남성</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="F"
                    checked={form.gender === 'F'}
                    onChange={handleChange}
                    className="form-radio text-black"
                  />
                  <span className="ml-2">여성</span>
                </label>
              </div>
            </div>

            {/* 주소 */}
            <div>
              <label className="block mb-1 font-medium">주소</label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* 에러 메시지 */}
            {errorMsg && (
              <p role="alert" className="text-red-600 text-sm text-center">
                {errorMsg}
              </p>
            )}

            {/* 버튼: 확인 / 취소 */}
            <div className="flex justify-between mt-6">
              <button
                type="submit"
                disabled={isLoading}
                className={`py-2 px-4 rounded font-semibold transition-colors ${
                  isLoading
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-black text-white hover:bg-gray-100 hover:text-black'
                }`}
              >
                {isLoading ? '가입 중...' : '확인'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
              >
                취소
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
