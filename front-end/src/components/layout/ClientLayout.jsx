// src/components/layout/ClientLayout.jsx
import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  FiHome, FiPackage, FiUser, FiSettings, 
  FiLogOut, FiMenu, FiX, FiChevronRight, FiStar,
  FiTrendingUp, FiMessageSquare, FiBell, FiArrowLeft,
  FiShoppingBag, FiHeart, FiClock, FiDollarSign
} from 'react-icons/fi';

const ClientLayout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

const menuItems = [
    { path: '/client/dashboard', label: 'Tableau de bord', icon: FiHome },
    { path: '/client/orders', label: 'Mes commandes', icon: FiPackage },
    { path: '/client/wishlist', label: 'Liste de souhaits', icon: FiHeart },
    { path: '/client/messages', label: 'Messages', icon: FiMessageSquare }, // ✅ Ajouté
    { path: '/client/profile', label: 'Mon profil', icon: FiUser },
    { path: '/client/settings', label: 'Paramètres', icon: FiSettings },
];

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
                
                {/* Bouton retour à l'accueil sur mobile */}
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

            {/* Mobile Sidebar Drawer */}
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
                                        <div className="flex items-center gap-1 mt-1">
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Navigation Menu */}
                            <div className="flex-1 py-4 overflow-y-auto">
                                {menuItems.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`flex items-center gap-3 px-6 py-3 transition-all ${
                                            isActive(item.path)
                                                ? 'bg-[#E8EDE6] text-[#3D5A3E] border-r-4 border-[#3D5A3E]'
                                                : 'text-[#6B5E4F] hover:bg-[#E8EDE6] hover:text-[#3D5A3E]'
                                        }`}
                                    >
                                        <item.icon size={20} />
                                        <span className="font-medium">{item.label}</span>
                                        {isActive(item.path) && <FiChevronRight className="ml-auto" size={16} />}
                                    </Link>
                                ))}
                            </div>

                            {/* Footer */}
                            <div className="p-4 border-t border-[#E8E2D9] space-y-2">
                                <Link 
                                    to="/" 
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center gap-3 w-full px-4 py-2 text-[#6B5E4F] hover:bg-[#E8EDE6] rounded-lg transition-colors"
                                >
                                    <FiArrowLeft size={18} />
                                    <span className="font-medium">Retour à l'accueil</span>
                                </Link>
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
                {/* Sidebar Desktop */}
                <aside className="fixed left-0 top-0 bottom-0 w-72 bg-white border-r border-[#E8E2D9] flex flex-col z-20">
                    {/* Logo */}
                    <div className="p-6 border-b border-[#E8E2D9]">
                        <Link to="/" className="flex items-center justify-between group">
                            <span className="text-2xl font-display font-black text-[#3D5A3E]">
                                حريفي
                            </span>
                            <FiArrowLeft className="text-[#3D5A3E] opacity-0 group-hover:opacity-100 transition-opacity" size={18} />
                        </Link>
                    </div>

                    {/* Profile Section */}
                    <div className="p-6 border-b border-[#E8E2D9] bg-gradient-to-r from-[#3D5A3E] to-[#2D452E]">
                        <div className="flex items-center gap-3">
                            <img 
                                src={user?.avatar || `https://ui-avatars.com/api/?background=fff&color=3D5A3E&bold=true&name=${user?.name || 'User'}`}
                                alt={user?.name}
                                className="w-14 h-14 rounded-full object-cover border-2 border-white"
                            />
                            <div className="flex-1">
                                <h3 className="font-semibold text-white">{user?.name}</h3>
                                <p className="text-white/70 text-xs">{user?.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 py-6 overflow-y-auto">
                        {menuItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-6 py-3 transition-all ${
                                    isActive(item.path)
                                        ? 'bg-[#E8EDE6] text-[#3D5A3E] border-r-4 border-[#3D5A3E]'
                                        : 'text-[#6B5E4F] hover:bg-[#E8EDE6] hover:text-[#3D5A3E]'
                                }`}
                            >
                                <item.icon size={20} />
                                <span className="font-medium">{item.label}</span>
                                {isActive(item.path) && <FiChevronRight className="ml-auto" size={16} />}
                            </Link>
                        ))}
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-[#E8E2D9] space-y-2">
                        <Link 
                            to="/" 
                            className="flex items-center gap-3 w-full px-4 py-2 text-[#6B5E4F] hover:bg-[#E8EDE6] rounded-lg transition-colors"
                        >
                            <FiArrowLeft size={18} />
                            <span className="font-medium">Retour à l'accueil</span>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <FiLogOut size={18} />
                            <span className="font-medium">Déconnexion</span>
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 ml-72">
                    {/* Desktop Header */}
                    <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-[#E8E2D9]">
                        <div className="flex items-center justify-between px-8 py-4">
                            <div className="flex items-center gap-4">
                                <h1 className="text-xl font-heading font-semibold text-[#1A1208]">
                                    Espace Client
                                </h1>
                                <div className="flex items-center gap-2 text-sm text-[#6B5E4F]">
                                    <FiTrendingUp size={14} />
                                    <span>Tableau de bord</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => navigate('/')}
                                    className="flex items-center gap-2 px-4 py-2 text-[#6B5E4F] hover:text-[#3D5A3E] hover:bg-[#E8EDE6] rounded-xl transition-all"
                                >
                                    <FiArrowLeft size={16} />
                                    <span className="text-sm font-medium">Retour à l'accueil</span>
                                </button>
                                <button className="p-2 rounded-lg hover:bg-[#E8EDE6] transition-colors relative">
                                    <FiBell size={20} />
                                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                                </button>
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
                    <div className="p-6 lg:p-8">
                        <Outlet />
                    </div>
                </main>
            </div>

            {/* Pour mobile, afficher le contenu en dessous du header */}
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

export default ClientLayout;