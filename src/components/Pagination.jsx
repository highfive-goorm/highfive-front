// src/components/Pagination.jsx
import React from 'react';

/**
 * 페이지네이션 컴포넌트
 * @param {number} currentPage      - 현재 페이지 번호
 * @param {number} totalItems       - 서버에서 반환된 전체 아이템 개수
 * @param {number} productsPerPage  - 한 페이지당 보여줄 아이템 개수
 * @param {number} pageButtonCount  - 한 블록당 페이지 버튼 개수
 * @param {Function} onPageChange   - 페이지 변경 핸들러
 */
const Pagination = ({
  currentPage,
  totalItems,
  productsPerPage,
  pageButtonCount,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / productsPerPage);

  const startPage = Math.floor((currentPage - 1) / pageButtonCount) * pageButtonCount + 1;
  const endPage = Math.min(startPage + pageButtonCount - 1, totalPages);

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagination flex justify-center items-center space-x-2 mt-6">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-2 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
      >
        &lt;
      </button>

      {pageNumbers.map(pageNumber => (
        <button
          key={pageNumber}
          onClick={() => onPageChange(pageNumber)}
          className={
            currentPage === pageNumber
              ? 'px-3 py-1 rounded bg-black text-white font-semibold'
              : 'px-3 py-1 rounded bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
          }
        >
          {pageNumber}
        </button>
      ))}

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-3 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;
