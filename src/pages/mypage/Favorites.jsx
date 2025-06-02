// src/pages/mypage/Favorites.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../../hooks/useFavorites'; // 수정된 훅 임포트

export default function FavoritesPage() {
  const { favorites, isLoading, error } = useFavorites();

  const renderContent = () => {
    if (isLoading) {
      return <p className="text-center text-gray-500">좋아요 목록을 불러오는 중...</p>;
    }
    if (error) {
      return <p className="text-center text-red-500">{error}</p>;
    }
    if (favorites.length === 0) {
      return <p className="text-center text-gray-500">좋아요 한 상품이 없습니다.</p>;
    }
    return (
      <ul className="space-y-4">
        {favorites.map(item => (
          <li key={item.id} className="flex items-start p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <img
              src={item.img_url || 'https://via.placeholder.com/100'} // 기본 이미지
              alt={item.name}
              className="w-24 h-24 object-cover rounded-md mr-4 flex-shrink-0"
            />
            <div className="flex-grow">
              <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
              {/* 만약 상품 가격 등 추가 정보가 필요하다면, 
                  getUserLikedProducts API 응답에 포함되도록 백엔드 수정 또는
                  여기서 각 상품 ID로 추가 API 호출 필요 (N+1 문제 주의) */}
              <Link
                to={`/product/${item.id}`}
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                상품 보러가기
              </Link>
              {/* TODO: 여기서 바로 좋아요 취소 기능 추가 가능 */}
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">좋아요</h2>
        <Link to="/mypage" className="text-sm text-blue-600 hover:underline">
          ← 마이페이지
        </Link>
      </div>
      {renderContent()}
    </main>
  );
}