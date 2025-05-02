import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // 🔹 라우터 추가

import './assets/css/reset.css';
import './assets/css/style.css';

import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';
import Slider from './components/Slider';
import Image from './components/Image';
import ImgText from './components/ImgText';
import Card from './components/Card';
import Banner from './components/Banner';
import Text from './components/Text';
import LoginPage from './pages/Login';

import Signup from './pages/Signup'; // 🔹 소문자 파일 이름 기준 import

import { useAuth } from './context/AuthContext';

const HomePage = () => (
  <>
    <Header element="nexon" />
    <Main>
      <Slider element="nexon" />
      <Image element="section nexon" title="포트폴리오가 실력이다." />
      <ImgText element="section nexon gray" title="이미지 텍스트 유형" />
      <Card element="section nexon" title="웹스토리보이 강의" />
      <Banner element="nexon" title="배너 영역" />
      <Text element="section nexon" title="텍스트 유형01" />
    </Main>
    <Footer element="nexon section gray" />
  </>
);

const App = () => {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} /> {/* 로그인 경로*/}
        <Route
          path="*"
          element={<Navigate to={user ? '/' : '/login'} replace />}
        /> {/* 🔹 로그인 상태에 따라 어디로 이동할지 경로*/}
        <Route path="/signup" element={<Signup />} /> {/* 🔹 회원가입 경로 */}
      </Routes>
    </Router>
  );
};

export default App;
