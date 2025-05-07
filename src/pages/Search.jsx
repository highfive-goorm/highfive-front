import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import Image from '../components/Image'

const Search = () => {
    const [searchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const query = searchParams.get('q');
        setSearchTerm(query || '');
    }, [searchParams]);

    return (
        <div className="search-page">
            <div className="search-container">
                <SearchBar />
                <h1 className="search-title">검색된 키워드 : {searchTerm}</h1>
            </div>
            <div className="search-container">

                <Image element="section nexon" title="상품 리스트" />
            </div>
        </div>
    );
};

export default Search;