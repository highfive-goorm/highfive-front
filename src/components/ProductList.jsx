// ProductList.jsx
import React, { useState, useEffect } from 'react';
import ProductItem from './ProductItem';
import productData from '../api/products.json';

const ProductList = () => {
    const [products] = useState(productData);

    useEffect(() => {
        // 상품 데이터를 API에서 가져오는 등의 작업 수행
        console.log('상품 데이터 로드 완료');
    }, []);

    return (
        <section id="imageType" className="imageType__wrap section nexon">
            <h2>상품 리스트</h2>
            <p>상품 리스트 유형입니다. 상품이 리스트로 진열되는 구조입니다.</p>

            <div className="product-list">
                {products.map((product) => (
                    <ProductItem key={product.id} product={product} />
                ))}
            </div>
        </section>
    );
};

export default ProductList;