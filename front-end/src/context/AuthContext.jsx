// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { getMyProfileAPI } from '../api/authApi';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const data = await getMyProfileAPI();
                    // تأكد بلي الـ API ديالك كيرجع الحساب فـ data.user أو data نيشان
                    setUser(data.user || data); 
                } catch (err) {
                    console.error("Token expired or invalid:", err);
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = (token, userData) => {
        localStorage.setItem('token', token);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};