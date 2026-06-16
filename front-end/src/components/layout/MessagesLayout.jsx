// src/components/layout/MessagesLayout.jsx
import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  FiArrowLeft, FiHome, FiMessageSquare, FiUsers,
  FiBell, FiUser, FiLogOut, FiMenu, FiX
} from 'react-icons/fi';

const MessagesLayout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FAF8F5] via-white to-[#FAF8F5]">
            
            {/* Mobile Header */}
            <div className="lg:hidden bg-white border-b border-[#E8E2D9] sticky top-0 z-30">
                <div className="flex items-center justify-between px-4 py-3">
                    <button 
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 rounded-lg hover:bg-[#E8EDE6] transition-colors"
                    >
                        {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                    </button>
                    
                    <Link to="/" className="text-xl font-display font-black text-[#3D5A3E]">
                        حريفي
                    </Link>
                    
                    <div className="flex items-center gap-3">
                        <button className="p-2 rounded-lg hover:bg-[#E8EDE6] transition-colors relative">
                            <FiBell size={20} />
                            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <img 
                            src={user?.avatar || `https://ui-avatars.com/api/?background=3D5A3E&color=fff&bold=true&name=${user?.name || 'User'}`}
                            alt={user?.name}
                            className="w-8 h-8 rounded-full object-cover"
                        />
                    </div>
                </div>
                
                {/* Bouton retour à l'accueil */}
                <div className="px-4 pb-3 border-t border-[#E8E2D9] pt-3">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-[#6B5E4F] hover:text-[#3D5A3E] transition-colors w-full justify-center py-2 bg-[#E8EDE6] rounded-xl text-sm"
                    >
                        <FiArrowLeft size={16} />
                        Retour à l'accueil
                    </button>
                </div>
            </div>

            {/* Mobile Menu Drawer */}
            {isMobileMenuOpen && (
                <>
                    <div 
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                    <div className="fixed left-0 top-0 bottom-0 w-72 bg-white z-50 lg:hidden shadow-xl animate-slide-in-left">
                        <div className="flex flex-col h-full">
                            {/* Profile Section */}
                            <div className="p-6 border-b border-[#E8E2D9] bg-gradient-to-r from-[#3D5A3E] to-[#2D452E]">
                                <div className="flex items-center gap-3">
                                    <img 
                                        src={user?.avatar || `https://ui-avatars.com/api/?background=fff&color=3D5A3E&bold=true&name=${user?.name || 'User'}`}
                                        alt={user?.name}
                                        className="w-12 h-12 rounded-full object-cover border-2 border-white"
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-white">{user?.name}</h3>
                                        <p className="text-white/70 text-xs">{user?.email}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Navigation */}
                            <div className="flex-1 py-4">
                                <Link
                                    to="/"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center gap-3 px-6 py-3 text-[#6B5E4F] hover:bg-[#E8EDE6] hover:text-[#3D5A3E] transition-all"
                                >
                                    <FiHome size={20} />
                                    <span className="font-medium">Accueil</span>
                                </Link>
                                <Link
                                    to="/messages"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 px-6 py-3 transition-all ${
                                        isActive('/messages')
                                            ? 'bg-[#E8EDE6] text-[#3D5A3E] border-r-4 border-[#3D5A3E]'
                                            : 'text-[#6B5E4F] hover:bg-[#E8EDE6] hover:text-[#3D5A3E]'
                                    }`}
                                >
                                    <FiMessageSquare size={20} />
                                    <span className="font-medium">Messages</span>
                                </Link>
                                <Link
                                    to={user?.role === 'client' ? '/client/dashboard' : '/freelancer/dashboard'}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center gap-3 px-6 py-3 text-[#6B5E4F] hover:bg-[#E8EDE6] hover:text-[#3D5A3E] transition-all"
                                >
                                    <FiUser size={20} />
                                    <span className="font-medium">Mon compte</span>
                                </Link>
                            </div>

                            {/* Footer */}
                            <div className="p-4 border-t border-[#E8E2D9] space-y-2">
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-3 w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <FiLogOut size={18} />
                                    <span className="font-medium">Déconnexion</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Desktop Layout */}
            <div className="hidden lg:flex">
                {/* Sidebar Desktop - Simplified */}
                <aside className="fixed left-0 top-0 bottom-0 w-20 bg-white border-r border-[#E8E2D9] flex flex-col items-center z-20">
                    {/* Logo */}
                    <div className="p-4 border-b border-[#E8E2D9] w-full flex justify-center">
                        <Link to="/" className="text-2xl font-display font-black text-[#3D5A3E]">
                            حرفي
                        </Link>
                    </div>

                    {/* Navigation Icons */}
                    <nav className="flex-1 py-6 flex flex-col items-center gap-2">
                        <Link
                            to="/"
                            className="p-3 rounded-xl text-[#6B5E4F] hover:bg-[#E8EDE6] hover:text-[#3D5A3E] transition-all"
                            title="Accueil"
                        >
                            <FiHome size={22} />
                        </Link>
                        <Link
                            to="/messages"
                            className={`p-3 rounded-xl transition-all ${
                                isActive('/messages')
                                    ? 'bg-[#E8EDE6] text-[#3D5A3E]'
                                    : 'text-[#6B5E4F] hover:bg-[#E8EDE6] hover:text-[#3D5A3E]'
                            }`}
                            title="Messages"
                        >
                            <FiMessageSquare size={22} />
                        </Link>
                        <Link
                            to={user?.role === 'client' ? '/client/dashboard' : '/freelancer/dashboard'}
                            className="p-3 rounded-xl text-[#6B5E4F] hover:bg-[#E8EDE6] hover:text-[#3D5A3E] transition-all"
                            title="Mon compte"
                        >
                            <FiUser size={22} />
                        </Link>
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-[#E8E2D9] w-full flex justify-center">
                        <button
                            onClick={handleLogout}
                            className="p-3 rounded-xl text-red-500 hover:bg-red-50 transition-all"
                            title="Déconnexion"
                        >
                            <FiLogOut size={22} />
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 ml-20">
                    {/* Header */}
                    <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-[#E8E2D9]">
                        <div className="flex items-center justify-between px-8 py-4">
                            <div className="flex items-center gap-4">
                                <h1 className="text-xl font-heading font-semibold text-[#1A1208] flex items-center gap-2">
                                    <FiMessageSquare className="text-[#3D5A3E]" />
                                    Messages
                                </h1>
                                <span className="text-sm text-[#6B5E4F]">Discutez avec les artisans</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <Link
                                    to="/"
                                    className="flex items-center gap-2 px-4 py-2 text-[#6B5E4F] hover:text-[#3D5A3E] hover:bg-[#E8EDE6] rounded-xl transition-all"
                                >
                                    <FiArrowLeft size={16} />
                                    <span className="text-sm font-medium">Retour à l'accueil</span>
                                </Link>
                                <div className="flex items-center gap-2 pl-4 border-l border-[#E8E2D9]">
                                    <img 
                                        src={user?.avatar || `https://ui-avatars.com/api/?background=3D5A3E&color=fff&bold=true&name=${user?.name || 'User'}`}
                                        alt={user?.name}
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                    <span className="text-sm font-medium text-[#1A1208]">{user?.name?.split(' ')[0]}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-6">
                        <Outlet />
                    </div>
                </main>
            </div>

            {/* Contenu mobile */}
            <div className="lg:hidden">
                <div className="p-4">
                    <Outlet />
                </div>
            </div>

            <style>{`
                @keyframes slideInLeft {
                    from {
                        transform: translateX(-100%);
                    }
                    to {
                        transform: translateX(0);
                    }
                }
                .animate-slide-in-left {
                    animation: slideInLeft 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

export default MessagesLayout;