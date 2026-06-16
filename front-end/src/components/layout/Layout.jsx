// src/components/layout/Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

function Layout() {
    return (
        <div className="min-h-screen bg-bg flex flex-col justify-between text-text font-body">
            {/* Navbar en haut */}
            <Navbar /> 

            {/* Contenu dynamique des pages */}
            <main className="flex-grow">
                <Outlet />
            </main>

            {/* Footer en bas */}
                <Footer />
        </div>
    );
}

export default Layout;