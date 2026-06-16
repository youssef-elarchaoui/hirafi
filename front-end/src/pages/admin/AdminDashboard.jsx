// src/pages/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardApi } from '../../api/dashboardApi';
import { useAuth } from '../../hooks/useAuth';
import { 
  FiUsers, FiPackage, FiDollarSign, FiClock,
  FiTrendingUp, FiEye, FiStar, FiShoppingBag,
  FiAlertCircle, FiBarChart2, FiCalendar,
  FiRefreshCw, FiUserCheck, FiUserX,
  FiCheckCircle, FiXCircle, FiHome,
  FiBriefcase, FiMessageSquare, FiSettings
} from 'react-icons/fi';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState('month');

    useEffect(() => {
        fetchDashboard();
    }, [selectedPeriod]);

    const fetchDashboard = async () => {
        try {
            setRefreshing(true);
            const response = await dashboardApi.getAdminDashboard();
            console.log('📊 Admin Dashboard:', response.data);
            
            if (response.data.success) {
                setDashboard(response.data.dashboard);
                setError(null);
            } else {
                setDashboard(getDefaultDashboard());
            }
        } catch (err) {
            console.error('Erreur API:', err);
            setError('Impossible de charger les données');
            setDashboard(getDefaultDashboard());
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const getDefaultDashboard = () => {
        return {
            stats: {
                totalUsers: 0,
                totalOrders: 0,
                pendingOrders: 0,
                totalRevenue: 0,
                totalFreelancers: 0,
                totalClients: 0,
                totalServices: 0,
                totalReviews: 0,
                totalAdmins: 0,
                revenueGrowth: 0,
                ordersGrowth: 0,
                usersGrowth: 0
            },
            alerts: [],
            recentOrders: [],
            recentUsers: [],
            monthlyRevenue: [
                { month: 'Jan', revenue: 0 },
                { month: 'Fév', revenue: 0 },
                { month: 'Mar', revenue: 0 },
                { month: 'Avr', revenue: 0 },
                { month: 'Mai', revenue: 0 },
                { month: 'Juin', revenue: 0 }
            ],
            topFreelancers: [],
            topServices: []
        };
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('fr-MA').format(price || 0);
    };

    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    // Calculer le maximum des revenus pour l'échelle du graphique
    const maxRevenue = Math.max(...(dashboard?.monthlyRevenue?.map(item => item.revenue) || [0]), 1);
    const getBarHeight = (revenue) => {
        return Math.max(20, (revenue / maxRevenue) * 100);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="relative w-12 h-12">
                    <div className="absolute inset-0 border-3 border-[#E8EDE6] rounded-full"></div>
                    <div className="absolute inset-0 border-3 border-[#3D5A3E] border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    const stats = dashboard?.stats || {};
    const alerts = dashboard?.alerts || [];
    const monthlyRevenue = dashboard?.monthlyRevenue || [];
    const topFreelancers = dashboard?.topFreelancers || [];
    const topServices = dashboard?.topServices || [];

    const statCards = [
        {
            title: 'Utilisateurs',
            value: stats.totalUsers || 0,
            icon: FiUsers,
            color: 'from-blue-500 to-cyan-500',
            bg: 'bg-blue-50',
            text: 'text-blue-600',
            growth: stats.usersGrowth || 0
        },
        {
            title: 'Commandes',
            value: stats.totalOrders || 0,
            icon: FiShoppingBag,
            color: 'from-purple-500 to-pink-500',
            bg: 'bg-purple-50',
            text: 'text-purple-600',
            growth: stats.ordersGrowth || 0
        },
        {
            title: 'Commandes en attente',
            value: stats.pendingOrders || 0,
            icon: FiClock,
            color: 'from-yellow-500 to-orange-500',
            bg: 'bg-yellow-50',
            text: 'text-yellow-600',
            growth: 0
        },
        {
            title: 'Revenus totaux',
            value: `${formatPrice(stats.totalRevenue)} DH`,
            icon: FiDollarSign,
            color: 'from-green-500 to-emerald-500',
            bg: 'bg-green-50',
            text: 'text-green-600',
            growth: stats.revenueGrowth || 0
        },
        {
            title: 'Freelancers',
            value: stats.totalFreelancers || 0,
            icon: FiUserCheck,
            color: 'from-indigo-500 to-purple-500',
            bg: 'bg-indigo-50',
            text: 'text-indigo-600',
            growth: 0
        },
        {
            title: 'Clients',
            value: stats.totalClients || 0,
            icon: FiUsers,
            color: 'from-teal-500 to-cyan-500',
            bg: 'bg-teal-50',
            text: 'text-teal-600',
            growth: 0
        },
        {
            title: 'Services',
            value: stats.totalServices || 0,
            icon: FiBriefcase,
            color: 'from-orange-500 to-red-500',
            bg: 'bg-orange-50',
            text: 'text-orange-600',
            growth: 0
        },
        {
            title: 'Avis',
            value: stats.totalReviews || 0,
            icon: FiStar,
            color: 'from-yellow-500 to-amber-500',
            bg: 'bg-yellow-50',
            text: 'text-yellow-600',
            growth: 0
        }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-heading font-bold text-[#1A1208]">
                        Tableau de bord
                    </h1>
                    <p className="text-[#6B5E4F] text-sm mt-1">
                        Vue d'ensemble de la plateforme
                    </p>
                </div>
                <div className="flex gap-3">
                    <select
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                        className="px-4 py-2 bg-white border border-[#E8E2D9] rounded-xl focus:outline-none focus:border-[#3D5A3E] text-sm"
                    >
                        <option value="week">Cette semaine</option>
                        <option value="month">Ce mois</option>
                        <option value="year">Cette année</option>
                    </select>
                    <button 
                        onClick={fetchDashboard}
                        disabled={refreshing}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E8E2D9] rounded-xl text-[#6B5E4F] hover:text-[#3D5A3E] transition-all disabled:opacity-50"
                    >
                        <FiRefreshCw className={refreshing ? 'animate-spin' : ''} size={16} />
                        Actualiser
                    </button>
                </div>
            </div>

            {/* Alertes */}
            {alerts.length > 0 && (
                <div className="space-y-2">
                    {alerts.map((alert, idx) => (
                        <div key={idx} className={`p-4 rounded-xl border ${
                            alert.type === 'danger' ? 'bg-red-50 border-red-200 text-red-700' :
                            alert.type === 'warning' ? 'bg-yellow-50 border-yellow-200 text-yellow-700' :
                            'bg-blue-50 border-blue-200 text-blue-700'
                        }`}>
                            <div className="flex items-center gap-3">
                                <FiAlertCircle size={20} />
                                <span>{alert.message}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat, idx) => (
                    <div key={idx} className="bg-white rounded-2xl border border-[#E8E2D9] p-5 hover:shadow-lg transition-all">
                        <div className="flex items-start justify-between mb-3">
                            <div className={`p-2 rounded-xl ${stat.bg}`}>
                                <stat.icon className={stat.text} size={20} />
                            </div>
                            {stat.growth > 0 && (
                                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
                                    <FiTrendingUp size={12} />
                                    +{stat.growth}%
                                </span>
                            )}
                        </div>
                        <h3 className="text-2xl font-heading font-bold text-[#1A1208]">
                            {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                        </h3>
                        <p className="text-[#6B5E4F] text-sm mt-1">{stat.title}</p>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <div className="bg-white rounded-2xl border border-[#E8E2D9] p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-heading font-semibold text-[#1A1208] flex items-center gap-2">
                            <FiBarChart2 size={18} className="text-[#3D5A3E]" />
                            Évolution des revenus
                        </h2>
                        <span className="text-xs text-[#6B5E4F] flex items-center gap-1">
                            <FiCalendar size={12} />
                            {selectedPeriod === 'week' ? '7 jours' : selectedPeriod === 'month' ? '6 mois' : '12 mois'}
                        </span>
                    </div>
                    <div className="h-52 sm:h-64">
                        {monthlyRevenue.length > 0 && monthlyRevenue.some(m => m.revenue > 0) ? (
                            <div className="flex items-end justify-between h-full gap-1 sm:gap-2">
                                {monthlyRevenue.map((item, idx) => (
                                    <div key={idx} className="flex-1 flex flex-col items-center gap-1 sm:gap-2">
                                        <div 
                                            className="w-full bg-gradient-to-t from-[#3D5A3E] to-[#C47D4E] rounded-lg transition-all duration-500 hover:opacity-80 cursor-pointer relative group"
                                            style={{ height: `${getBarHeight(item.revenue)}px`, maxHeight: '160px' }}
                                        >
                                            <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 bg-[#1A1208] text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                {item.revenue.toLocaleString()} DH
                                            </div>
                                        </div>
                                        <span className="text-[10px] sm:text-xs text-[#6B5E4F]">{item.month}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <div className="text-center">
                                    <p className="text-[#6B5E4F] text-sm">Aucune donnée de revenus</p>
                                    <p className="text-xs text-[#9B9082] mt-1">Les revenus apparaîtront après les premières commandes</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Top Freelancers */}
                <div className="bg-white rounded-2xl border border-[#E8E2D9] p-6">
                    <h2 className="font-heading font-semibold text-[#1A1208] mb-4 flex items-center gap-2">
                        <FiTrendingUp size={18} className="text-[#3D5A3E]" />
                        Top Artisans
                    </h2>
                    <div className="space-y-4">
                        {topFreelancers.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-[#6B5E4F] text-sm">Aucun artisan en vedette</p>
                            </div>
                        ) : (
                            topFreelancers.slice(0, 5).map((freelancer, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-3 bg-[#FAF8F5] rounded-xl">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#3D5A3E] to-[#2D452E] flex items-center justify-center text-white font-bold text-sm">
                                        {idx + 1}
                                    </div>
                                    <img 
                                        src={freelancer.avatar || `https://ui-avatars.com/api/?background=3D5A3E&color=fff&bold=true&name=${freelancer.name || 'U'}`}
                                        alt={freelancer.name}
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                    <div className="flex-1">
                                        <p className="font-medium text-[#1A1208] text-sm">{freelancer.name}</p>
                                        <p className="text-xs text-[#6B5E4F]">{freelancer.totalOrders || 0} commandes</p>
                                    </div>
                                    <div className="flex items-center gap-1 text-yellow-500">
                                        <FiStar className="fill-current" size={12} />
                                        <span className="text-sm font-medium text-[#1A1208]">{freelancer.rating || 0}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <div className="bg-white rounded-2xl border border-[#E8E2D9] p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-heading font-semibold text-[#1A1208] flex items-center gap-2">
                            <FiPackage className="text-[#3D5A3E]" />
                            Dernières commandes
                        </h2>
                        <Link to="/admin/orders" className="text-sm text-[#3D5A3E] hover:underline">
                            Voir tout
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {(dashboard?.recentOrders || []).slice(0, 5).map((order) => (
                            <div key={order._id} className="flex items-center justify-between p-3 bg-[#FAF8F5] rounded-xl hover:bg-[#E8EDE6] transition-all">
                                <div>
                                    <p className="font-medium text-[#1A1208] text-sm">{order.serviceId?.title || 'Service'}</p>
                                    <div className="flex items-center gap-2 text-xs text-[#6B5E4F]">
                                        <span>{order.clientId?.name || 'Client'}</span>
                                        <span>→</span>
                                        <span>{order.freelancerId?.name || 'Artisan'}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="font-semibold text-[#3D5A3E]">{formatPrice(order.price)} DH</span>
                                    <div className="text-xs text-[#6B5E4F]">{formatDate(order.createdAt)}</div>
                                </div>
                            </div>
                        ))}
                        {(!dashboard?.recentOrders || dashboard.recentOrders.length === 0) && (
                            <p className="text-[#6B5E4F] text-center py-4">Aucune commande récente</p>
                        )}
                    </div>
                </div>

                {/* Recent Users */}
                <div className="bg-white rounded-2xl border border-[#E8E2D9] p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-heading font-semibold text-[#1A1208] flex items-center gap-2">
                            <FiUsers className="text-[#3D5A3E]" />
                            Nouveaux utilisateurs
                        </h2>
                        <Link to="/admin/users" className="text-sm text-[#3D5A3E] hover:underline">
                            Voir tout
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {(dashboard?.recentUsers || []).slice(0, 5).map((user) => (
                            <div key={user._id} className="flex items-center gap-3 p-3 bg-[#FAF8F5] rounded-xl hover:bg-[#E8EDE6] transition-all">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#3D5A3E] to-[#2D452E] flex items-center justify-center text-white font-bold text-sm">
                                    {user.name?.charAt(0) || 'U'}
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-[#1A1208] text-sm">{user.name}</p>
                                    <p className="text-xs text-[#6B5E4F]">{user.email}</p>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                    user.role === 'admin' ? 'bg-red-50 text-red-600' :
                                    user.role === 'freelancer' ? 'bg-blue-50 text-blue-600' :
                                    'bg-green-50 text-green-600'
                                }`}>
                                    {user.role === 'freelancer' ? 'Artisan' : user.role === 'admin' ? 'Admin' : 'Client'}
                                </span>
                            </div>
                        ))}
                        {(!dashboard?.recentUsers || dashboard.recentUsers.length === 0) && (
                            <p className="text-[#6B5E4F] text-center py-4">Aucun nouvel utilisateur</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link 
                    to="/admin/users"
                    className="bg-white rounded-2xl border border-[#E8E2D9] p-5 hover:shadow-lg transition-all text-center group"
                >
                    <div className="text-4xl mb-3">👥</div>
                    <h3 className="font-heading font-semibold text-[#1A1208]">Gérer les utilisateurs</h3>
                    <p className="text-sm text-[#6B5E4F] mt-1 group-hover:text-[#3D5A3E] transition-colors">
                        Voir et gérer tous les comptes
                    </p>
                </Link>
                <Link 
                    to="/admin/orders"
                    className="bg-white rounded-2xl border border-[#E8E2D9] p-5 hover:shadow-lg transition-all text-center group"
                >
                    <div className="text-4xl mb-3">📦</div>
                    <h3 className="font-heading font-semibold text-[#1A1208]">Gérer les commandes</h3>
                    <p className="text-sm text-[#6B5E4F] mt-1 group-hover:text-[#3D5A3E] transition-colors">
                        Suivre toutes les commandes
                    </p>
                </Link>
                <Link 
                    to="/admin/services"
                    className="bg-white rounded-2xl border border-[#E8E2D9] p-5 hover:shadow-lg transition-all text-center group"
                >
                    <div className="text-4xl mb-3">🛠️</div>
                    <h3 className="font-heading font-semibold text-[#1A1208]">Gérer les services</h3>
                    <p className="text-sm text-[#6B5E4F] mt-1 group-hover:text-[#3D5A3E] transition-colors">
                        Modérer les services proposés
                    </p>
                </Link>
                <Link 
                    to="/admin/reviews"
                    className="bg-white rounded-2xl border border-[#E8E2D9] p-5 hover:shadow-lg transition-all text-center group"
                >
                    <div className="text-4xl mb-3">⭐</div>
                    <h3 className="font-heading font-semibold text-[#1A1208]">Gérer les avis</h3>
                    <p className="text-sm text-[#6B5E4F] mt-1 group-hover:text-[#3D5A3E] transition-colors">
                        Modérer les avis clients
                    </p>
                </Link>
            </div>

            {/* Footer Stats */}
            <div className="bg-white rounded-2xl border border-[#E8E2D9] p-4">
                <div className="flex flex-wrap justify-between items-center gap-4 text-sm text-[#6B5E4F]">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                            <FiUsers size={14} />
                            {stats.totalUsers || 0} utilisateurs
                        </span>
                        <span className="flex items-center gap-1">
                            <FiShoppingBag size={14} />
                            {stats.totalOrders || 0} commandes
                        </span>
                        <span className="flex items-center gap-1">
                            <FiBriefcase size={14} />
                            {stats.totalServices || 0} services
                        </span>
                    </div>
                    <div className="flex items-center gap-1">
                        <FiCalendar size={14} />
                        Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;