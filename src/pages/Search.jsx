import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import ProductList from '../components/ProductList';

const Search = () => {
    const [searchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(''); 
    // searchTerm : React state에 저장된 값으로 useState로 관리되는 상태 값(비동기) 
    // => setState 후에 바로 사용 시, 값이 최신이 아닐 수 있으므로 초기 요청에는 query 사용 권장

    useEffect(() => {
        const query = searchParams.get('q'); // 즉시 추출된 값
        setSearchTerm(query || '');
        console.log(`👉🏻 검색된 키워드 : ${query}`); // searchTerm 대신 query
    }, [searchParams]); 

    // [백엔드 요청 관련 주석 처리]
    //useEffect(() => {
    //    const query = searchParams.get('q') || '';
    //    setSearchTerm(query);
    //  
    //    // 백엔드 요청에 바로 사용하려면 query 사용
    //    fetch(`/api/search?q=${query}`);
    //  }, [searchParams]);

    return (
        <div className="search-page">
            <div className="search-container">
                <SearchBar />
                <h1 className="search-title">검색된 키워드 : {searchTerm}</h1>
            </div>
            <div className="search-container">
                <ProductList />
            </div>
        </div>
    );
};

export default Search;