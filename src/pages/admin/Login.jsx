// src/pages/admin/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    // 개발 모드 스텁 로그인 (admin/password)
    if (process.env.REACT_APP_USE_STUB === "true") {
      if (id === "admin" && password === "password") {
        sessionStorage.setItem("adminId", id);
        return navigate("/admin/dashboard");
      } else {
        setErrorMsg("아이디 또는 비밀번호가 올바르지 않습니다.");
        setIsLoading(false);
        return;
      }
    }

    // TODO: 실제 API 호출로 대체
    try {
      const res = await api.post("/admin/login", { id, password });
      sessionStorage.setItem("adminId", res.data.id);
      navigate("/admin/dashboard");
    } catch {
      setErrorMsg("로그인에 실패했습니다.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow flex items-start justify-center px-4 pt-16 pb-8">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-semibold text-center mb-6">
            관리자 로그인
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="admin-id"
                className="block text-sm font-medium text-gray-700"
              >
                관리자 ID
              </label>
              <input
                id="admin-id"
                name="admin-id"
                type="text"
                placeholder="admin"
                value={id}
                onChange={(e) => setId(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label
                htmlFor="admin-password"
                className="block text-sm font-medium text-gray-700"
              >
                비밀번호
              </label>
              <input
                id="admin-password"
                name="admin-password"
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            {errorMsg && (
              <p role="alert" className="text-red-600 text-sm text-center">
                {errorMsg}
              </p>
            )}
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
          </form>
        </div>
      </main>
    </div>
  );
}
