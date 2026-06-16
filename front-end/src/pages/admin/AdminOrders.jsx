// src/pages/admin/AdminOrders.jsx
import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import toast from 'react-hot-toast';
import { 
  FiPackage, FiSearch, FiFilter, FiEye, FiRefreshCw,
  FiChevronLeft, FiChevronRight, FiDollarSign, FiClock,
  FiUser, FiCheck, FiX, FiAlertTriangle
} from 'react-icons/fi';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, [currentPage, statusFilter]);

    const fetchOrders = async () => {
        setLoading(true);
        setRefreshing(true);
        try {
            const params = new URLSearchParams();
            if (statusFilter !== 'all') params.append('status', statusFilter);
            params.append('page', currentPage);
            params.append('limit', 10);

            const response = await adminApi.getOrders(params);
            console.log('📦 Commandes reçues:', response.data);
            
            setOrders(response.data.orders || []);
            setTotalPages(response.data.pagination?.pages || 1);
        } catch (error) {
            console.error('Erreur:', error);
            toast.error('Impossible de charger les commandes');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const updateOrderStatus = async (orderId, status) => {
        const statusLabels = {
            'pending': 'en attente',
            'in-progress': 'en cours',
            'delivered': 'livrée',
            'completed': 'terminée',
            'cancelled': 'annulée'
        };
        
        const confirmUpdate = window.confirm(`Passer cette commande en statut "${statusLabels[status]}" ?`);
        if (!confirmUpdate) return;

        try {
            const response = await adminApi.updateOrderStatus(orderId, { status });
            if (response.data.success) {
                toast.success(`Statut mis à jour: ${statusLabels[status]}`);
                fetchOrders();
                if (selectedOrder?._id === orderId) {
                    setSelectedOrder(null);
                    setShowOrderModal(false);
                }
            }
        } catch (error) {
            toast.error('Erreur lors de la mise à jour');
        }
    };

    const viewOrderDetails = async (orderId) => {
        try {
            const response = await adminApi.getOrderById(orderId);
            setSelectedOrder(response.data.order);
            setShowOrderModal(true);
        } catch (error) {
            toast.error('Impossible de charger les détails');
        }
    };

    const getStatusBadge = (status) => {
        const config = {
            'pending': { label: 'En attente', color: 'bg-yellow-50 text-yellow-600', icon: FiClock },
            'in-progress': { label: 'En cours', color: 'bg-blue-50 text-blue-600', icon: FiPackage },
            'delivered': { label: 'Livré', color: 'bg-purple-50 text-purple-600' },
            'completed': { label: 'Terminé', color: 'bg-green-50 text-green-600', icon: FiCheck },
            'cancelled': { label: 'Annulé', color: 'bg-red-50 text-red-600', icon: FiX },
            'disputed': { label: 'Litige', color: 'bg-orange-50 text-orange-600', icon: FiAlertTriangle }
        };
        const { label, color } = config[status] || config.pending;
        return <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>{label}</span>;
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('fr-MA').format(price || 0);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
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

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-heading font-bold text-[#1A1208] flex items-center gap-2">
                        <FiPackage className="text-[#3D5A3E]" />
                        Commandes
                    </h1>
                    <p className="text-[#6B5E4F] text-sm mt-1">
                        Gérez toutes les commandes de la plateforme
                    </p>
                </div>
                <button 
                    onClick={fetchOrders}
                    disabled={refreshing}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E8E2D9] rounded-xl text-[#6B5E4F] hover:text-[#3D5A3E] transition-all"
                >
                    <FiRefreshCw className={refreshing ? 'animate-spin' : ''} size={16} />
                    Actualiser
                </button>
            </div>

            {/* Filter */}
            <div className="flex gap-3">
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 bg-white border border-[#E8E2D9] rounded-xl focus:outline-none focus:border-[#3D5A3E] text-sm"
                >
                    <option value="all">Tous les statuts</option>
                    <option value="pending">En attente</option>
                    <option value="in-progress">En cours</option>
                    <option value="delivered">Livré</option>
                    <option value="completed">Terminé</option>
                    <option value="cancelled">Annulé</option>
                    <option value="disputed">Litige</option>
                </select>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-2xl border border-[#E8E2D9] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[#FAF8F5] border-b border-[#E8E2D9]">
                            <tr>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B5E4F] uppercase">Service</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B5E4F] uppercase">Client</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B5E4F] uppercase">Artisan</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B5E4F] uppercase">Montant</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B5E4F] uppercase">Statut</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B5E4F] uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-8 text-[#6B5E4F]">
                                        Aucune commande trouvée
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
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
                                                <span className="text-sm text-[#6B5E4F]">
                                                    {order.clientId?.name || 'Client'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="text-sm text-[#6B5E4F]">
                                                {order.freelancerId?.name || 'Artisan'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="font-semibold text-[#3D5A3E]">{formatPrice(order.price)} DH</span>
                                        </td>
                                        <td className="py-3 px-4">{getStatusBadge(order.status)}</td>
                                        <td className="py-3 px-4">
                                            <button
                                                onClick={() => viewOrderDetails(order._id)}
                                                className="p-1.5 text-[#6B5E4F] hover:text-[#3D5A3E] rounded-lg hover:bg-[#E8EDE6] transition-all"
                                                title="Voir détails"
                                            >
                                                <FiEye size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="p-2 border border-[#E8E2D9] rounded-lg disabled:opacity-50 hover:border-[#3D5A3E] transition-all"
                    >
                        <FiChevronLeft size={18} />
                    </button>
                    <span className="flex items-center px-4 text-sm text-[#6B5E4F]">
                        Page {currentPage} sur {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 border border-[#E8E2D9] rounded-lg disabled:opacity-50 hover:border-[#3D5A3E] transition-all"
                    >
                        <FiChevronRight size={18} />
                    </button>
                </div>
            )}

            {/* Order Details Modal */}
            {showOrderModal && selectedOrder && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-xl font-heading font-bold text-[#1A1208]">
                                Détails de la commande
                            </h2>
                            <button
                                onClick={() => setShowOrderModal(false)}
                                className="p-1.5 rounded-lg hover:bg-[#E8EDE6] transition-all"
                            >
                                <FiX size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Info commande */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 bg-[#FAF8F5] rounded-xl">
                                    <p className="text-xs text-[#6B5E4F] uppercase">Service</p>
                                    <p className="font-medium text-[#1A1208]">{selectedOrder.serviceId?.title || 'N/A'}</p>
                                </div>
                                <div className="p-3 bg-[#FAF8F5] rounded-xl">
                                    <p className="text-xs text-[#6B5E4F] uppercase">Montant</p>
                                    <p className="font-medium text-[#3D5A3E]">{formatPrice(selectedOrder.price)} DH</p>
                                </div>
                                <div className="p-3 bg-[#FAF8F5] rounded-xl">
                                    <p className="text-xs text-[#6B5E4F] uppercase">Client</p>
                                    <p className="font-medium text-[#1A1208]">{selectedOrder.clientId?.name || 'N/A'}</p>
                                </div>
                                <div className="p-3 bg-[#FAF8F5] rounded-xl">
                                    <p className="text-xs text-[#6B5E4F] uppercase">Artisan</p>
                                    <p className="font-medium text-[#1A1208]">{selectedOrder.freelancerId?.name || 'N/A'}</p>
                                </div>
                                <div className="p-3 bg-[#FAF8F5] rounded-xl">
                                    <p className="text-xs text-[#6B5E4F] uppercase">Statut</p>
                                    <div>{getStatusBadge(selectedOrder.status)}</div>
                                </div>
                                <div className="p-3 bg-[#FAF8F5] rounded-xl">
                                    <p className="text-xs text-[#6B5E4F] uppercase">Date</p>
                                    <p className="font-medium text-[#1A1208]">{formatDate(selectedOrder.createdAt)}</p>
                                </div>
                            </div>

                            {/* Requis */}
                            {selectedOrder.requirements && (
                                <div className="p-3 bg-[#FAF8F5] rounded-xl">
                                    <p className="text-xs text-[#6B5E4F] uppercase">Description du projet</p>
                                    <p className="text-sm text-[#6B5E4F] mt-1">{selectedOrder.requirements}</p>
                                </div>
                            )}

                            {/* Actions Admin */}
                            <div className="pt-4 border-t border-[#E8E2D9]">
                                <p className="text-sm font-semibold text-[#1A1208] mb-3">Changer le statut</p>
                                <div className="flex flex-wrap gap-2">
                                    {['pending', 'in-progress', 'delivered', 'completed', 'cancelled'].map((status) => (
                                        <button
                                            key={status}
                                            onClick={() => updateOrderStatus(selectedOrder._id, status)}
                                            disabled={selectedOrder.status === status}
                                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                                selectedOrder.status === status
                                                    ? 'bg-[#E8EDE6] text-[#6B5E4F] cursor-not-allowed'
                                                    : 'bg-[#3D5A3E] text-white hover:bg-[#2D452E]'
                                            }`}
                                        >
                                            {status === 'pending' && 'En attente'}
                                            {status === 'in-progress' && 'En cours'}
                                            {status === 'delivered' && 'Livré'}
                                            {status === 'completed' && 'Terminé'}
                                            {status === 'cancelled' && 'Annulé'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOrders;