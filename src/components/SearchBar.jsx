// SearchBar.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate(`/search?q=${searchTerm}`);
    };

    return (
        <div className="header__search">
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="검색어를 입력하세요"
                    value={searchTerm}
                    onChange={handleSearch}
                    className="search-input"
                />
                <button type="submit" className="search-button">
                    검색
                </button>
            </form>
        </div>
    );
};

export default SearchBar;