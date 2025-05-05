// SearchBar.jsx
import React, { useState } from 'react';

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // 검색 기능 구현
        console.log('검색어:', searchTerm);
    };

    return (
        <div className="header__search">
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="검색어를 입력하세요"
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <button type="submit">검색</button>
            </form>
        </div>
    );
};

export default SearchBar;