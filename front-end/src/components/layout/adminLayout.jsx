// src/components/layout/AdminLayout.jsx
import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  FiHome, FiUsers, FiPackage, FiBriefcase, FiStar,
  FiSettings, FiLogOut, FiMenu, FiX, FiChevronRight,
  FiTrendingUp, FiBell, FiArrowLeft, FiShield
} from 'react-icons/fi';

const AdminLayout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const menuItems = [
        { path: '/admin/dashboard', label: 'Tableau de bord', icon: FiHome },
        { path: '/admin/users', label: 'Utilisateurs', icon: FiUsers },
        { path: '/admin/orders', label: 'Commandes', icon: FiPackage },
        { path: '/admin/services', label: 'Services', icon: FiBriefcase },
        { path: '/admin/reviews', label: 'Avis', icon: FiStar },
        { path: '/admin/settings', label: 'Paramètres', icon: FiSettings },
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

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <>
                    <div 
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                    <div className="fixed left-0 top-0 bottom-0 w-72 bg-white z-50 lg:hidden shadow-xl animate-slide-in-left">
                        <div className="flex flex-col h-full">
                            <div className="p-6 border-b border-[#E8E2D9] bg-gradient-to-r from-[#3D5A3E] to-[#2D452E]">
                                <div className="flex items-center gap-3">
                                    <img 
                                        src={user?.avatar || `https://ui-avatars.com/api/?background=fff&color=3D5A3E&bold=true&name=${user?.name || 'User'}`}
                                        alt={user?.name}
                                        className="w-12 h-12 rounded-full object-cover border-2 border-white"
                                    />
                                    <div>
                                        <h3 className="font-semibold text-white">{user?.name}</h3>
                                        <p className="text-white/70 text-xs">{user?.email}</p>
                                        <span className="inline-block mt-1 px-2 py-0.5 bg-white/20 text-white text-xs rounded-full">
                                            Admin
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 py-4">
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
                <aside className="fixed left-0 top-0 bottom-0 w-72 bg-white border-r border-[#E8E2D9] flex flex-col z-20">
                    <div className="p-6 border-b border-[#E8E2D9]">
                        <Link to="/" className="flex items-center justify-between group">
                            <span className="text-2xl font-display font-black text-[#3D5A3E]">
                                حريفي
                            </span>
                            <FiShield className="text-[#C47D4E]" size={18} />
                        </Link>
                        <p className="text-xs text-[#6B5E4F] mt-1">Administration</p>
                    </div>

                    <div className="p-6 border-b border-[#E8E2D9] bg-gradient-to-r from-[#3D5A3E] to-[#2D452E]">
                        <div className="flex items-center gap-3">
                            <img 
                                src={user?.avatar || `https://ui-avatars.com/api/?background=fff&color=3D5A3E&bold=true&name=${user?.name || 'User'}`}
                                alt={user?.name}
                                className="w-14 h-14 rounded-full object-cover border-2 border-white"
                            />
                            <div>
                                <h3 className="font-semibold text-white">{user?.name}</h3>
                                <p className="text-white/70 text-xs">{user?.email}</p>
                                <span className="inline-block mt-1 px-2 py-0.5 bg-white/20 text-white text-xs rounded-full">
                                    Administrateur
                                </span>
                            </div>
                        </div>
                    </div>

                    <nav className="flex-1 py-6">
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

                <main className="flex-1 ml-72">
                    <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-[#E8E2D9]">
                        <div className="flex items-center justify-between px-8 py-4">
                            <div className="flex items-center gap-4">
                                <h1 className="text-xl font-heading font-semibold text-[#1A1208]">
                                    Administration
                                </h1>
                                <div className="flex items-center gap-2 text-sm text-[#6B5E4F]">
                                    <FiTrendingUp size={14} />
                                    <span>Tableau de bord</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <Link
                                    to="/"
                                    className="flex items-center gap-2 px-4 py-2 text-[#6B5E4F] hover:text-[#3D5A3E] hover:bg-[#E8EDE6] rounded-xl transition-all"
                                >
                                    <FiArrowLeft size={16} />
                                    <span className="text-sm font-medium">Accueil</span>
                                </Link>
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
                                    <span className="text-sm font-medium text-[#1A1208]">Admin</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 lg:p-8">
                        <Outlet />
                    </div>
                </main>
            </div>

            <div className="lg:hidden">
                <div className="p-4">
                    <Outlet />
                </div>
            </div>

            <style>{`
                @keyframes slideInLeft {
                    from { transform: translateX(-100%); }
                    to { transform: translateX(0); }
                }
                .animate-slide-in-left {
                    animation: slideInLeft 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

export default AdminLayout;