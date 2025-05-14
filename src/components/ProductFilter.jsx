// src/componenets/ProductFilter.jsx
import React, { useState } from 'react';

const ProductFilter = ({ onFilterChange }) => {
    const [selectedCategory, setSelectedCategory] = useState('all');

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        onFilterChange(category);
    };

    return (
        <div className="filter-bar">
            <button
                className={selectedCategory === 'all' ? 'active' : ''}
                onClick={() => handleCategoryChange('all')}
            >
                전체
            </button>
            <button
                className={selectedCategory === 'F' ? 'active' : ''}
                onClick={() => handleCategoryChange('F')}
            >
                여성
            </button>
            <button
                className={selectedCategory === 'M' ? 'active' : ''}
                onClick={() => handleCategoryChange('M')}
            >
                남성
            </button>
            <button
                className={selectedCategory === 'U' ? 'active' : ''}
                onClick={() => handleCategoryChange('U')}
            >
                공용
            </button>
            <button
                className={selectedCategory === 'outer' ? 'active' : ''}
                onClick={() => handleCategoryChange('outer')}
            >
                아우터
            </button>
            <button
                className={selectedCategory === 'tops' ? 'active' : ''}
                onClick={() => handleCategoryChange('tops')}
            >
                상의
            </button>
            <button
                className={selectedCategory === 'pants' ? 'active' : ''}
                onClick={() => handleCategoryChange('pants')}
            >
                하의
            </button>
            <button
                className={selectedCategory === 'shoes' ? 'active' : ''}
                onClick={() => handleCategoryChange('shoes')}
            >
                신발
            </button>
        </div>
    );
};

export default ProductFilter;