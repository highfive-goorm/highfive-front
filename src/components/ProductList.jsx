// ProductList.jsx
import React, { useState, useEffect } from 'react';
import ProductItem from './ProductItem';
import productData from '../api/products.json';
import ProductFilter from './ProductFilter'; // 필터 카테고리
import Pagination from './Pagination'; // 페이지네이션 

const ProductList = () => {
    const [products, setProducts] = useState(productData);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [currentPage, setCurrentPage] = useState(1); // 페이지네이션 관련 코드
    const [productsPerPage] = useState(15); // 한 페이지에 보여주고자 하는 컨텐츠의 개수
    const [pageButtonCount] = useState(5); // 한 페이지에 보여주고자 하는 페이지 버튼 개수


    useEffect(() => {
        // 상품 데이터를 API에서 가져오는 등의 작업 수행
        filterProducts(selectedCategory);
        console.log('상품 데이터 로드 완료');
    }, [selectedCategory]);

    // ProductFilter 컴포넌트에서 전달된 카테고리 정보를 받아 filterProducts 함수를 호출함
    const handleFilterChange = (category) => {
        setSelectedCategory(category);
        filterProducts(category);
        setCurrentPage(1); // 페이지 초기화
    };

    // 선택된 카테고리에 따라 상품 데이터 필터링
    const filterProducts = (category) => {
        if (category === 'all') {
            setProducts(productData);
        } else {
            const filteredProducts = productData.filter(product => (
                product.major_category === category || product.gender === category
            ));
            setProducts(filteredProducts);
        }
    };
    
    // 페이지네이션 관련 코드
    const totalPages = Math.ceil(products.length / productsPerPage);
    const pageNumbers = [];
    const startPage = Math.floor((currentPage - 1) / pageButtonCount) * pageButtonCount + 1;
    const endPage = Math.min(startPage + pageButtonCount - 1, totalPages);

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <section id="imageType" className="imageType__wrap section nexon">
            <h2>상품 리스트</h2>
            <p>상품 리스트 유형입니다. 상품이 리스트로 진열되는 구조입니다.</p>
            <ProductFilter selectedCategory={selectedCategory} onFilterChange={handleFilterChange} />
            <div className="product-list">
                {products.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage).map((product) => (
                    <ProductItem key={product.id} product={product} />
                ))}
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                pageNumbers={pageNumbers}
                onPageChange={handlePageChange}
            />
        </section>
    );
};

export default ProductList;