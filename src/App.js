// src/App.js
import React, { useState } from 'react';
import { Navigate, Routes, Route, useLocation } from 'react-router-dom';

import './assets/css/reset.css';
import './assets/css/style.css';

import SearchBar from './components/SearchBar';
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';
import Slider from './components/Slider';
import PrivateRoute from './components/PrivateRoute';
import ProductList from './components/ProductList';
import Recommend from './components/Recommend';

import LoginPage from './pages/Login';
import Signup from './pages/Signup';
import Product from './pages/Product';
import Search from './pages/Search';
import CartPage from './pages/Cart';
import Checkout from './pages/Checkout';
import Alerts from './pages/Alerts';

import MyPageHome    from './pages/mypage/Home';
import ProfilePage   from './pages/mypage/Profile';
import OrdersPage    from './pages/mypage/Orders';
import FavoritesPage from './pages/mypage/Favorites';

import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProductList from './pages/admin/products/AdminProductList';
import AdminProductForm from './pages/admin/products/AdminProductForm';
import AdminAdList from './pages/admin/ads/AdminAdList';
import AdminAdForm from './pages/admin/ads/AdminAdForm';
import AdminAlertList from './pages/admin/alerts/AdminAlertList';
import AdminAlertForm from './pages/admin/alerts/AdminAlertForm';

import PayApprove from './pages/pay/PayApprove';
import PayCancel from './pages/pay/PayCancel';
import PayFail from './pages/pay/PayFail';

import { useProducts } from './hooks/useProducts';

import { useAuth } from './context/AuthContext';

const HomePage = () => {
  const { products, loading } = useProducts('');

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <>
      <SearchBar />
      <Main>
        <Recommend element="section nexon" title="추천 서비스"/>
        <Slider element="nexon" title="광고 배너"/>
        <ProductList
          products={products}
          loading={loading}
          selectedCategory={selectedCategory}
          onFilterChange={cat => {
            setSelectedCategory(cat);
            setCurrentPage(1);
          }}
          currentPage={currentPage}
          productsPerPage={15}
          pageButtonCount={5}
          onPageChange={setCurrentPage}
        />
      </Main>
    </>
  );
};

const App = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  // 관리자 전용 접근 가드
  const RequireAdminAuth = ({ children }) => {
    const adminId = sessionStorage.getItem('adminId');
    return adminId ? children : <Navigate to="/admin" replace />;
  };
  const { user } = useAuth();

  return (
    <>
      {!isAdminRoute && <Header element="nexon" />}

      <Routes>
        {/* 관리자 페이지 */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <RequireAdminAuth>
              <AdminDashboard />
            </RequireAdminAuth>
          }
        />
        <Route
          path="/admin/products"
          element={
            <RequireAdminAuth>
              <AdminProductList />
            </RequireAdminAuth>
          }
        />
        <Route
          path="/admin/products/new"
          element={
            <RequireAdminAuth>
              <AdminProductForm />
            </RequireAdminAuth>
          }
        />
        <Route
          path="/admin/products/:id"
          element={
            <RequireAdminAuth>
              <AdminProductForm />
            </RequireAdminAuth>
          }
        />
        <Route
          path="/admin/ads"
          element={
            <RequireAdminAuth>
              <AdminAdList />
            </RequireAdminAuth>
          }
        />
        <Route
          path="/admin/ads/new"
          element={
            <RequireAdminAuth>
              <AdminAdForm />
            </RequireAdminAuth>
          }
        />
        <Route
          path="/admin/ads/:id"
          element={
            <RequireAdminAuth>
              <AdminAdForm />
            </RequireAdminAuth>
          }
        />
        <Route
          path="/admin/alerts"
          element={
            <RequireAdminAuth>
              <AdminAlertList />
            </RequireAdminAuth>
          }
        />
        <Route
          path="/admin/alerts/new"
          element={
            <RequireAdminAuth>
              <AdminAlertForm />
            </RequireAdminAuth>
          }
        />
        <Route
          path="/admin/alerts/:id"
          element={
            <RequireAdminAuth>
              <AdminAlertForm />
            </RequireAdminAuth>
          }
        />
        
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

        {/* 결제 페이지(로그인 필요) */}
        <Route
          path="/checkout"
          element={
            <PrivateRoute>
              <Checkout />
            </PrivateRoute>
          }
        />

        <Route
          path="/mypage"
          element={<PrivateRoute><MyPageHome /></PrivateRoute>}
        />
        <Route
          path="/mypage/profile"
          element={<PrivateRoute><ProfilePage /></PrivateRoute>}
        />
        <Route
          path="/mypage/orders"
          element={<PrivateRoute><OrdersPage /></PrivateRoute>}
        />
        <Route
          path="/mypage/favorites"
          element={<PrivateRoute><FavoritesPage /></PrivateRoute>}
        />

        {/* 로그인해야 접근 가능한 Alerts */}
        <Route
          path="/alerts"
          element={
            <PrivateRoute>
              <Alerts />
            </PrivateRoute>
          }
        />

        <Route
          path="/pay/approve" 
          element={<PayApprove />}
        />
        <Route
          path="/pay/cancel" 
          element={<PayCancel />}
        />
        <Route
          path="/pay/fail" 
          element={<PayFail />}
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