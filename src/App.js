import React from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';

import './assets/css/reset.css';
import './assets/css/style.css';
import SearchBar from './components/SearchBar'
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';
import Slider from './components/Slider';
import Image from './components/Image';
import Card from './components/Card';
import LoginPage from './pages/Login';

import Signup from './pages/Signup'; // 🔹 소문자 파일 이름 기준 import

import { useAuth } from './context/AuthContext';

const HomePage = () => (
  <>
    <Header element="nexon" />
    <SearchBar />
    <Main>
    <Card element="section nexon" title="추천 서비스" />
    <Slider element="nexon" title="광고 배너"/>
    <Image element="section nexon" title="상품 리스트" />
    </Main>
    <Footer element="nexon section gray" />
  </>
);

const App = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} /> {/* 로그인 경로*/}
      <Route
        path="*"
        element={<Navigate to={user ? '/' : '/login'} replace />}
        /> {/* 🔹 로그인 상태에 따라 어디로 이동할지 경로*/}
      <Route path="/signup" element={<Signup />} /> {/* 🔹 회원가입 경로 */}
    </Routes>
  );
};

export default App;
