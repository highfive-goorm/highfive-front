import React from 'react';

const Pagination = ({
    currentPage,
    productsLength,
    productsPerPage,
    pageButtonCount,
    onPageChange,
}) => {
    const totalPages = Math.ceil(productsLength / productsPerPage);

    // 현재 블록의 시작-끝 페이지 계산
    const startPage = Math.floor((currentPage - 1) / pageButtonCount) * pageButtonCount + 1;
    const endPage = Math.min(startPage + pageButtonCount - 1, totalPages);

    // 보여줄 페이지 번호 목록 생성
    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="pagination">
            <button
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
            >
                &lt;
            </button>
            {pageNumbers.map((pageNumber) => (
                <button
                    key={pageNumber}
                    className={currentPage === pageNumber ? 'active' : ''}
                    onClick={() => onPageChange(pageNumber)}
                >
                    {pageNumber}
                </button>
            ))}
            <button
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
            >
                &gt;
            </button>
        </div>
    );
};

export default Pagination;
