// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { getMyProfileAPI } from '../api/authApi';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            console.log('🔐 AuthContext - Token présent?', !!token);
            
            if (token) {
                try {
                    const data = await getMyProfileAPI();
                    console.log('🔐 AuthContext - Données reçues:', data);
                    const userData = data.user || data;
                    setUser(userData);
                    setIsAuthenticated(true);
                    console.log('✅ Utilisateur authentifié:', userData.name);
                } catch (err) {
                    console.error("❌ Token expired or invalid:", err);
                    localStorage.removeItem('token');
                    setIsAuthenticated(false);
                }
            } else {
                console.log('⏳ Aucun token trouvé');
                setIsAuthenticated(false);
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = (token, userData) => {
        console.log('🔐 Login - Utilisateur:', userData.name);
        localStorage.setItem('token', token);
        setUser(userData);
        setIsAuthenticated(true);
    };

    const logout = () => {
        console.log('🔐 Logout');
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
    };

    const value = {
        user,
        setUser,
        loading,
        isAuthenticated,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};  