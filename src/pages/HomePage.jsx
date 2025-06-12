// src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import Main from '../components/Main';
import Recommend from '../components/Recommend';
import Slider from '../components/Slider';
import ProductFilter from '../components/ProductFilter';
import ProductList from '../components/ProductList';
import { useProducts } from '../hooks/useProducts';
import { useTracking } from '../hooks/useTracking';

const HomePage = () => {
  const [selectedFilters, setSelectedFilters] = useState({ gender: '', category: '' });  
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 15;

  const { trackEvent } = useTracking(); // 트래킹 훅 사용
  // 전체 상품 조회: 페이지네이션 포함
  const {
    items: products,
    total: totalItems,
    loading,
    error,
  } = useProducts('', currentPage, productsPerPage, selectedFilters);

  const handleFilterChange = (newFilters) => {
    setSelectedFilters(newFilters);
    setCurrentPage(1);
  };

  useEffect(() => {
    document.title = '하이파이브'; // 또는 '메인 | 하이파이브'
    trackEvent('view_main'); // 메인 페이지 조회 이벤트 로깅

    // 컴포넌트가 언마운트될 때 실행될 클린업 함수
    return () => {
      document.title = '하이파이브'; // 기본 제목으로 복원
    };
  }, [trackEvent]);

  // 페이지 변경 핸들러
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    // 페이지 변경 시에도 URL 파라미터를 업데이트할 수 있지만,
    // 메인 페이지의 경우 URL에 필터/페이지 정보를 항상 노출할 필요는 없을 수 있음 (선택 사항)
  };

  return (
    <>
      <SearchBar />
      <Main>
        <Recommend element="section nexon" title="추천 서비스"/>
        <Slider element="nexon" title="광고 배너"/>
        <div className="products-section-header mb-4 mt-4"> {/* 필터와 제목을 묶는 div (선택적) */}
          <h2 className="text-2xl font-bold text-center mb-3">상품 리스트</h2> {/* 제목 스타일링 */}
          <ProductFilter
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
          />
        </div>
        <ProductList
          products={error ? [] : products}
          totalItems={totalItems}
          loading={loading}
          currentFilters={selectedFilters} // ProductItem에 전달할 전체 필터 객체
          currentQuery={null}
          currentPage={currentPage}
          productsPerPage={productsPerPage}
          pageButtonCount={5}
          onPageChange={handlePageChange}
        />
      </Main>
    </>
  );
};

export default HomePage;