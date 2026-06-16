// src/pages/freelancer/FreelancerServices.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { serviceApi } from '../../api/serviceApi';
import toast from 'react-hot-toast';
import { 
  FiPlus, FiEdit2, FiTrash2, FiEye, FiClock, 
  FiDollarSign, FiShoppingBag, FiSearch, FiGrid, FiList,
  FiTrendingUp, FiStar, FiRefreshCw
} from 'react-icons/fi';

const FreelancerServices = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const [filterStatus, setFilterStatus] = useState('all');
    const [deletingId, setDeletingId] = useState(null); // Pour suivre quel service est en cours de suppression

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        setLoading(true);
        try {
            const response = await serviceApi.getMyServices();
            console.log('Services chargés:', response.data);
            setServices(response.data.services || []);
        } catch (error) {
            console.error('Erreur détaillée:', error);
            toast.error('Impossible de charger vos services');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, title) => {
        // Confirmation avec alert personnalisé
        const confirmDelete = window.confirm(`⚠️ Supprimer "${title}" ?\n\nCette action est irréversible.`);
        
        if (!confirmDelete) return;
        
        setDeletingId(id);
        const deleteToast = toast.loading('Suppression en cours...');
        
        try {
            console.log('Tentative de suppression du service:', id);
            const response = await serviceApi.deleteService(id);
            console.log('Réponse suppression:', response);
            
            if (response.data.success) {
                toast.success(`✓ "${title}" supprimé avec succès !`, {
                    id: deleteToast,
                    duration: 3000,
                    icon: '🗑️',
                });
                // Recharger la liste
                await fetchServices();
            } else {
                toast.error(response.data.message || 'Erreur lors de la suppression', {
                    id: deleteToast,
                    duration: 4000,
                });
            }
        } catch (error) {
            console.error('Erreur suppression:', error);
            console.error('Détails:', error.response?.data);
            toast.error(error.response?.data?.message || 'Erreur lors de la suppression', {
                id: deleteToast,
                duration: 4000,
                icon: '❌',
            });
        } finally {
            setDeletingId(null);
        }
    };

    const getStatusBadge = (status) => {
        if (status === 'active') {
            return <span className="px-2 py-1 text-xs rounded-full bg-green-50 text-green-600">Actif</span>;
        }
        if (status === 'inactive') {
            return <span className="px-2 py-1 text-xs rounded-full bg-yellow-50 text-yellow-600">Inactif</span>;
        }
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-50 text-gray-600">{status}</span>;
    };

    const filteredServices = services.filter(service => {
        const matchesSearch = service.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              service.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || service.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const totalViews = services.reduce((sum, s) => sum + (s.views || 0), 0);
    const totalOrders = services.reduce((sum, s) => sum + (s.orders || 0), 0);
    const totalEarnings = services.reduce((sum, s) => sum + ((s.price || 0) * (s.orders || 0)), 0);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
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
                    <h1 className="text-2xl font-heading font-bold text-[#1A1208]">
                        Mes services
                    </h1>
                    <p className="text-[#6B5E4F] text-sm mt-1">
                        Gérez tous vos services proposés ({services.length} service{services.length > 1 ? 's' : ''})
                    </p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={fetchServices}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E8E2D9] rounded-xl text-[#6B5E4F] hover:text-[#3D5A3E] transition-all"
                        title="Actualiser"
                    >
                        <FiRefreshCw size={16} />
                        Actualiser
                    </button>
                    <Link 
                        to="/freelancer/services/create"
                        className="flex items-center gap-2 bg-[#3D5A3E] hover:bg-[#2D452E] text-white px-4 py-2 rounded-xl font-semibold transition-all"
                    >
                        <FiPlus size={18} />
                        Nouveau service
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl border border-[#E8E2D9] p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[#6B5E4F] text-sm">Total services</span>
                        <FiShoppingBag className="text-[#3D5A3E]" size={18} />
                    </div>
                    <div className="text-2xl font-bold text-[#1A1208]">{services.length}</div>
                </div>
                <div className="bg-white rounded-xl border border-[#E8E2D9] p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[#6B5E4F] text-sm">Vues totales</span>
                        <FiEye className="text-[#3D5A3E]" size={18} />
                    </div>
                    <div className="text-2xl font-bold text-[#1A1208]">{totalViews}</div>
                </div>
                <div className="bg-white rounded-xl border border-[#E8E2D9] p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[#6B5E4F] text-sm">Commandes</span>
                        <FiTrendingUp className="text-[#3D5A3E]" size={18} />
                    </div>
                    <div className="text-2xl font-bold text-[#1A1208]">{totalOrders}</div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="relative flex-1 max-w-md">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9B9082]" size={18} />
                    <input
                        type="text"
                        placeholder="Rechercher un service..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white border border-[#E8E2D9] rounded-xl focus:outline-none focus:border-[#3D5A3E] transition-all"
                    />
                </div>
                <div className="flex gap-3">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 bg-white border border-[#E8E2D9] rounded-xl focus:outline-none focus:border-[#3D5A3E] text-sm"
                    >
                        <option value="all">Tous les statuts</option>
                        <option value="active">Actifs</option>
                        <option value="inactive">Inactifs</option>
                    </select>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-[#E8EDE6] text-[#3D5A3E]' : 'text-[#9B9082] hover:bg-[#E8EDE6]'}`}
                        >
                            <FiGrid size={18} />
                        </button>
                        <button 
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-[#E8EDE6] text-[#3D5A3E]' : 'text-[#9B9082] hover:bg-[#E8EDE6]'}`}
                        >
                            <FiList size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Services List */}
            {filteredServices.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-[#E8E2D9]">
                    <div className="text-6xl mb-4">📦</div>
                    <h3 className="text-xl font-heading font-semibold text-[#1A1208] mb-2">
                        {searchTerm ? "Aucun service trouvé" : "Aucun service"}
                    </h3>
                    <p className="text-[#6B5E4F] mb-6">
                        {searchTerm ? "Aucun service ne correspond à votre recherche" : "Vous n'avez pas encore créé de services"}
                    </p>
                    {!searchTerm && (
                        <Link 
                            to="/freelancer/services/create"
                            className="inline-flex items-center gap-2 bg-[#3D5A3E] hover:bg-[#2D452E] text-white px-6 py-2 rounded-xl font-semibold transition-all"
                        >
                            <FiPlus size={16} />
                            Créer mon premier service
                        </Link>
                    )}
                </div>
            ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredServices.map((service) => (
                        <div key={service._id} className="bg-white rounded-2xl border border-[#E8E2D9] overflow-hidden hover:shadow-lg transition-all">
                            <div className="h-32 bg-gradient-to-r from-[#E8EDE6] to-[#FAF8F5] flex items-center justify-center text-5xl relative">
                                {service.images && service.images[0] ? (
                                    <img src={service.images[0]} alt={service.title} className="w-full h-full object-cover" />
                                ) : (
                                    <span>🎨</span>
                                )}
                                <div className="absolute top-2 right-2">
                                    {getStatusBadge(service.status)}
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-heading font-semibold text-[#1A1208] line-clamp-1">
                                    {service.title}
                                </h3>
                                <div className="flex items-center gap-3 text-xs text-[#6B5E4F] mt-1">
                                    <span className="flex items-center gap-1"><FiEye size={12} /> {service.views || 0}</span>
                                    <span className="flex items-center gap-1"><FiShoppingBag size={12} /> {service.orders || 0}</span>
                                    <span className="flex items-center gap-1"><FiClock size={12} /> {service.deliveryDays}j</span>
                                </div>
                                <div className="flex justify-between items-center mt-3 pt-3 border-t border-[#E8E2D9]">
                                    <span className="text-lg font-bold text-[#3D5A3E]">{service.price} DH</span>
                                </div>
                                <div className="flex gap-2 mt-3">
                                    <Link 
                                        to={`/freelancer/services/${service._id}`}
                                        
                                        className="flex-1 text-center text-sm text-[#3D5A3E] border border-[#3D5A3E] py-1.5 rounded-lg hover:bg-[#E8EDE6] transition-all"
                                    >
                                        Voir
                                    </Link>
                                    <Link 
                                        to={`/freelancer/services/edit/${service._id}`}
                                        className="flex-1 text-center text-sm bg-[#E8EDE6] text-[#3D5A3E] py-1.5 rounded-lg hover:bg-[#3D5A3E] hover:text-white transition-all"
                                    >
                                        Modifier
                                    </Link>
                                    <button 
                                        onClick={() => handleDelete(service._id, service.title)}
                                        disabled={deletingId === service._id}
                                        className="text-sm bg-red-50 text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                                    >
                                        {deletingId === service._id ? (
                                            <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <FiTrash2 size={14} />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-[#E8E2D9] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[600px]">
                            <thead className="bg-[#FAF8F5] border-b border-[#E8E2D9]">
                                <tr>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B5E4F] uppercase">Service</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B5E4F] uppercase">Prix</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B5E4F] uppercase">Vues</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B5E4F] uppercase">Commandes</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B5E4F] uppercase">Statut</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B5E4F] uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredServices.map((service) => (
                                    <tr key={service._id} className="border-b border-[#E8E2D9] hover:bg-[#FAF8F5] transition-colors">
                                        <td className="py-3 px-4">
                                            <p className="font-medium text-[#1A1208] text-sm">{service.title}</p>
                                            <p className="text-xs text-[#6B5E4F] mt-1">{service.deliveryDays} jours</p>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="font-semibold text-[#3D5A3E]">{service.price} DH</span>
                                        </td>
                                        <td className="py-3 px-4">{service.views || 0}</td>
                                        <td className="py-3 px-4">{service.orders || 0}</td>
                                        <td className="py-3 px-4">{getStatusBadge(service.status)}</td>
                                        <td className="py-3 px-4">
                                            <div className="flex gap-2">
                                                <Link to={`/services/${service._id}`} target="_blank" className="p-1 text-[#6B5E4F] hover:text-[#3D5A3E]" title="Voir">
                                                    <FiEye size={16} />
                                                </Link>
                                                <Link to={`/freelancer/services/edit/${service._id}`} className="p-1 text-[#6B5E4F] hover:text-[#3D5A3E]" title="Modifier">
                                                    <FiEdit2 size={16} />
                                                </Link>
                                                <button 
                                                    onClick={() => handleDelete(service._id, service.title)}
                                                    disabled={deletingId === service._id}
                                                    className="p-1 text-red-500 hover:text-red-600 disabled:opacity-50"
                                                    title="Supprimer"
                                                >
                                                    {deletingId === service._id ? (
                                                        <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                                                    ) : (
                                                        <FiTrash2 size={16} />
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FreelancerServices;