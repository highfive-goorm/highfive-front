// ProductList.jsx
import React, { useState, useEffect } from 'react';
import ProductItem from './ProductItem';
//import productData from '../api/products.json';
import ProductFilter from './ProductFilter'; // 필터 카테고리
import Pagination from './Pagination'; // 페이지네이션 
import { fetchProducts } from '../api/product'; // api 호출 함수 

const ProductList = () => {
    //const [products, setProducts] = useState(productData);
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [currentPage, setCurrentPage] = useState(1); // 페이지네이션 관련 코드
    const [productsPerPage] = useState(15); // 한 페이지에 보여주고자 하는 컨텐츠의 개수
    const [pageButtonCount] = useState(5); // 한 페이지에 보여주고자 하는 페이지 버튼 개수

    /*useEffect(() => {
       
        filterProducts(selectedCategory);
        console.log('상품 데이터 로드 완료');
    }, []);
    */

    // 상품 데이터 불러오기 (Mock API)
    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchProducts();
                setProducts(data);
            } catch (error) {
                console.error('상품 데이터를 불러오는 중 오류 발생:', error);
            }
        };
        loadData();
    }, []);

    // 필터링된 상품만 추출
    const getFilteredProducts = () => {
        if (selectedCategory === 'all') return products;
        return products.filter(product =>
            product.major_category === selectedCategory || product.gender === selectedCategory
        );
    };

    const filteredProducts = getFilteredProducts();

    // ProductFilter 컴포넌트에서 전달된 카테고리 정보를 받아 filterProducts 함수를 호출함(Mock API 사용 전)
    const handleFilterChange = (category) => {
        setSelectedCategory(category);
        //filterProducts(category);
        setCurrentPage(1); // 페이지 초기화 : 필터 변경 시 첫 페이지로
    };

    /*
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
    */
    
    // 페이지네이션 관련 코드
    // 현재 페이지에 맞는 상품 추출
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    //const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    return (
        <section id="imageType" className="imageType__wrap section nexon">
            <h2>상품 리스트</h2>
            <p>상품 리스트 유형입니다. 상품이 리스트로 진열되는 구조입니다.</p>
            <ProductFilter selectedCategory={selectedCategory} onFilterChange={handleFilterChange} />
            <div className="product-list">
                {currentProducts.map((product) => (
                    <ProductItem key={product.id} product={product} />
                ))}
            </div>
            <Pagination
                currentPage={currentPage}
                productsLength={products.length}
                productsPerPage={productsPerPage}
                pageButtonCount={pageButtonCount}
                onPageChange={setCurrentPage}
            />
        </section>
    );
};

export default ProductList;