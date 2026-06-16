// src/components/common/PublicRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

function PublicRoute() {
    const { user, loading } = useAuth();

    // نتسناو السيستيم يقرا التوكن أولا
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // الـ Condition السحرية: إلا كان متصل، غانصيفطوه لـ Dashboard ديالو ديريكت
    if (user) {
        if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
        if (user.role === 'freelancer') return <Navigate to="/freelancer/dashboard" replace />;
        return <Navigate to="/client/dashboard" replace />; // الديفولت هو Client
    }

    // إلا كان ما متصلش، خليه يشوف الـ Login أو Register (Outlet)
    return <Outlet />;
}

export default PublicRoute;