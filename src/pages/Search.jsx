// src/pages/Search.jsx
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import ProductList from '../components/ProductList';
import { useProducts } from '../hooks/useProducts';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  // 검색어에 따른 상품 조회
  const { products, loading, error } = useProducts(query);

  // 필터·페이지 상태 관리
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const handleFilterChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);  // 필터 변경 시 1페이지로
  };

  return (
    <div className="search-page">
      <div className="search-container">
        <SearchBar />
        <h1 className="search-title">검색어: {query}</h1>
      </div>

      <div className="search-container">
        <ProductList
          products={error ? [] : products}
          loading={loading}
          selectedCategory={selectedCategory}
          onFilterChange={handleFilterChange}
          currentPage={currentPage}
          productsPerPage={15}
          pageButtonCount={5}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
