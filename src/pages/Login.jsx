import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginRequest } from "../lib/api";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    try {
      // 로그인 API 호출
      const { token, user } = await loginRequest(account, password);

      // 로컬 스토리지에 토큰·계정 저장
      localStorage.setItem("token", token);
      localStorage.setItem("account", account);

      // Context에 유저 정보 저장
      login(user);

      // 메인 페이지로 이동
      navigate("/");
    } catch {
      setErrorMsg("계정 또는 비밀번호가 올바르지 않습니다.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow flex items-start justify-center px-4 pt-16 pb-8">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-semibold text-center mb-6">로그인</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ID 입력 */}
            <div>
              <label
                htmlFor="account"
                className="block text-sm font-medium text-gray-700"
              >
                ID
              </label>
              <input
                id="account"
                name="account"
                type="text"
                placeholder="아이디"
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* 비밀번호 입력 */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                비밀번호
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* 에러 메시지 */}
            {errorMsg && (
              <p role="alert" className="text-red-600 text-sm text-center">
                {errorMsg}
              </p>
            )}

            {/* 로그인 버튼 */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 rounded-lg font-semibold transition-colors
                ${
                  isLoading
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-black text-white hover:bg-gray-100 hover:text-black"
                }`}
            >
              {isLoading ? "로그인 중..." : "로그인"}
            </button>

            {/* 회원가입 링크 */}
            <p className="text-center text-sm">
              아직 회원이 아니신가요?{" "}
              <Link
                to="/signup"
                className="text-black font-medium hover:underline"
              >
                회원가입
              </Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
