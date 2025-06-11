// src/components/ProductItem.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductItem = ({ product }) => {
    const navigate = useNavigate();

    const handleProductClick = () => {
        navigate(`/product/${product.id}`);
    };

    return (
        <div className="product-item group cursor-pointer border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col bg-white"  onClick={handleProductClick}>
            <img
                src={product.img_url || 'https://via.placeholder.com/300x400'}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="p-3 flex flex-col">
                <h3 className="text-xs font-semibold text-gray-500 mb-0.5 truncate">{product.brand_kor || product.brand || '브랜드 없음'}</h3>
                <p className="text-sm text-gray-800 font-medium leading-snug mb-1 h-10 overflow-hidden group-hover:text-blue-600 transition-colors">
                    {product.name}
                </p>
                <div className="mt-auto pt-2">
                    {product.discount > 0 && (
                         <p className="text-xs text-gray-400 line-through">{product.price?.toLocaleString()}원</p>
                    )}
                    <p className="text-md font-bold text-gray-900">
                        {(product.discounted_price || product.price)?.toLocaleString()}원
                        {product.discount > 0 && <span className="text-sm text-red-500 ml-1">({product.discount}%)</span>}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ProductItem;