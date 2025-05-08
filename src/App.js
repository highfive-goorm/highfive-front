import React from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';

import './assets/css/reset.css';
import './assets/css/style.css';
import SearchBar from './components/SearchBar';
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';
import Slider from './components/Slider';
import Image from './components/Image';
import Card from './components/Card';
import PrivateRoute from './components/PrivateRoute';

import LoginPage from './pages/Login';
import Signup from './pages/Signup'; // 🔹 소문자 파일 이름 기준 import
import Product from './pages/Product'; //  상세 페이지
import Search from './pages/Search'; // 검색 페이지
import CartPage from './pages/Cart';

import { useAuth } from './context/AuthContext';
import ProductList from './components/ProductList';

const HomePage = () => (
  <>
    <SearchBar />
    <Main>
      <Card element="section nexon" title="추천 서비스" />
      <Slider element="nexon" title="광고 배너"/>
      {/*<Image element="section nexon" title="상품 리스트" />*/}
      <ProductList element="section nexon" title="상품 리스트 테스트" /> {/* 추가 */}
    </Main>
  </>
);

const App = () => {
  const { user } = useAuth();

  return (
    <>
      <Header element="nexon" />

      <Routes>
        {/* 메인 */}
        <Route path="/" element={<HomePage />} />

        {/* 공개 페이지 */}
        <Route path="/login"  element={<LoginPage />} />
        <Route path="/search" element={<Search />} />
        <Route path="/signup" element={<Signup />} />

        {/* 상세 페이지 */}
        <Route path="/product/:id" 
               element={<Product />} />

        {/* 장바구니(로그인 필요) */}
        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <CartPage />
            </PrivateRoute>
          }
        />

        {/* 그 외 모든 경로 */}
        <Route
          path="*"
          element={<Navigate to={user ? "/" : "/login"} replace />}
        />
      </Routes>

      <Footer element="nexon section gray" />
    </>
  );
};


export default App;

