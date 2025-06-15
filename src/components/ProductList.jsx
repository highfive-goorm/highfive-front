// src/components/ProductList.jsx
import React from 'react';
import ProductItem   from './ProductItem';
import Pagination    from './Pagination';

export default function ProductList({
  products = [],
  loading = false,
  currentPage,
  productsPerPage,
  pageButtonCount,
  onPageChange,
  totalItems = 0,
}) {
  if (loading) {
    return <div className="py-8 text-center">로딩 중…</div>;
  }

  return (
    <section id="productDisplaySection" className="imageType__wrap section nexon">
      {products.length === 0 ? (
        <div className="w-full text-center py-8 text-gray-500">
          검색 결과가 존재하지 않습니다.
        </div>
      ) : (
        <div className="grid grid-cols-5 gap-6">
          {products.map(p => (
            <ProductItem
              key={p.id}
              product={p}
            />
          ))}
      </div>
      )}

      {totalItems > 0 && products.length > 0 && ( // 상품이 있을 때만 페이지네이션 표시
        <Pagination
          currentPage={currentPage}
          totalItems={totalItems}
          productsPerPage={productsPerPage} // props명 일치 (productsPerPage -> itemsPerPage)
          pageButtonCount={pageButtonCount}
          onPageChange={onPageChange}
        />
      )}
    </section>
  );
}
