// src/components/ProductList.jsx
import React from 'react';
import ProductItem from './ProductItem';
import ProductFilter from './ProductFilter';
import Pagination from './Pagination';

const ProductList = ({
  products,
  loading,
  selectedCategory,
  onFilterChange,
  currentPage,
  productsPerPage,
  pageButtonCount,
  onPageChange,
}) => {
  if (loading) return <div>로딩 중...</div>;

  const filtered = selectedCategory === 'all'
    ? products
    : products.filter(p =>
        p.major_category === selectedCategory || p.gender === selectedCategory
      );

  const last  = currentPage * productsPerPage;
  const first = last - productsPerPage;
  const visible = filtered.slice(first, last);

  return (
    <section id="imageType" className="imageType__wrap section nexon">
      <h2>상품 리스트</h2>
      <ProductFilter
        selectedCategory={selectedCategory}
        onFilterChange={onFilterChange}
      />

      {/* 검색 결과 없을 때 */}
      {visible.length === 0 ? (
        <div className="w-full text-center py-8 text-gray-500">
          검색 결과가 존재하지 않습니다.
        </div>
      ) : (
        <div className="product-list">
          {visible.map(product => (
            <ProductItem key={product.id} product={product} />
          ))}
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        productsLength={filtered.length}
        productsPerPage={productsPerPage}
        pageButtonCount={pageButtonCount}
        onPageChange={onPageChange}
      />
    </section>
  );
};

export default ProductList;