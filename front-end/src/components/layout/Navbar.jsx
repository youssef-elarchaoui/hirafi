// src/components/layout/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
    FiBell, FiMessageSquare, FiUser, FiLogOut, 
    FiHome, FiCompass, FiShoppingBag, FiHeart, FiSettings,
    FiMenu, FiX, FiChevronDown, FiBriefcase, FiUsers, FiStar,
    FiTrendingUp, FiAward, FiHelpCircle, FiShield, FiMail, FiInfo
} from 'react-icons/fi';

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [notifications, setNotifications] = useState([
        { id: 1, message: 'Nouvelle commande reçue !', read: false, time: '2 min' },
        { id: 2, message: 'Votre service a été approuvé', read: false, time: '1 heure' },
        { id: 3, message: 'Message de Fatima Zahra', read: true, time: '3 heures' }
    ]);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
        setIsUserMenuOpen(false);
    }, [location]);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setIsMobileMenuOpen(false);
        setIsUserMenuOpen(false);
    };

    const getDashboardLink = () => {
        if (user?.role === 'admin') return '/admin/dashboard';
        if (user?.role === 'freelancer') return '/freelancer/dashboard';
        return '/client/dashboard';
    };

    const getDashboardIcon = () => {
        if (user?.role === 'admin') return <FiSettings />;
        if (user?.role === 'freelancer') return <FiBriefcase />;
        return <FiUser />;
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    // Navigation Links
    const navLinks = [
        { path: '/', label: 'Accueil', icon: <FiHome size={18} /> },
        { path: '/services', label: 'Services', icon: <FiCompass size={18} /> },
        { path: '/freelancers', label: 'Artisans', icon: <FiUsers size={18} /> },
        { path: '/how-it-works', label: 'Comment ça marche', icon: <FiHelpCircle size={18} /> },
        { path: '/success-stories', label: 'Success Stories', icon: <FiStar size={18} /> },
    ];

    // Footer Links (pour le mobile menu)
    const footerLinks = [
        { 
            title: 'À propos', 
            links: [
                { path: '/about', label: 'Qui sommes-nous ?', icon: <FiInfo size={16} /> },
                { path: '/contact', label: 'Contact', icon: <FiMail size={16} /> },
                { path: '/blog', label: 'Blog', icon: <FiTrendingUp size={16} /> }
            ]
        },
        { 
            title: 'Légal', 
            links: [
                { path: '/terms', label: 'Conditions générales', icon: <FiShield size={16} /> },
                { path: '/privacy', label: 'Confidentialité', icon: <FiShield size={16} /> },
                { path: '/faq', label: 'FAQ', icon: <FiHelpCircle size={16} /> }
            ]
        }
    ];

    return (
        <>
            {/* Main Navbar */}
            <nav className={`sticky top-0 z-50 transition-all duration-300 ${
                isScrolled 
                    ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg' 
                    : 'bg-[#FAF8F5] dark:bg-gray-900 border-b border-[#E8E2D9] dark:border-gray-700'
            }`}>
                <div className="max-w-[1280px] mx-auto px-4 md:px-6">
                    <div className="flex justify-between items-center h-16 md:h-[72px]">
                        
                        {/* Logo Section */}
                        <div className="flex items-center gap-6 md:gap-10">
                            <Link 
                                to="/" 
                                className="group relative"
                            >
                                <span className="text-2xl md:text-[2rem] font-display font-black text-[#3D5A3E] dark:text-[#3D5A3E] tracking-tight">
                                    حريفي
                                </span>
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#C47D4E] group-hover:w-full transition-all duration-300"></span>
                            </Link>
                            
                            {/* Desktop Navigation Links */}
                            <div className="hidden lg:flex items-center gap-1">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        className={`relative px-4 py-2 rounded-lg transition-all duration-200 ${
                                            location.pathname === link.path
                                                ? 'text-[#3D5A3E] dark:text-[#3D5A3E] font-semibold'
                                                : 'text-[#6B5E4F] dark:text-gray-400 hover:text-[#3D5A3E] dark:hover:text-[#3D5A3E] hover:bg-[#EBEFE8] dark:hover:bg-gray-800'
                                        }`}
                                    >
                                        <span className="flex items-center gap-2">
                                            {link.icon}
                                            {link.label}
                                        </span>
                                        {location.pathname === link.path && (
                                            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-[#C47D4E] rounded-full"></span>
                                        )}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Desktop Actions */}
                        <div className="hidden md:flex items-center gap-3">
                            {user ? (
                                <>
                                    {/* Notifications */}
                                    <div className="relative">
                                        <button 
                                            className="relative p-2 rounded-full hover:bg-[#EBEFE8] dark:hover:bg-gray-800 transition-all"
                                            onClick={() => {}}
                                        >
                                            <FiBell size={20} className="text-[#6B5E4F] dark:text-gray-400" />
                                            {unreadCount > 0 && (
                                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                                    {unreadCount}
                                                </span>
                                            )}
                                        </button>
                                    </div>

                                    {/* Messages */}
                                    <Link 
                                        to="/messages"
                                        className="relative p-2 rounded-full hover:bg-[#EBEFE8] dark:hover:bg-gray-800 transition-all"
                                    >
                                        <FiMessageSquare size={20} className="text-[#6B5E4F] dark:text-gray-400" />
                                    </Link>

                                    {/* User Menu */}
                                    <div className="relative">
                                        <button
                                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#EBEFE8] dark:hover:bg-gray-800 transition-all"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#3D5A3E] to-[#2D452E] flex items-center justify-center text-white font-semibold">
                                                {user.name?.charAt(0).toUpperCase() || 'U'}
                                            </div>
                                            <span className="text-sm font-medium text-[#1A1208] dark:text-white">
                                                {user.name?.split(' ')[0]}
                                            </span>
                                            <FiChevronDown size={16} className={`text-[#6B5E4F] transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                                        </button>

                                        {/* Dropdown Menu */}
                                        {isUserMenuOpen && (
                                            <>
                                                <div 
                                                    className="fixed inset-0 z-40"
                                                    onClick={() => setIsUserMenuOpen(false)}
                                                />
                                                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-[#E8E2D9] dark:border-gray-700 z-50 overflow-hidden animate-fade-in-up">
                                                    <div className="p-4 border-b border-[#E8E2D9] dark:border-gray-700">
                                                        <p className="font-semibold text-[#1A1208] dark:text-white">{user.name}</p>
                                                        <p className="text-xs text-[#6B5E4F] dark:text-gray-400">{user.email}</p>
                                                        <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full bg-[#EBEFE8] dark:bg-gray-700 text-[#3D5A3E]">
                                                            {user.role === 'freelancer' ? 'Artisan' : user.role === 'admin' ? 'Admin' : 'Client'}
                                                        </span>
                                                    </div>
                                                    <div className="py-2">
                                                        <Link 
                                                            to={getDashboardLink()}
                                                            className="flex items-center gap-3 px-4 py-2 text-[#1A1208] dark:text-gray-300 hover:bg-[#EBEFE8] dark:hover:bg-gray-700 transition-colors"
                                                        >
                                                            {getDashboardIcon()}
                                                            Tableau de bord
                                                        </Link>
                                                        <Link 
                                                            to="/profile"
                                                            className="flex items-center gap-3 px-4 py-2 text-[#1A1208] dark:text-gray-300 hover:bg-[#EBEFE8] dark:hover:bg-gray-700 transition-colors"
                                                        >
                                                            <FiUser size={18} />
                                                            Mon profil
                                                        </Link>
                                                        <Link 
                                                            to="/orders"
                                                            className="flex items-center gap-3 px-4 py-2 text-[#1A1208] dark:text-gray-300 hover:bg-[#EBEFE8] dark:hover:bg-gray-700 transition-colors"
                                                        >
                                                            <FiShoppingBag size={18} />
                                                            Mes commandes
                                                        </Link>
                                                        <Link 
                                                            to="/wishlist"
                                                            className="flex items-center gap-3 px-4 py-2 text-[#1A1208] dark:text-gray-300 hover:bg-[#EBEFE8] dark:hover:bg-gray-700 transition-colors"
                                                        >
                                                            <FiHeart size={18} />
                                                            Liste de souhaits
                                                        </Link>
                                                        <div className="border-t border-[#E8E2D9] dark:border-gray-700 my-1"></div>
                                                        <button
                                                            onClick={handleLogout}
                                                            className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                                        >
                                                            <FiLogOut size={18} />
                                                            Déconnexion
                                                        </button>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <Link 
                                        to="/login" 
                                        className="group relative px-5 py-2.5 bg-transparent text-[#3D5A3E] dark:text-[#3D5A3E] font-semibold rounded-lg transition-all duration-200 overflow-hidden border-2  dark:border-[#3D5A3E] hover:bg-[#3D5A3E] hover:text-white"
                                    >
                                        Connexion
                                    </Link>
                                    <Link 
                                        to="/register" 
                                        className="group relative px-5 py-2.5 bg-[#3D5A3E] hover:bg-[#2E452F] text-white rounded-lg font-semibold transition-all duration-200 overflow-hidden"
                                    >
                                        <span className="relative z-10">S'inscrire</span>
                                        <span className="absolute inset-0 bg-gradient-to-r from-[#C47D4E] to-[#3D5A3E] transform translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button 
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg text-[#1A1208] dark:text-white hover:bg-[#EBEFE8] dark:hover:bg-gray-800 transition-all"
                            aria-label="Menu"
                        >
                            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Bottom Navigation (when logged in) */}
            {user && (
                <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-[#E8E2D9] dark:border-gray-700 z-40 animate-slide-up">
                    <div className="flex justify-around items-center py-2">
                        <Link 
                            to="/"
                            className={`flex flex-col items-center p-2 transition-all ${
                                location.pathname === '/'
                                    ? 'text-[#3D5A3E] dark:text-[#3D5A3E]'
                                    : 'text-[#6B5E4F] dark:text-gray-400 hover:text-[#3D5A3E]'
                            }`}
                        >
                            <FiHome size={20} />
                            <span className="text-xs mt-1">Accueil</span>
                        </Link>
                        <Link 
                            to="/services"
                            className={`flex flex-col items-center p-2 transition-all ${
                                location.pathname === '/services'
                                    ? 'text-[#3D5A3E] dark:text-[#3D5A3E]'
                                    : 'text-[#6B5E4F] dark:text-gray-400 hover:text-[#3D5A3E]'
                            }`}
                        >
                            <FiCompass size={20} />
                            <span className="text-xs mt-1">Services</span>
                        </Link>
                        <Link 
                            to="/freelancers"
                            className={`flex flex-col items-center p-2 transition-all ${
                                location.pathname === '/freelancers'
                                    ? 'text-[#3D5A3E] dark:text-[#3D5A3E]'
                                    : 'text-[#6B5E4F] dark:text-gray-400 hover:text-[#3D5A3E]'
                            }`}
                        >
                            <FiUsers size={20} />
                            <span className="text-xs mt-1">Artisans</span>
                        </Link>
                        <Link 
                            to="/orders"
                            className={`flex flex-col items-center p-2 transition-all ${
                                location.pathname === '/orders'
                                    ? 'text-[#3D5A3E] dark:text-[#3D5A3E]'
                                    : 'text-[#6B5E4F] dark:text-gray-400 hover:text-[#3D5A3E]'
                            }`}
                        >
                            <FiShoppingBag size={20} />
                            <span className="text-xs mt-1">Commandes</span>
                        </Link>
                        <Link 
                            to={getDashboardLink()}
                            className={`flex flex-col items-center p-2 transition-all ${
                                location.pathname === getDashboardLink()
                                    ? 'text-[#3D5A3E] dark:text-[#3D5A3E]'
                                    : 'text-[#6B5E4F] dark:text-gray-400 hover:text-[#3D5A3E]'
                            }`}
                        >
                            {getDashboardIcon()}
                            <span className="text-xs mt-1">Profil</span>
                        </Link>
                    </div>
                </div>
            )}

            {/* Mobile Slide-out Menu */}
            {isMobileMenuOpen && (
                <>
                    <div 
                        className="fixed inset-0 bg-black/50 z-40 md:hidden animate-fade-in"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                    <div className="fixed right-0 top-0 bottom-0 w-80 bg-white dark:bg-gray-900 shadow-2xl z-50 md:hidden animate-slide-in-right overflow-y-auto">
                        {/* Mobile Menu Header */}
                        <div className="p-6 border-b border-[#E8E2D9] dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-900">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-2xl font-display font-black text-[#3D5A3E]">حريفي</span>
                                <button 
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="p-2 rounded-lg hover:bg-[#EBEFE8] dark:hover:bg-gray-800"
                                >
                                    <FiX size={24} />
                                </button>
                            </div>
                            {!user && (
                                <div className="flex gap-3">
                                    <Link 
                                        to="/login" 
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex-1 text-center px-4 py-2 text-[#1A1208] dark:text-white border border-[#E8E2D9] dark:border-gray-700 rounded-lg font-semibold hover:border-[#3D5A3E] transition-all"
                                    >
                                        Connexion
                                    </Link>
                                    <Link 
                                        to="/register" 
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex-1 text-center px-4 py-2 bg-[#3D5A3E] text-white rounded-lg font-semibold hover:bg-[#2E452F] transition-all"
                                    >
                                        Inscription
                                    </Link>
                                </div>
                            )}
                            {user && (
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#3D5A3E] to-[#2D452E] flex items-center justify-center text-white font-bold text-lg">
                                        {user.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-[#1A1208] dark:text-white">{user.name}</p>
                                        <p className="text-xs text-[#6B5E4F] dark:text-gray-400">{user.email}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Links */}
                        <div className="flex-1 py-4">
                            {/* Main Navigation */}
                            <div className="px-4">
                                <p className="text-xs font-semibold text-[#6B5E4F] dark:text-gray-400 uppercase tracking-wider mb-2 px-2">
                                    Navigation
                                </p>
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                                            location.pathname === link.path
                                                ? 'bg-[#EBEFE8] dark:bg-gray-800 text-[#3D5A3E] font-semibold'
                                                : 'text-[#1A1208] dark:text-gray-300 hover:bg-[#EBEFE8] dark:hover:bg-gray-800'
                                        }`}
                                    >
                                        {link.icon}
                                        {link.label}
                                    </Link>
                                ))}
                            </div>

                            {user && (
                                <>
                                    <div className="border-t border-[#E8E2D9] dark:border-gray-700 my-4"></div>
                                    
                                    {/* User Menu Items */}
                                    <div className="px-4">
                                        <p className="text-xs font-semibold text-[#6B5E4F] dark:text-gray-400 uppercase tracking-wider mb-2 px-2">
                                            Mon compte
                                        </p>
                                        <Link 
                                            to={getDashboardLink()} 
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#1A1208] dark:text-gray-300 hover:bg-[#EBEFE8] dark:hover:bg-gray-800 transition-all"
                                        >
                                            {getDashboardIcon()}
                                            Tableau de bord
                                        </Link>
                                        <Link 
                                            to="/profile" 
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#1A1208] dark:text-gray-300 hover:bg-[#EBEFE8] dark:hover:bg-gray-800 transition-all"
                                        >
                                            <FiUser size={18} />
                                            Mon profil
                                        </Link>
                                        <Link 
                                            to="/orders" 
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#1A1208] dark:text-gray-300 hover:bg-[#EBEFE8] dark:hover:bg-gray-800 transition-all"
                                        >
                                            <FiShoppingBag size={18} />
                                            Mes commandes
                                        </Link>
                                        <Link 
                                            to="/wishlist" 
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#1A1208] dark:text-gray-300 hover:bg-[#EBEFE8] dark:hover:bg-gray-800 transition-all"
                                        >
                                            <FiHeart size={18} />
                                            Liste de souhaits
                                        </Link>
                                        <Link 
                                            to="/messages" 
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#1A1208] dark:text-gray-300 hover:bg-[#EBEFE8] dark:hover:bg-gray-800 transition-all"
                                        >
                                            <FiMessageSquare size={18} />
                                            Messages
                                            {unreadCount > 0 && (
                                                <span className="ml-auto bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                                                    {unreadCount}
                                                </span>
                                            )}
                                        </Link>
                                    </div>
                                </>
                            )}

                            {/* Footer Links in Mobile Menu */}
                            <div className="border-t border-[#E8E2D9] dark:border-gray-700 my-4"></div>
                            
                            {footerLinks.map((section, idx) => (
                                <div key={idx} className="px-4 mb-4">
                                    <p className="text-xs font-semibold text-[#6B5E4F] dark:text-gray-400 uppercase tracking-wider mb-2 px-2">
                                        {section.title}
                                    </p>
                                    {section.links.map((link) => (
                                        <Link
                                            key={link.path}
                                            to={link.path}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center gap-3 px-4 py-2 rounded-lg text-[#1A1208] dark:text-gray-300 hover:bg-[#EBEFE8] dark:hover:bg-gray-800 transition-all text-sm"
                                        >
                                            {link.icon}
                                            {link.label}
                                        </Link>
                                    ))}
                                </div>
                            ))}

                            {user && (
                                <div className="px-4 mt-4 pt-4 border-t border-[#E8E2D9] dark:border-gray-700">
                                    <button 
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                                    >
                                        <FiLogOut size={18} />
                                        Déconnexion
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}

            {/* Bottom padding for mobile when logged in */}
            {user && <div className="md:hidden h-16" />}

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                    }
                    to {
                        transform: translateX(0);
                    }
                }
                @keyframes slideUp {
                    from {
                        transform: translateY(100%);
                    }
                    to {
                        transform: translateY(0);
                    }
                }
                .animate-fade-in {
                    animation: fadeIn 0.2s ease-out;
                }
                .animate-fade-in-up {
                    animation: fadeInUp 0.2s ease-out;
                }
                .animate-slide-in-right {
                    animation: slideInRight 0.3s ease-out;
                }
                .animate-slide-up {
                    animation: slideUp 0.3s ease-out;
                }
            `}</style>
        </>
    );
}

export default Navbar;