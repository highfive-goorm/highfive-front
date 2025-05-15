// src/components/ProductList.jsx
import React from 'react';
import ProductItem from './ProductItem';
import ProductFilter from './ProductFilter'; // 필터 카테고리
import Pagination from './Pagination'; // 페이지네이션 

/**
 * @param {Object[]} products    렌더할 상품 배열
 * @param {boolean}  loading     로딩 중인지
 * @param {string}   selectedCategory
 * @param {Function} onFilterChange
 * @param {number}   currentPage
 * @param {Function} onPageChange
 */
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
    const filtered = products.filter(p =>
        selectedCategory === 'all'
            ? true
            : p.major_category === selectedCategory || p.gender === selectedCategory
        );
    
    // 페이지네이션
    const last = currentPage * productsPerPage;
    const first = last - productsPerPage;
    const visible = filtered.slice(first, last);
    
    return (
        <section id="imageType" className="imageType__wrap section nexon">
            <h2>상품 리스트</h2>
            <p>상품 리스트 유형입니다. 상품이 리스트로 진열되는 구조입니다.</p>
            <ProductFilter selectedCategory={selectedCategory} onFilterChange={onFilterChange} />
            <div className="product-list">
                {visible.map((product) => (
                    <ProductItem key={product.id} product={product} />
                ))}
            </div>
            <Pagination
                currentPage={currentPage}
                productsLength={products.length}
                productsPerPage={productsPerPage}
                pageButtonCount={pageButtonCount}
                onPageChange={onPageChange}
            />
        </section>
    );
};

    

export default ProductList;