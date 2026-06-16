// src/pages/client/ClientDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardApi } from '../../api/dashboardApi';
import { useAuth } from '../../hooks/useAuth';
import { 
  FiPackage, FiCheckCircle, FiClock, FiTrendingUp, 
  FiDollarSign, FiEye, FiStar, FiArrowRight,
  FiAlertCircle, FiBarChart2, FiShoppingBag, FiCalendar,
  FiRefreshCw, FiHeart, FiMessageSquare, FiUser,
  FiMapPin, FiAward
} from 'react-icons/fi';

const ClientDashboard = () => {
    const { user } = useAuth();
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            setRefreshing(true);
            const response = await dashboardApi.getClientDashboard();
            if (response.data.success) {
                setDashboard(response.data.dashboard);
                setError(null);
            } else {
                setDashboard(getDefaultDashboard());
            }
        } catch (err) {
            console.error('Erreur API:', err);
            setDashboard(getDefaultDashboard());
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const getDefaultDashboard = () => {
        return {
            stats: {
                totalOrders: user?.totalOrders || 0,
                completedOrders: 0,
                pendingOrders: 0,
                inProgressOrders: 0,
                deliveredOrders: 0,
                totalSpent: 0
            },
            recentOrders: [],
            recentReviews: [],
            monthlySpending: [
                { month: 'Jan', spent: 0 },
                { month: 'Fév', spent: 0 },
                { month: 'Mar', spent: 0 },
                { month: 'Avr', spent: 0 },
                { month: 'Mai', spent: 0 },
                { month: 'Juin', spent: 0 }
            ]
        };
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('fr-MA').format(price || 0);
    };

    // Calculer le maximum des dépenses pour l'échelle du graphique
    const maxSpending = Math.max(...(dashboard?.monthlySpending?.map(item => item.spent) || [0]), 1);
    const getBarHeight = (spent) => {
        return Math.max(20, (spent / maxSpending) * 100);
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
    const recentOrders = dashboard?.recentOrders || [];
    const recentReviews = dashboard?.recentReviews || [];
    const monthlySpending = dashboard?.monthlySpending || [];

    const statCards = [
        {
            title: 'Commandes totales',
            value: stats.totalOrders || 0,
            icon: FiPackage,
            color: 'from-blue-500 to-cyan-500',
            bg: 'bg-blue-50',
            text: 'text-blue-600'
        },
        {
            title: 'Commandes terminées',
            value: stats.completedOrders || 0,
            icon: FiCheckCircle,
            color: 'from-green-500 to-emerald-500',
            bg: 'bg-green-50',
            text: 'text-green-600'
        },
        {
            title: 'En cours',
            value: stats.inProgressOrders || 0,
            icon: FiClock,
            color: 'from-orange-500 to-red-500',
            bg: 'bg-orange-50',
            text: 'text-orange-600'
        },
        {
            title: 'Dépenses totales',
            value: `${formatPrice(stats.totalSpent)} DH`,
            icon: FiDollarSign,
            color: 'from-purple-500 to-pink-500',
            bg: 'bg-purple-50',
            text: 'text-purple-600'
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
                        Bienvenue {user?.name}, suivez l'activité de vos commandes
                    </p>
                </div>
                <button 
                    onClick={fetchDashboard}
                    disabled={refreshing}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E8E2D9] rounded-xl text-[#6B5E4F] hover:text-[#3D5A3E] hover:border-[#3D5A3E] transition-all"
                >
                    <FiRefreshCw className={refreshing ? 'animate-spin' : ''} size={16} />
                    Actualiser
                </button>
            </div>

            {/* Profile Card */}
            <div className="bg-gradient-to-r from-[#3D5A3E] to-[#2D452E] rounded-2xl p-6 text-white">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <img 
                            src={user?.avatar || `https://ui-avatars.com/api/?background=fff&color=3D5A3E&bold=true&name=${user?.name || 'User'}`}
                            alt={user?.name}
                            className="w-16 h-16 rounded-full object-cover border-2 border-white"
                        />
                        <div>
                            <h2 className="text-xl font-heading font-bold">{user?.name}</h2>
                            <div className="flex flex-wrap gap-3 text-sm text-white/80 mt-1">
                                <span className="flex items-center gap-1">
                                    <FiMapPin size={14} /> {user?.city || 'Maroc'}
                                </span>
                                <span className="flex items-center gap-1">
                                    <FiShoppingBag size={14} /> {stats.totalOrders} commandes
                                </span>
                                {user?.isVerified && (
                                    <span className="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full text-xs">
                                        <FiAward size={12} /> Vérifié
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <Link 
                            to="/client/orders"
                            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all"
                        >
                            Voir mes commandes
                        </Link>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat, idx) => (
                    <div key={idx} className="bg-white rounded-2xl border border-[#E8E2D9] p-5 hover:shadow-lg transition-all">
                        <div className="flex items-start justify-between mb-3">
                            <div className={`p-2 rounded-xl ${stat.bg}`}>
                                <stat.icon className={stat.text} size={20} />
                            </div>
                            <span className={`text-xs font-semibold ${stat.text} ${stat.bg} px-2 py-1 rounded-full`}>
                                {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                            </span>
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
                {/* Spending Chart */}
                <div className="bg-white rounded-2xl border border-[#E8E2D9] p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-heading font-semibold text-[#1A1208] flex items-center gap-2">
                            <FiBarChart2 size={18} className="text-[#3D5A3E]" />
                            Évolution des dépenses
                        </h2>
                        <span className="text-xs text-[#6B5E4F] flex items-center gap-1">
                            <FiCalendar size={12} />
                            Derniers 6 mois
                        </span>
                    </div>
                    <div className="h-52 sm:h-64">
                        {monthlySpending.length > 0 && monthlySpending.some(m => m.spent > 0) ? (
                            <div className="flex items-end justify-between h-full gap-1 sm:gap-2">
                                {monthlySpending.map((item, idx) => (
                                    <div key={idx} className="flex-1 flex flex-col items-center gap-1 sm:gap-2">
                                        <div 
                                            className="w-full bg-gradient-to-t from-[#3D5A3E] to-[#C47D4E] rounded-lg transition-all duration-500 hover:opacity-80 cursor-pointer relative group"
                                            style={{ height: `${getBarHeight(item.spent)}px`, maxHeight: '160px' }}
                                        >
                                            <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 bg-[#1A1208] text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                {item.spent.toLocaleString()} DH
                                            </div>
                                        </div>
                                        <span className="text-[10px] sm:text-xs text-[#6B5E4F]">{item.month}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <div className="text-center">
                                    <p className="text-[#6B5E4F] text-sm">Aucune donnée de dépenses</p>
                                    <p className="text-xs text-[#9B9082] mt-1">Les dépenses apparaîtront après vos premières commandes</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Reviews */}
                <div className="bg-white rounded-2xl border border-[#E8E2D9] p-6">
                    <h2 className="font-heading font-semibold text-[#1A1208] mb-4 flex items-center gap-2">
                        <FiStar size={18} className="text-yellow-500" />
                        Mes derniers avis
                    </h2>
                    <div className="space-y-4">
                        {recentReviews.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-[#6B5E4F] text-sm">Vous n'avez pas encore laissé d'avis</p>
                                <Link to="/services" className="text-[#3D5A3E] text-sm font-medium hover:underline mt-2 inline-block">
                                    Découvrir des services
                                </Link>
                            </div>
                        ) : (
                            recentReviews.slice(0, 3).map((review) => (
                                <div key={review._id} className="p-3 bg-[#FAF8F5] rounded-xl">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#3D5A3E] to-[#2D452E] flex items-center justify-center text-white text-xs font-bold">
                                                {review.freelancerId?.name?.charAt(0) || 'A'}
                                            </div>
                                            <div>
                                                <p className="font-medium text-[#1A1208] text-sm">{review.freelancerId?.name || 'Artisan'}</p>
                                                <div className="flex items-center gap-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <FiStar key={i} className={i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'} size={10} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-xs text-[#6B5E4F]">{formatDate(review.createdAt)}</span>
                                    </div>
                                    <p className="text-[#6B5E4F] text-xs line-clamp-2">{review.comment}</p>
                                </div>
                            ))
                        )}
                    </div>
                    {recentReviews.length > 0 && (
                        <Link to="/client/reviews" className="mt-4 inline-flex items-center gap-1 text-sm text-[#3D5A3E] hover:gap-2 transition-all">
                            Voir tous mes avis <FiArrowRight size={12} />
                        </Link>
                    )}
                </div>
            </div>

            {/* Recent Orders Table */}
            <div className="bg-white rounded-2xl border border-[#E8E2D9] overflow-hidden">
                <div className="p-6 border-b border-[#E8E2D9] flex justify-between items-center">
                    <h2 className="font-heading font-semibold text-[#1A1208] flex items-center gap-2">
                        <FiPackage size={18} className="text-[#3D5A3E]" />
                        Commandes récentes
                    </h2>
                    <Link to="/client/orders" className="text-sm text-[#3D5A3E] hover:underline">
                        Voir toutes
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    {recentOrders.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-[#6B5E4F]">Aucune commande pour le moment</p>
                            <Link to="/services" className="text-[#3D5A3E] text-sm font-medium hover:underline mt-2 inline-block">
                                Explorer les services
                            </Link>
                        </div>
                    ) : (
                        <table className="w-full min-w-[600px]">
                            <thead className="bg-[#FAF8F5] border-b border-[#E8E2D9]">
                                <tr>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B5E4F] uppercase">Service</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B5E4F] uppercase">Artisan</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B5E4F] uppercase">Montant</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B5E4F] uppercase">Statut</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B5E4F] uppercase">Date</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B5E4F] uppercase">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map((order) => (
                                    <tr key={order._id} className="border-b border-[#E8E2D9] hover:bg-[#FAF8F5] transition-colors">
                                        <td className="py-3 px-4">
                                            <p className="font-medium text-[#1A1208] text-sm line-clamp-1">
                                                {order.serviceId?.title || 'Service'}
                                            </p>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-[#E8EDE6] flex items-center justify-center text-xs font-bold text-[#3D5A3E]">
                                                    {order.freelancerId?.name?.charAt(0) || 'A'}
                                                </div>
                                                <span className="text-sm text-[#6B5E4F]">
                                                    {order.freelancerId?.name || 'Artisan'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="font-semibold text-[#3D5A3E]">{formatPrice(order.price)} DH</span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                                order.status === 'completed' ? 'bg-green-50 text-green-600' :
                                                order.status === 'pending' ? 'bg-yellow-50 text-yellow-600' :
                                                order.status === 'in-progress' ? 'bg-blue-50 text-blue-600' :
                                                order.status === 'delivered' ? 'bg-purple-50 text-purple-600' :
                                                'bg-gray-50 text-gray-600'
                                            }`}>
                                                {order.status === 'completed' ? 'Terminée' :
                                                 order.status === 'pending' ? 'En attente' :
                                                 order.status === 'in-progress' ? 'En cours' :
                                                 order.status === 'delivered' ? 'Livrée' : order.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="text-sm text-[#6B5E4F]">
                                                {formatDate(order.createdAt)}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <Link 
                                                to={`/client/orders/${order._id}`}
                                                className="text-sm text-[#3D5A3E] hover:underline"
                                            >
                                                Détails
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link 
                    to="/services"
                    className="bg-white rounded-2xl border border-[#E8E2D9] p-5 hover:shadow-lg transition-all text-center group"
                >
                    <div className="text-4xl mb-3">🔍</div>
                    <h3 className="font-heading font-semibold text-[#1A1208]">Trouver un artisan</h3>
                    <p className="text-sm text-[#6B5E4F] mt-1 group-hover:text-[#3D5A3E] transition-colors">
                        Explorez les services disponibles
                    </p>
                </Link>
                <Link 
                    to="/client/orders"
                    className="bg-white rounded-2xl border border-[#E8E2D9] p-5 hover:shadow-lg transition-all text-center group"
                >
                    <div className="text-4xl mb-3">📦</div>
                    <h3 className="font-heading font-semibold text-[#1A1208]">Suivre mes commandes</h3>
                    <p className="text-sm text-[#6B5E4F] mt-1 group-hover:text-[#3D5A3E] transition-colors">
                        Voir l'avancement de vos projets
                    </p>
                </Link>
                <Link 
                    to="/client/wishlist"
                    className="bg-white rounded-2xl border border-[#E8E2D9] p-5 hover:shadow-lg transition-all text-center group"
                >
                    <div className="text-4xl mb-3">❤️</div>
                    <h3 className="font-heading font-semibold text-[#1A1208]">Liste de souhaits</h3>
                    <p className="text-sm text-[#6B5E4F] mt-1 group-hover:text-[#3D5A3E] transition-colors">
                        Retrouvez vos services favoris
                    </p>
                </Link>
            </div>

            <style>{`
                .line-clamp-1 {
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </div>
    );
};

export default ClientDashboard;