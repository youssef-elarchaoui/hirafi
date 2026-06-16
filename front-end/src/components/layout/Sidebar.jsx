import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
// import  useAuth  from '../../hooks/useAuth';
import useLocalStorage from '../../hooks/useLocalStorage';
import { 
    FiHome, 
    FiBriefcase, 
    FiShoppingBag, 
    FiMessageSquare, 
    FiDollarSign, 
    FiStar,
    FiUsers,
    FiSettings,
    FiChevronLeft,
    FiChevronRight,
    FiBarChart2,
    FiArchive,
    FiTag
} from 'react-icons/fi';

const Sidebar = () => {
    const { user, isAdmin, isFreelancer, isClient } = useAuth();
    const [collapsed, setCollapsed, removeCollapsed] = useLocalStorage('sidebarCollapsed', false);
    const [isMobile, setIsMobile] = useState(false);
    const location = useLocation();

    // Détecter les écrans mobiles
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth < 768 && !collapsed) {
                setCollapsed(true);
            }
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, [collapsed, setCollapsed]);

    // Navigation items par rôle
    const getNavItems = () => {
        const commonItems = [
            { path: '/profile', icon: FiHome, label: 'Tableau de bord' }
        ];

        if (isAdmin) {
            return [
                { path: '/admin/dashboard', icon: FiBarChart2, label: 'Dashboard' },
                { path: '/admin/users', icon: FiUsers, label: 'Utilisateurs' },
                { path: '/admin/services', icon: FiBriefcase, label: 'Services' },
                { path: '/admin/orders', icon: FiShoppingBag, label: 'Commandes' },
                { path: '/admin/categories', icon: FiTag, label: 'Catégories' },
                { path: '/admin/reports', icon: FiArchive, label: 'Rapports' },
                { path: '/admin/settings', icon: FiSettings, label: 'Paramètres' }
            ];
        }

        if (isFreelancer) {
            return [
                { path: '/freelancer/dashboard', icon: FiBarChart2, label: 'Dashboard' },
                { path: '/freelancer/services', icon: FiBriefcase, label: 'Mes services' },
                { path: '/freelancer/orders', icon: FiShoppingBag, label: 'Commandes reçues' },
                { path: '/freelancer/earnings', icon: FiDollarSign, label: 'Gains' },
                { path: '/freelancer/wallet', icon: FiDollarSign, label: 'Portefeuille' },
                { path: '/messages', icon: FiMessageSquare, label: 'Messages' },
                { path: '/freelancer/reviews', icon: FiStar, label: 'Avis' }
            ];
        }

        if (isClient) {
            return [
                { path: '/client/dashboard', icon: FiBarChart2, label: 'Dashboard' },
                { path: '/client/orders', icon: FiShoppingBag, label: 'Mes commandes' },
                { path: '/client/wallet', icon: FiDollarSign, label: 'Portefeuille' },
                { path: '/messages', icon: FiMessageSquare, label: 'Messages' },
                { path: '/client/reviews', icon: FiStar, label: 'Mes avis' }
            ];
        }

        return commonItems;
    };

    const navItems = getNavItems();

    if (!user) return null;

    return (
        <>
            {/* Overlay mobile */}
            {!collapsed && isMobile && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40"
                    onClick={() => setCollapsed(true)}
                />
            )}
            
            {/* Sidebar */}
            <aside 
                className={`
                    fixed tablet:sticky top-16 left-0 h-[calc(100vh-4rem)] bg-bg dark:bg-bg-dark 
                    border-r border-border dark:border-border-dark transition-all duration-300 z-40
                    ${collapsed ? 'w-16' : 'w-64'}
                    ${isMobile && collapsed ? '-translate-x-full' : 'translate-x-0'}
                `}
            >
                {/* Toggle Button */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className={`
                        absolute -right-3 top-6 w-6 h-6 rounded-full bg-primary text-white
                        flex items-center justify-center hover:bg-primary-dark transition-colors
                        ${collapsed ? 'hidden tablet:flex' : 'hidden tablet:flex'}
                    `}
                >
                    {collapsed ? <FiChevronRight size={14} /> : <FiChevronLeft size={14} />}
                </button>

                {/* User Info */}
                {!collapsed && (
                    <div className="p-4 border-b border-border dark:border-border-dark">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary-light dark:bg-primary/20 flex items-center justify-center">
                                <span className="text-primary dark:text-primary font-semibold text-lg">
                                    {user?.name?.charAt(0) || 'U'}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-text dark:text-text-dark font-medium truncate">
                                    {user?.name}
                                </p>
                                <p className="text-text-secondary dark:text-text-secondary-dark text-caption capitalize">
                                    {user?.role}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {collapsed && (
                    <div className="py-4 flex justify-center border-b border-border dark:border-border-dark">
                        <div className="w-8 h-8 rounded-full bg-primary-light dark:bg-primary/20 flex items-center justify-center">
                            <span className="text-primary dark:text-primary font-semibold">
                                {user?.name?.charAt(0) || 'U'}
                            </span>
                        </div>
                    </div>
                )}

                {/* Navigation Items */}
                <nav className="p-2 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path || 
                                        location.pathname.startsWith(item.path + '/');
                        
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={`
                                    flex items-center gap-3 px-3 py-2 rounded-btn transition-all duration-200
                                    ${isActive 
                                        ? 'bg-primary-light dark:bg-primary/20 text-primary' 
                                        : 'text-text-secondary dark:text-text-secondary-dark hover:bg-primary-light dark:hover:bg-primary/20 hover:text-text dark:hover:text-text-dark'
                                    }
                                    ${collapsed ? 'justify-center' : ''}
                                `}
                                title={collapsed ? item.label : ''}
                            >
                                <Icon size={20} />
                                {!collapsed && <span className="text-sm">{item.label}</span>}
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Footer Stats (optional) */}
                {!collapsed && isFreelancer && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border dark:border-border-dark">
                        <div className="text-center">
                            <p className="text-caption text-text-secondary dark:text-text-secondary-dark">
                                Solde disponible
                            </p>
                            <p className="text-h4 font-semibold text-primary">
                                {user?.balance?.toLocaleString() || 0} DH
                            </p>
                        </div>
                    </div>
                )}
            </aside>
        </>
    );
};

export default Sidebar;