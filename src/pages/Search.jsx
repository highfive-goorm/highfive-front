// src/pages/Search.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import ProductList from '../components/ProductList';
import ProductFilter from '../components/ProductFilter';
import { useProducts } from '../hooks/useProducts';
import { useTracking } from '../hooks/useTracking';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams(); // setSearchParams로 URL 직접 제어 가능
  const query = searchParams.get('q') || '';

  const [selectedFilters, setSelectedFilters] = useState({ gender: '', category: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 15;
  const { trackEvent } = useTracking();

  // 이전에 로깅된 검색 상태를 기억 (중복 로깅 방지용)
  const loggedSearchStateRef = useRef(null);

  // URL의 검색어(q)가 변경되면 필터와 페이지 초기화
  useEffect(() => {
    // URL 파라미터 'q'가 변경될 때만 필터와 페이지를 리셋합니다.
    // 이렇게 하면 필터 변경 시에는 검색어가 유지됩니다.
    setCurrentPage(1);
    setSelectedFilters({ gender: '', category: '' }); // 검색어 변경 시 필터 초기화
  }, [query]); // 'query' (URL에서 가져온 검색어)가 변경될 때 실행

  // 필터가 변경될 때 URL 파라미터 업데이트 (페이지는 1로 초기화)
  const handleFilterChange = (newFilters) => {
    setSelectedFilters(newFilters);
    setCurrentPage(1); // 필터 변경 시 첫 페이지로

    // URL 파라미터 업데이트 (새로고침/공유 용이)
    const newSearchParams = new URLSearchParams(searchParams);
    if (newFilters.gender) {
      newSearchParams.set('gender', newFilters.gender);
    } else {
      newSearchParams.delete('gender');
    }
    if (newFilters.category) {
      newSearchParams.set('category', newFilters.category);
    } else {
      newSearchParams.delete('category');
    }
    // 현재 페이지 파라미터도 1로 설정 또는 제거
    newSearchParams.set('page', '1'); // 또는 아래 페이지 변경 로직과 통합

    setSearchParams(newSearchParams, { replace: true });
  };

  // 페이지 변경 시 URL 파라미터 업데이트
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', String(newPage));
    setSearchParams(newSearchParams, { replace: true });
  };


  // URL 파라미터에서 필터 및 페이지 상태를 읽어와 로컬 상태와 동기화
  useEffect(() => {
    const genderFromUrl = searchParams.get('gender') || '';
    const categoryFromUrl = searchParams.get('category') || '';
    const pageFromUrl = parseInt(searchParams.get('page')) || 1;

    setSelectedFilters(prevFilters => {
      if (prevFilters.gender !== genderFromUrl || prevFilters.category !== categoryFromUrl) {
        return { gender: genderFromUrl, category: categoryFromUrl };
      }
      return prevFilters; // 변경 없으면 기존 상태 유지 (불필요한 리렌더링 방지)
    });

    setCurrentPage(prevPage => {
      if (prevPage !== pageFromUrl) {
        return pageFromUrl;
      }
      return prevPage; // 변경 없으면 기존 상태 유지
    });
  }, [searchParams]); // 주된 의존성은 searchParams. setSelectedFilters와 setCurrentPage는 안정적.
                      // selectedFilters와 currentPage를 직접 읽지 않으므로 의존성에서 제외 가능.


  // 상품 데이터 로드
  const {
    items: products,
    total: totalItems,
    loading,
    error,
  } = useProducts(query, currentPage, productsPerPage, selectedFilters);


  // ***** 검색 결과 로드 완료 후 'search' 이벤트 로깅 *****
  useEffect(() => {
    // 로딩 완료, 에러 없음, 검색어 존재, totalItems 확정 조건
    if (!loading && !error && query && typeof totalItems === 'number') {
      const currentLoggableState = {
        query: query,
        filters: (selectedFilters.gender || selectedFilters.category) ? selectedFilters : null,
        results_count: totalItems,
      };

      // 이전 로깅 상태와 다를 경우에만 로깅 (페이지네이션 등으로 인한 중복 방지)
      // JSON.stringify를 사용하여 객체 내용 비교
      if (JSON.stringify(loggedSearchStateRef.current) !== JSON.stringify(currentLoggableState)) {
        trackEvent("search", currentLoggableState);
        loggedSearchStateRef.current = currentLoggableState; // 로깅된 상태 업데이트
      }
    }
  }, [loading, error, query, totalItems, selectedFilters, trackEvent]);
  // 의존성 배열에 totalItems, selectedFilters 등을 포함하여 이 값들이 변경될 때마다 로깅 조건 재확인


  return (
    <div className="search-page">
      <div className="search-container">
        {/* SearchBar는 현재 URL의 'q' 파라미터를 초기값으로 사용하거나, 내부 상태로 관리 가능 */}
        {/* 여기서는 SearchBar가 URL 변경을 유발하고, 이 페이지가 URL 변경에 반응한다고 가정 */}
        <SearchBar />
        {query && <h1 className="search-title mt-6 text-2xl font-semibold text-gray-800">"{query}" 검색 결과</h1>}
        {!query && !loading && products.length === 0 && (
            <p className="text-center text-gray-500 mt-4">검색어를 입력해주세요.</p>
        )}
      </div>

      <ProductFilter
        selectedFilters={selectedFilters}
        onFilterChange={handleFilterChange}
      />

      <ProductList
        products={error ? [] : products}
        loading={loading}
        currentFilters={selectedFilters}
        currentQuery={query}
        currentPage={currentPage}
        productsPerPage={productsPerPage}
        pageButtonCount={5}
        onPageChange={handlePageChange} // 페이지 변경 핸들러 연결
        totalItems={totalItems}
      />
    </div>
  );
}