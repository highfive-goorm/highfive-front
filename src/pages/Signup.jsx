import React, { useState } from 'react';
import axios from 'axios';

function Signup() {
  const [form, setForm] = useState({
    user_id: '',
    password: '',
    age: '',
    gender: '',
    address: '',
  });

  const [checkResult, setCheckResult] = useState(null); // 중복 검사 결과 상태

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === 'user_id') {
      setCheckResult(null); // 계정명 변경되면 결과 초기화
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 계정 중복 확인 없이 제출하지 않도록 제한
    if (checkResult !== '사용 가능한 아이디입니다.') {
      alert('아이디 중복 확인을 해주세요.');
      return;
    }

    try {
      const response = await axios.post(
        'https://68144d36225ff1af162871b7.mockapi.io/signup',
        form
      );
      console.log("✅ 전송된 데이터:", form);
      console.log("✅ 서버 응답:", response.data);
      alert("회원가입 테스트 성공! (콘솔 확인)");
    } catch (error) {
      console.error("❌ 에러 발생:", error);
      alert("전송 실패");
    }
  };

  const checkDuplicate = async () => {
    if (!form.user_id) {
      setCheckResult('아이디를 입력해주세요.');
      return;
    }

    try {
      const response = await axios.get('https://68144d36225ff1af162871b7.mockapi.io/signup');
      const users = response.data;

      const isDuplicate = users.some(user => user.user_id === form.user_id);

      if (isDuplicate) {
        setCheckResult('이미 사용 중인 아이디입니다.');
      } else {
        setCheckResult('사용 가능한 아이디입니다.');
      }
    } catch (error) {
      console.error("중복 확인 실패:", error);
      setCheckResult('중복 확인 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">회원가입</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Account</label>
            <div className="flex gap-2">
              <input
                type="text"
                name="user_id"
                value={form.user_id}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
              <p className={`text-sm mt-1 ${checkResult.includes('사용 가능') ? 'text-green-600' : 'text-red-500'}`}>
                {checkResult}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Age</label>
            <input
              type="number"
              name="age"
              value={form.age}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Gender</label>
            <div className="flex items-center gap-4 mt-1">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="M"
                  checked={form.gender === 'M'}
                  onChange={handleChange}
                  className="form-radio text-blue-500"
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
                  className="form-radio text-pink-500"
                />
                <span className="ml-2">여성</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block mb-1 font-medium">Address</label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => alert("로그인 페이지로 이동 예정")}
              className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
            >
              로그인
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              확인
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
