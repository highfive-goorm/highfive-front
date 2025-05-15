// src/components/ProductItem.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductItem = ({ product }) => {
    const navigate = useNavigate();

    const handleProductClick = () => {
        navigate(`/product/${product.id}`);
    };

    return (
        <div className="product-item">
            <img src={product.img_url} alt={product.name} onClick={handleProductClick} />
            <h3>{product.brand}</h3>
            <p>{product.name}</p>
            <p>Price: {product.price}원</p>
            {product.discount > 0 && <p>Discount: {product.discount}%</p>}
        </div>
    );
};

export default ProductItem;