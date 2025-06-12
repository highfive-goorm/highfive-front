// src/pages/BrandProductsPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import ProductList from '../components/ProductList';
import SearchBar from '../components/SearchBar';
import Main from '../components/Main';
import api from '../api'; // src/api/index.js에서 api 객체 가져오기
// import { getApiBaseUrl } from '../config'; // api 객체가 base URL을 처리하므로 직접 사용 불필요

const BrandProductsPage = () => {
  const { id } = useParams(); // brandId 대신 id로 파라미터 추출
  const location = useLocation(); 
  
  const [products, setProducts] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 15;

  // h2 태그 및 document.title에 사용될 페이지 제목
  const dynamicPageTitle = location.state?.promotionTitle
    ? `${location.state.promotionTitle} 상품` // 프로모션 제목 사용
    : `Brand ${id} 상품 목록`; // URL 파라미터 'id' 사용

  useEffect(() => {
    // 페이지 제목 설정
    document.title = `${dynamicPageTitle} | 하이파이브`;

    // 컴포넌트가 언마운트될 때 실행될 클린업 함수
    return () => {
      document.title = '하이파이브'; // 기본 제목으로 복원
    };
  }, [dynamicPageTitle]);

  useEffect(() => {
    const fetchBrandProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        // fetch 대신 api 객체 사용
        const response = await api.get(
          // API 호출 시 brand_id 쿼리 파라미터에 추출한 id 값 사용
          `/product?brand_id=${id}&page=${currentPage}&size=${productsPerPage}`
        );
        setProducts(response.data.items || []); 
        setTotalItems(response.data.total || 0); 
      } catch (e) {
        setError(e.message || `브랜드 ${id} 상품을 불러오는데 실패했습니다.`);
        setProducts([]);
        setTotalItems(0);
        console.error(`Failed to fetch products for brand ${id}:`, e);
      } finally {
        setLoading(false);
      }
    };

    if (id) { // brandId 대신 id 사용
      fetchBrandProducts();
    }
  }, [id, currentPage]); // brandId 대신 id 사용

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  };

  return (
    <>
      <SearchBar /> 
      <Main>
        <div className="products-section-header mb-4 mt-4">
          <h2 className="text-2xl font-bold text-center mb-3">{dynamicPageTitle}</h2>
        </div>
        {error && <div className="text-center py-5 text-red-500">상품을 불러오는 중 오류가 발생했습니다: {error}</div>}
        <ProductList
          products={products}
          totalItems={totalItems}
          loading={loading}
          currentPage={currentPage}
          productsPerPage={productsPerPage}
          pageButtonCount={5}
          onPageChange={handlePageChange}
        />
        {!loading && !error && products.length === 0 && totalItems === 0 && (
          <div className="text-center py-10">해당 브랜드의 상품이 없습니다.</div>
        )}
      </Main>
    </>
  );
};

export default BrandProductsPage;