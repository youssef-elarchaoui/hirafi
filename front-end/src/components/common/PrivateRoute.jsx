// src/components/common/PrivateRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

function PrivateRoute({ allowedRoles }) {
    const { user, loading } = useAuth();

    // إلا كان السيستيم مازال كيقرا الـ Token من الـ LocalStorage غانتسناو
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // إلا كان المستخدم ما داييرش تسجيل الدخول كاع، صيفطو لـ Login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // إلا كان داخل ولكن الـ Role ديالو ما مسموحش ليه يشوف هاد الصفحة
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/not-found" replace />;
    }

    // إلا كان كولشي هو هذاك، خليه يشوف الصفحة (Outlet)
    return <Outlet />;
}

export default PrivateRoute;