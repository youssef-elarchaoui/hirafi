// src/pages/admin/AdminServices.jsx
import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import toast from 'react-hot-toast';
import { 
  FiBriefcase, FiSearch, FiFilter, FiEye, FiRefreshCw,
  FiChevronLeft, FiChevronRight, FiDollarSign, FiClock,
  FiUser, FiEdit2, FiTrash2, FiX, FiCheck,
  FiStar, FiTrendingUp
} from 'react-icons/fi';

const AdminServices = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedService, setSelectedService] = useState(null);
    const [showServiceModal, setShowServiceModal] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetchServices();
        fetchCategories();
    }, [currentPage, statusFilter, categoryFilter]);

    const fetchServices = async () => {
        setLoading(true);
        setRefreshing(true);
        try {
            const params = new URLSearchParams();
            if (statusFilter !== 'all') params.append('status', statusFilter);
            if (categoryFilter !== 'all') params.append('category', categoryFilter);
            if (searchTerm) params.append('search', searchTerm);
            params.append('page', currentPage);
            params.append('limit', 10);

            const response = await adminApi.getAllServices(params);
            console.log('🛠️ Services reçus:', response.data);
            
            setServices(response.data.services || []);
            setTotalPages(response.data.pagination?.pages || 1);
        } catch (error) {
            console.error('Erreur:', error);
            toast.error('Impossible de charger les services');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await adminApi.getCategories();
            setCategories(response.data.categories || []);
        } catch (error) {
            console.error('Erreur chargement catégories:', error);
        }
    };

    const updateServiceStatus = async (serviceId, status) => {
        const statusLabels = {
            'active': 'actif',
            'inactive': 'inactif',
            'deleted': 'supprimé'
        };
        
        const confirmUpdate = window.confirm(`Passer ce service en statut "${statusLabels[status]}" ?`);
        if (!confirmUpdate) return;

        try {
            const response = await adminApi.updateService(serviceId, { status });
            if (response.data.success) {
                toast.success(`Service ${statusLabels[status]}`);
                fetchServices();
            }
        } catch (error) {
            toast.error('Erreur lors de la mise à jour');
        }
    };

    const deleteService = async (serviceId, title) => {
        const confirmDelete = window.confirm(`Supprimer définitivement le service "${title}" ?`);
        if (!confirmDelete) return;

        try {
            const response = await adminApi.deleteService(serviceId);
            if (response.data.success) {
                toast.success('Service supprimé avec succès');
                fetchServices();
            }
        } catch (error) {
            toast.error('Erreur lors de la suppression');
        }
    };

    const getStatusBadge = (status) => {
        const config = {
            'active': { label: 'Actif', color: 'bg-green-50 text-green-600' },
            'inactive': { label: 'Inactif', color: 'bg-yellow-50 text-yellow-600' },
            'deleted': { label: 'Supprimé', color: 'bg-red-50 text-red-600' }
        };
        const { label, color } = config[status] || config.inactive;
        return <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>{label}</span>;
    };

    const getCategoryIcon = (category) => {
        const icons = {
            'graphic-design': '🎨',
            'web-development': '💻',
            'marketing': '📈',
            'writing': '✍️',
            'video': '🎥',
            'consulting': '💡'
        };
        return icons[category] || '📁';
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
                        <FiBriefcase className="text-[#3D5A3E]" />
                        Services
                    </h1>
                    <p className="text-[#6B5E4F] text-sm mt-1">
                        Modérez tous les services de la plateforme
                    </p>
                </div>
                <button 
                    onClick={fetchServices}
                    disabled={refreshing}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E8E2D9] rounded-xl text-[#6B5E4F] hover:text-[#3D5A3E] transition-all"
                >
                    <FiRefreshCw className={refreshing ? 'animate-spin' : ''} size={16} />
                    Actualiser
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 max-w-md">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9B9082]" size={18} />
                    <input
                        type="text"
                        placeholder="Rechercher un service..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && fetchServices()}
                        className="w-full pl-10 pr-4 py-2 bg-white border border-[#E8E2D9] rounded-xl focus:outline-none focus:border-[#3D5A3E] transition-all"
                    />
                </div>
                <div className="flex gap-3">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 bg-white border border-[#E8E2D9] rounded-xl focus:outline-none focus:border-[#3D5A3E] text-sm"
                    >
                        <option value="all">Tous les statuts</option>
                        <option value="active">Actifs</option>
                        <option value="inactive">Inactifs</option>
                        <option value="deleted">Supprimés</option>
                    </select>
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="px-4 py-2 bg-white border border-[#E8E2D9] rounded-xl focus:outline-none focus:border-[#3D5A3E] text-sm"
                    >
                        <option value="all">Toutes les catégories</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.icon} {cat.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Services Table */}
            <div className="bg-white rounded-2xl border border-[#E8E2D9] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[#FAF8F5] border-b border-[#E8E2D9]">
                            <tr>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B5E4F] uppercase">Service</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B5E4F] uppercase">Catégorie</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B5E4F] uppercase">Artisan</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B5E4F] uppercase">Prix</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B5E4F] uppercase">Statut</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B5E4F] uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {services.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-8 text-[#6B5E4F]">
                                        Aucun service trouvé
                                    </td>
                                </tr>
                            ) : (
                                services.map((service) => (
                                    <tr key={service._id} className="border-b border-[#E8E2D9] hover:bg-[#FAF8F5] transition-colors">
                                        <td className="py-3 px-4">
                                            <div>
                                                <p className="font-medium text-[#1A1208] text-sm line-clamp-1">
                                                    {service.title}
                                                </p>
                                                <p className="text-xs text-[#6B5E4F] line-clamp-1">
                                                    {service.description}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="text-sm text-[#6B5E4F] flex items-center gap-1">
                                                {getCategoryIcon(service.category)}
                                                {service.category?.replace('-', ' ') || 'Général'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="text-sm text-[#6B5E4F]">
                                                {service.freelancerId?.name || 'Artisan'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="font-semibold text-[#3D5A3E]">{formatPrice(service.price)} DH</span>
                                        </td>
                                        <td className="py-3 px-4">{getStatusBadge(service.status)}</td>
                                        <td className="py-3 px-4">
                                            <div className="flex gap-2">
                                                {service.status !== 'deleted' && (
                                                    <>
                                                        <button
                                                            onClick={() => updateServiceStatus(service._id, 'active')}
                                                            className={`p-1.5 rounded-lg transition-all ${service.status === 'active' ? 'bg-green-50 text-green-600' : 'text-[#6B5E4F] hover:bg-green-50 hover:text-green-600'}`}
                                                            title="Activer"
                                                            disabled={service.status === 'active'}
                                                        >
                                                            <FiCheck size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => updateServiceStatus(service._id, 'inactive')}
                                                            className={`p-1.5 rounded-lg transition-all ${service.status === 'inactive' ? 'bg-yellow-50 text-yellow-600' : 'text-[#6B5E4F] hover:bg-yellow-50 hover:text-yellow-600'}`}
                                                            title="Désactiver"
                                                            disabled={service.status === 'inactive'}
                                                        >
                                                            <FiX size={16} />
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    onClick={() => deleteService(service._id, service.title)}
                                                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                    title="Supprimer"
                                                    disabled={service.status === 'deleted'}
                                                >
                                                    <FiTrash2 size={16} />
                                                </button>
                                            </div>
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
        </div>
    );
};

export default AdminServices;   