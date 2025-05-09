import React from 'react';
import { Link }            from 'react-router-dom';
import { useFavorites }    from '../../hooks/useFavorites';

export default function FavoritesPage() {
  const { favorites } = useFavorites();

  return (
    <main className="max-w-md mx-auto px-4 py-8">
      <h2 className="text-xl font-semibold mb-4">즐겨찾기 목록</h2>
      {favorites.length === 0 ? (
        <p className="text-gray-500">즐겨찾기한 상품이 없습니다.</p>
      ) : (
        <ul className="space-y-2">
          {favorites.map(item => (
            <li key={item.id} className="p-2 border rounded">
              {item.name}
            </li>
          ))}
        </ul>
      )}
      <div className="mt-6">
        <Link to="/mypage" className="text-blue-600 hover:underline">
          ← 마이페이지로 돌아가기
        </Link>
      </div>
    </main>
  );
}
