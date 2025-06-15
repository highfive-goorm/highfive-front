// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute({ children }) {
    const { user, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        // 인증 상태 확인 중에는 로딩 인디케이터 또는 null 반환
        return <div>Loading auth state...</div>; // 또는 원하는 로딩 UI
    }

    return user ? children : <Navigate to="/login" state={{ from: location }} replace />;
}