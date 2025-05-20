// src/components/ProductFilter.jsx
import React from 'react';

const CATEGORIES = [
  { key: '',     label: '전체' },
  { key: 'F',    label: '여성' },
  { key: 'M',    label: '남성' },
  { key: 'U',    label: '공용' },
  { key: 'outer',label: '아우터' },
  { key: 'tops', label: '상의' },
  { key: 'pants',label: '하의' },
  { key: 'shoes',label: '신발' },
];

export default function ProductFilter({ selectedCategory, onFilterChange }) {
  return (
    <div className="filter-bar flex flex-wrap justify-center gap-2 mb-4">
      {CATEGORIES.map(({ key, label }) => (
        <button
          key={key}
          className={`px-3 py-1 rounded
            ${selectedCategory === key
              ? 'bg-black text-white'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'}`}
          onClick={() => onFilterChange(key)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
