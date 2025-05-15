// src/pages/Alerts.jsx
import React, { useState } from 'react';
import useAlerts from '../hooks/useAlerts';
import { useAuth } from '../context/AuthContext';

const Alerts = () => {
  const { user } = useAuth();
  const user_id = user?.user_id;
  const [page, setPage] = useState(1);

  const { alerts, total, loading, error } =
    useAlerts(user_id, { page, size: 10 });
  const totalPages = Math.ceil(total / 10);

  const delta = 2;
  const getPagination = () => {
    const pages = [];
    pages.push(1);
    if (page > delta + 2) pages.push('left-ellipsis');
    const start = Math.max(2, page - delta);
    const end = Math.min(totalPages - 1, page + delta);
    for (let i = start; i <= end; i++) pages.push(i);
    if (page < totalPages - (delta + 1)) pages.push('right-ellipsis');
    if (totalPages > 1) pages.push(totalPages);
    return pages;
  };

  if (loading) return <div className="text-center py-10">로딩 중...</div>;
  if (error)
    return (
      <div className="text-center py-10 text-red-500">
        공지사항을 불러오는 중 오류가 발생했습니다.
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">공지사항</h2>

      <ul className="divide-y divide-gray-200">
        {alerts.map((alert) => (
          <li key={alert.id} className="py-2">
            <details className="group">
              <summary
                className="flex items-center justify-between cursor-pointer list-none
                           p-3 bg-gray-50 rounded-md hover:bg-gray-100
                           focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <div>
                  <p className="font-medium text-lg text-gray-900">
                    {alert.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(alert.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className="ml-4 text-xl font-bold transition-transform
                             group-open:-rotate-45"
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <div className="mt-2 p-4 bg-white text-gray-700 rounded-md border border-gray-200">
                {alert.content}
              </div>
            </details>
          </li>
        ))}
      </ul>

      {totalPages > 1 && (
        <nav className="mt-8 flex justify-center items-center space-x-2 text-gray-700">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 rounded hover:bg-gray-100 disabled:opacity-50"
          >
            Prev
          </button>
          {getPagination().map((item, idx) =>
            item === 'left-ellipsis' || item === 'right-ellipsis' ? (
              <span key={`${item}-${idx}`} className="px-2">
                …
              </span>
            ) : (
              <button
                key={item}
                onClick={() => setPage(item)}
                className={`px-3 py-1 rounded ${
                  item === page ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
                }`}
              >
                {item}
              </button>
            )
          )}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 rounded hover:bg-gray-100 disabled:opacity-50"
          >
            Next
          </button>
        </nav>
      )}
    </div>
  );
};

export default Alerts;
