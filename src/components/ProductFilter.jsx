// src/components/ProductFilter.jsx
import React from 'react';

// 필터 그룹 정의
const GENDER_FILTERS = [
  { key: '', label: '성별 전체' },
  { key: 'F', label: '여성' },
  { key: 'M', label: '남성' },
  { key: 'U', label: '공용' },
];

const CATEGORY_FILTERS = [
  { key: '', label: '카테고리 전체' },
  { key: 'outer', label: '아우터' },
  { key: 'tops', label: '상의' },
  { key: 'pants', label: '하의' },
  { key: 'shoes', label: '신발' },
];

// selectedCategory prop을 객체 형태로 변경: { gender: '', category: '' }
export default function ProductFilter({ selectedFilters, onFilterChange }) {
  const handleGenderChange = (genderKey) => {
    onFilterChange({ ...selectedFilters, gender: genderKey });
  };

  const handleCategoryChange = (categoryKey) => {
    onFilterChange({ ...selectedFilters, category: categoryKey });
  };

  return (
    <div className="filter-container mb-6 p-4 border rounded-md">
      {/* 성별 필터 */}
      <div className="filter-group mb-3">
        <h4 className="text-sm font-medium mb-1 text-gray-600">성별</h4>
        <div className="filter-bar flex flex-wrap gap-2">
          {GENDER_FILTERS.map(({ key, label }) => (
            <button
              key={`gender-${key}`}
              className={`px-3 py-1 rounded text-xs
                ${selectedFilters.gender === key
                  ? 'bg-black text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'}`}
              onClick={() => handleGenderChange(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* 카테고리 필터 */}
      <div className="filter-group">
        <h4 className="text-sm font-medium mb-1 text-gray-600">상품 유형</h4>
        <div className="filter-bar flex flex-wrap gap-2">
          {CATEGORY_FILTERS.map(({ key, label }) => (
            <button
              key={`category-${key}`}
              className={`px-3 py-1 rounded text-xs
                ${selectedFilters.category === key
                  ? 'bg-black text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'}`}
              onClick={() => handleCategoryChange(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}