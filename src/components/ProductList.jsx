// src/components/ProductList.jsx
import React from 'react';
import ProductItem   from './ProductItem';
import ProductFilter from './ProductFilter';
import Pagination    from './Pagination';

export default function ProductList({
  products = [],
  loading = false,
  selectedCategory,
  onFilterChange,
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
    <section id="imageType" className="imageType__wrap section nexon">
      <h2 className="text-xl font-semibold mb-4">상품 리스트</h2>

      <ProductFilter
        selectedCategory={selectedCategory}
        onFilterChange={onFilterChange}
      />

      {products.length === 0 ? (
        <div className="w-full text-center py-8 text-gray-500">
          검색 결과가 존재하지 않습니다.
        </div>
      ) : (
        <div className="grid grid-cols-5 gap-6">
          {products.map(p => (
            <ProductItem key={p.id} product={p} />
          ))}
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalItems={totalItems}
        productsPerPage={productsPerPage}
        pageButtonCount={pageButtonCount}
        onPageChange={onPageChange}
      />
    </section>
  );
}
