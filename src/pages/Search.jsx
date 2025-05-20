// src/pages/Search.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import ProductList from '../components/ProductList';
import { useProducts } from '../hooks/useProducts';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  // 필터·페이지 상태 관리: 전체는 빈 문자열('')
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 15;

  // 검색어(query)가 바뀔 때마다 페이지와 카테고리 모두 리셋
  useEffect(() => {
    setCurrentPage(1);
    setSelectedCategory('');  // 전체 필터로 초기화
  }, [query]);

  const handleFilterChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  // name, page, size, category 전달
  const {
    items: products,
    total: totalItems,
    loading,
    error,
  } = useProducts(query, currentPage, productsPerPage, selectedCategory);

  return (
    <div className="search-page px-4">
      <div className="search-container mb-6">
        <SearchBar />
        <h1 className="search-title mt-4 text-2xl">검색어: {query}</h1>
      </div>

      <ProductList
        products={error ? [] : products}
        loading={loading}
        selectedCategory={selectedCategory}
        onFilterChange={handleFilterChange}
        currentPage={currentPage}
        productsPerPage={productsPerPage}
        pageButtonCount={5}
        onPageChange={setCurrentPage}
        totalItems={totalItems}
      />
    </div>
  );
}
