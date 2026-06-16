// src/pages/freelancer/FreelancerDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardApi } from '../../api/dashboardApi';
import { useAuth } from '../../hooks/useAuth';
import { 
  FiPackage, FiCheckCircle, FiClock, FiTrendingUp, 
  FiDollarSign, FiEye, FiStar, FiPlus, FiArrowRight,
  FiAlertCircle, FiBarChart2, FiShoppingBag, FiCalendar,
  FiRefreshCw, FiBriefcase, FiUser, FiMapPin, FiAward,
  FiGrid, FiList
} from 'react-icons/fi';

const FreelancerDashboard = () => {
    const { user } = useAuth();
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [viewMode, setViewMode] = useState('grid');

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            setRefreshing(true);
            const response = await dashboardApi.getFreelancerDashboard();
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
                totalEarnings: user?.totalEarnings || 0,
                pendingEarnings: 0,
                activeServices: 0,
                totalServiceViews: 0,
                averageRating: user?.rating || 5,
                totalReviews: 0
            },
            recentOrders: [],
            monthlyEarnings: [
                { month: 'Jan', earnings: 0 },
                { month: 'Fév', earnings: 0 },
                { month: 'Mar', earnings: 0 },
                { month: 'Avr', earnings: 0 },
                { month: 'Mai', earnings: 0 },
                { month: 'Juin', earnings: 0 }
            ],
            services: []
        };
    };

    const maxEarnings = Math.max(...(dashboard?.monthlyEarnings?.map(item => item.earnings) || [0]), 1);
    const getBarHeight = (earnings) => {
        return Math.max(30, (earnings / maxEarnings) * 100);
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="relative w-12 h-12">
                    <div className="absolute inset-0 border-3 border-[#E8EDE6] rounded-full"></div>
                    <div className="absolute inset-0 border-3 border-[#3D5A3E] border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    const stats = dashboard?.stats || {};
    const recentOrders = dashboard?.recentOrders || [];
    const services = dashboard?.services || [];
    const monthlyEarnings = dashboard?.monthlyEarnings || [];

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
            title: 'Services actifs',
            value: stats.activeServices || 0,
            icon: FiBriefcase,
            color: 'from-purple-500 to-pink-500',
            bg: 'bg-purple-50',
            text: 'text-purple-600'
        },
        {
            title: 'Revenus totaux',
            value: `${(stats.totalEarnings || 0).toLocaleString()} DH`,
            icon: FiDollarSign,
            color: 'from-emerald-500 to-teal-500',
            bg: 'bg-emerald-50',
            text: 'text-emerald-600'
        },
        {
            title: 'Note moyenne',
            value: stats.averageRating || 5,
            suffix: '★',
            icon: FiStar,
            color: 'from-yellow-500 to-orange-500',
            bg: 'bg-yellow-50',
            text: 'text-yellow-600'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Stats Grid - Responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {statCards.map((stat, idx) => (
                    <div key={idx} className="bg-white rounded-2xl border border-[#E8E2D9] p-4 sm:p-5 hover:shadow-lg transition-all">
                        <div className="flex items-start justify-between mb-3">
                            <div className={`p-2 rounded-xl ${stat.bg}`}>
                                <stat.icon className={stat.text} size={18} />
                            </div>
                            <span className={`text-xs font-semibold ${stat.text} ${stat.bg} px-2 py-1 rounded-full`}>
                                {stat.suffix ? stat.value : typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                            </span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-heading font-bold text-[#1A1208]">
                            {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                        </h3>
                        <p className="text-[#6B5E4F] text-xs sm:text-sm mt-1">{stat.title}</p>
                    </div>
                ))}
            </div>

            {/* Profile Card - Responsive */}
            <div className="bg-gradient-to-r from-[#3D5A3E] to-[#2D452E] rounded-2xl p-5 sm:p-6 text-white">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <img 
                            src={user?.avatar || `https://ui-avatars.com/api/?background=fff&color=3D5A3E&bold=true&name=${user?.name || 'User'}`}
                            alt={user?.name}
                            className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-white"
                        />
                        <div>
                            <h2 className="text-lg sm:text-xl font-heading font-bold">{user?.name}</h2>
                            <div className="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm text-white/80 mt-1">
                                <span className="flex items-center gap-1">
                                    <FiMapPin size={12} /> {user?.city || 'Maroc'}
                                </span>
                                <span className="flex items-center gap-1">
                                    <FiStar className="fill-current" size={12} /> {user?.rating || 5} / 5
                                </span>
                                {user?.isVerified && (
                                    <span className="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full text-xs">
                                        <FiAward size={10} /> Vérifié
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-4 sm:gap-6 w-full sm:w-auto justify-around sm:justify-start">
                        <div className="text-center">
                            <div className="text-xl sm:text-2xl font-bold">{user?.totalOrders || 0}</div>
                            <div className="text-xs text-white/70">Commandes</div>
                        </div>
                        <div className="text-center px-3 sm:px-4 border-l border-r border-white/20">
                            <div className="text-xl sm:text-2xl font-bold">{user?.totalEarnings?.toLocaleString() || 0} DH</div>
                            <div className="text-xs text-white/70">Revenus</div>
                        </div>
                        <div className="text-center">
                            <div className="text-xl sm:text-2xl font-bold">{user?.balance?.toLocaleString() || 0} DH</div>
                            <div className="text-xs text-white/70">Balance</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Section - Responsive */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Earnings Chart */}
                <div className="bg-white rounded-2xl border border-[#E8E2D9] p-5 sm:p-6">
                    <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                        <h2 className="font-heading font-semibold text-[#1A1208] flex items-center gap-2 text-sm sm:text-base">
                            <FiBarChart2 size={18} className="text-[#3D5A3E]" />
                            Évolution des revenus
                        </h2>
                        <span className="text-xs text-[#6B5E4F] flex items-center gap-1">
                            <FiCalendar size={12} />
                            Derniers 6 mois
                        </span>
                    </div>
                    <div className="h-52 sm:h-64">
                        {monthlyEarnings.length > 0 && monthlyEarnings.some(m => m.earnings > 0) ? (
                            <div className="flex items-end justify-between h-full gap-1 sm:gap-2">
                                {monthlyEarnings.map((item, idx) => (
                                    <div key={idx} className="flex-1 flex flex-col items-center gap-1 sm:gap-2">
                                        <div 
                                            className="w-full bg-gradient-to-t from-[#3D5A3E] to-[#C47D4E] rounded-lg transition-all duration-500 hover:opacity-80 cursor-pointer relative group"
                                            style={{ height: `${getBarHeight(item.earnings)}px`, maxHeight: '160px' }}
                                        >
                                            <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 bg-[#1A1208] text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                {item.earnings.toLocaleString()} DH
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
                                    <p className="text-xs text-[#9B9082] mt-1">Les revenus apparaîtront après vos premières commandes</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Skills Section */}
                <div className="bg-white rounded-2xl border border-[#E8E2D9] p-5 sm:p-6">
                    <h2 className="font-heading font-semibold text-[#1A1208] mb-4 flex items-center gap-2 text-sm sm:text-base">
                        <FiAward size={18} className="text-[#3D5A3E]" />
                        Mes compétences
                    </h2>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {user?.skills?.map((skill, idx) => (
                            <span key={idx} className="px-2 sm:px-3 py-1 sm:py-1.5 bg-[#E8EDE6] text-[#3D5A3E] rounded-full text-xs sm:text-sm font-medium">
                                {skill}
                            </span>
                        )) || (
                            <p className="text-[#6B5E4F] text-sm">Aucune compétence renseignée</p>
                        )}
                    </div>
                    <div className="mt-4 pt-4 border-t border-[#E8E2D9]">
                        <div className="flex justify-between items-center">
                            <span className="text-xs sm:text-sm text-[#6B5E4F]">Tarif horaire</span>
                            <span className="font-semibold text-[#3D5A3E] text-sm sm:text-base">{user?.hourlyRate || 0} DH/heure</span>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                            <span className="text-xs sm:text-sm text-[#6B5E4F]">Statut du compte</span>
                            <span className={`text-xs sm:text-sm font-semibold ${user?.isVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                                {user?.isVerified ? 'Vérifié ✓' : 'En attente de vérification'}
                            </span>
                        </div>
                    </div>
                    <Link to="/freelancer/profile" className="mt-4 inline-flex items-center gap-1 text-sm text-[#3D5A3E] hover:gap-2 transition-all">
                        Modifier mon profil <FiArrowRight size={12} />
                    </Link>
                </div>
            </div>

            {/* Services Section */}
            <div className="bg-white rounded-2xl border border-[#E8E2D9] p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                    <h2 className="font-heading font-semibold text-[#1A1208] flex items-center gap-2 text-sm sm:text-base">
                        <FiBriefcase size={18} className="text-[#3D5A3E]" />
                        Mes services
                    </h2>
                    <div className="flex gap-2 self-end sm:self-auto">
                        <button 
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-[#E8EDE6] text-[#3D5A3E]' : 'text-[#9B9082] hover:bg-[#E8EDE6]'}`}
                        >
                            <FiGrid size={16} />
                        </button>
                        <button 
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-[#E8EDE6] text-[#3D5A3E]' : 'text-[#9B9082] hover:bg-[#E8EDE6]'}`}
                        >
                            <FiList size={16} />
                        </button>
                    </div>
                </div>
                
                {services.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-[#6B5E4F] text-sm mb-4">Vous n'avez pas encore créé de services</p>
                        <Link to="/services/new" className="inline-flex items-center gap-2 bg-[#3D5A3E] hover:bg-[#2D452E] text-white px-4 py-2 rounded-xl font-semibold transition-all text-sm">
                            <FiPlus size={16} />
                            Créer mon premier service
                        </Link>
                    </div>
                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {services.slice(0, 4).map((service) => (
                            <div key={service._id} className="p-3 bg-[#FAF8F5] rounded-xl">
                                <p className="font-medium text-[#1A1208] text-sm line-clamp-1">{service.title}</p>
                                <div className="flex items-center gap-3 text-xs text-[#6B5E4F] mt-1">
                                    <span className="flex items-center gap-1"><FiEye size={10} /> {service.views || 0}</span>
                                    <span className="flex items-center gap-1"><FiShoppingBag size={10} /> {service.orders || 0}</span>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-base font-bold text-[#3D5A3E]">{service.price} DH</span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                                        service.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                    }`}>
                                        {service.status === 'active' ? 'Actif' : 'Inactif'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {services.slice(0, 5).map((service) => (
                            <div key={service._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 p-3 bg-[#FAF8F5] rounded-xl">
                                <div>
                                    <p className="font-medium text-[#1A1208] text-sm line-clamp-1">{service.title}</p>
                                    <div className="flex items-center gap-3 text-xs text-[#6B5E4F] mt-1">
                                        <span className="flex items-center gap-1"><FiEye size={10} /> {service.views || 0} vues</span>
                                        <span className="flex items-center gap-1"><FiShoppingBag size={10} /> {service.orders || 0} commandes</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-base font-bold text-[#3D5A3E]">{service.price} DH</span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                                        service.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                    }`}>
                                        {service.status === 'active' ? 'Actif' : 'Inactif'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                
                {services.length > 0 && (
                    <div className="mt-4 text-center">
                        <Link to="/freelancer/services" className="inline-flex items-center gap-2 text-[#3D5A3E] text-sm font-medium hover:gap-3 transition-all">
                            Gérer mes services <FiArrowRight size={14} />
                        </Link>
                    </div>
                )}
            </div>

            {/* Recent Orders Table - Responsive */}
            <div className="bg-white rounded-2xl border border-[#E8E2D9} overflow-hidden">
                <div className="p-5 sm:p-6 border-b border-[#E8E2D9]">
                    <h2 className="font-heading font-semibold text-[#1A1208] flex items-center gap-2 text-sm sm:text-base">
                        <FiPackage size={18} className="text-[#3D5A3E]" />
                        Commandes récentes
                    </h2>
                </div>
                <div className="overflow-x-auto">
                    {recentOrders.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-[#6B5E4F] text-sm">Aucune commande pour le moment</p>
                            <p className="text-xs text-[#9B9082] mt-1">Les commandes apparaîtront après vos premières ventes</p>
                        </div>
                    ) : (
                        <table className="w-full min-w-[500px]">
                            <thead className="bg-[#FAF8F5] border-b border-[#E8E2D9]">
                                <tr>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B5E4F] uppercase">Service</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B5E4F] uppercase">Client</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B5E4F] uppercase">Montant</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B5E4F] uppercase">Statut</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B5E4F] uppercase">Date</th>
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
                                                    {order.clientId?.name?.charAt(0) || 'C'}
                                                </div>
                                                <span className="text-xs sm:text-sm text-[#6B5E4F]">
                                                    {order.clientId?.name || 'Client'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="font-semibold text-[#3D5A3E] text-sm sm:text-base">{order.price} DH</span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                                order.status === 'completed' ? 'bg-green-50 text-green-600' :
                                                order.status === 'pending' ? 'bg-yellow-50 text-yellow-600' :
                                                order.status === 'in-progress' ? 'bg-blue-50 text-blue-600' :
                                                'bg-gray-50 text-gray-600'
                                            }`}>
                                                {order.status === 'completed' ? 'Terminée' :
                                                 order.status === 'pending' ? 'En attente' :
                                                 order.status === 'in-progress' ? 'En cours' : order.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="text-xs sm:text-sm text-[#6B5E4F]">
                                                {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FreelancerDashboard;