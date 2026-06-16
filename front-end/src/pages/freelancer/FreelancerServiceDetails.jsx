// src/pages/freelancer/FreelancerServiceDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { serviceApi } from '../../api/serviceApi';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import { 
  FiArrowLeft, FiEdit2, FiTrash2, FiEye, FiClock, 
  FiDollarSign, FiTag, FiAlertCircle, FiShoppingBag,
  FiUsers, FiStar, FiTrendingUp, FiCalendar, FiMapPin,
  FiCheckCircle, FiXCircle, FiCopy, FiShare2, FiHeart,
  FiMoreVertical, FiGrid, FiList
} from 'react-icons/fi';

const FreelancerServiceDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    useEffect(() => {
        fetchService();
    }, [id]);

    const fetchService = async () => {
        setLoading(true);
        try {
            const response = await serviceApi.getServiceById(id);
            const serviceData = response.data.service;
            
            if (serviceData.freelancerId._id !== user?._id && user?.role !== 'admin') {
                toast.error('Vous n\'êtes pas autorisé à voir ce service');
                navigate('/freelancer/services');
                return;
            }
            
            setService(serviceData);
        } catch (error) {
            console.error('Erreur:', error);
            setError('Impossible de charger les détails du service');
            toast.error('Service non trouvé');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        const deleteToast = toast.loading('Suppression en cours...');
        try {
            await serviceApi.deleteService(id);
            toast.success('✓ Service supprimé avec succès !', {
                id: deleteToast,
                duration: 3000,
                icon: '🗑️',
            });
            navigate('/freelancer/services');
        } catch (error) {
            toast.error('Erreur lors de la suppression', {
                id: deleteToast,
                duration: 4000,
                icon: '❌',
            });
        }
    };

    const handleDuplicate = async () => {
        const duplicateData = {
            title: `${service.title} (Copie)`,
            description: service.description,
            category: service.category,
            subcategory: service.subcategory,
            price: service.price,
            deliveryDays: service.deliveryDays,
            tags: service.tags,
            requirements: service.requirements,
            images: service.images
        };
        
        const duplicateToast = toast.loading('Duplication en cours...');
        try {
            const response = await serviceApi.createService(duplicateData);
            if (response.data.success) {
                toast.success('✓ Service dupliqué avec succès !', {
                    id: duplicateToast,
                    duration: 3000,
                    icon: '📋',
                });
                setTimeout(() => {
                    navigate(`/freelancer/services/${response.data.service._id}`);
                }, 1500);
            }
        } catch (error) {
            toast.error('Erreur lors de la duplication', {
                id: duplicateToast,
                duration: 4000,
                icon: '❌',
            });
        }
    };

    const handleToggleStatus = async () => {
        const newStatus = service.status === 'active' ? 'inactive' : 'active';
        const actionText = newStatus === 'active' ? 'activer' : 'désactiver';
        
        const confirmToggle = window.confirm(`Êtes-vous sûr de vouloir ${actionText} ce service ?`);
        if (!confirmToggle) return;
        
        const toggleToast = toast.loading(`${actionText === 'activer' ? 'Activation' : 'Désactivation'} en cours...`);
        try {
            const response = await serviceApi.updateService(id, { ...service, status: newStatus });
            if (response.data.success) {
                toast.success(`✓ Service ${actionText} avec succès !`, {
                    id: toggleToast,
                    duration: 3000,
                });
                setService(prev => ({ ...prev, status: newStatus }));
            }
        } catch (error) {
            toast.error(`Erreur lors de la ${actionText}`, {
                id: toggleToast,
                duration: 4000,
            });
        }
    };

    const formatNumber = (num) => {
        return new Intl.NumberFormat('fr-MA').format(num);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

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

    if (error || !service) {
        return (
            <div className="text-center py-12 bg-white rounded-2xl border border-[#E8E2D9] mx-4">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-heading font-semibold text-[#1A1208] mb-2">
                    Service non trouvé
                </h3>
                <p className="text-[#6B5E4F] mb-6">
                    {error || "Le service que vous cherchez n'existe pas ou a été supprimé"}
                </p>
                <Link 
                    to="/freelancer/services"
                    className="inline-flex items-center gap-2 bg-[#3D5A3E] hover:bg-[#2D452E] text-white px-6 py-2 rounded-xl font-semibold transition-all"
                >
                    <FiArrowLeft size={16} />
                    Retour à mes services
                </Link>
            </div>
        );
    }

    const categoryColors = {
        'graphic-design': { bg: 'bg-purple-50', text: 'text-purple-600', icon: '🎨' },
        'web-development': { bg: 'bg-blue-50', text: 'text-blue-600', icon: '💻' },
        'marketing': { bg: 'bg-orange-50', text: 'text-orange-600', icon: '📈' },
        'writing': { bg: 'bg-green-50', text: 'text-green-600', icon: '✍️' },
        'video': { bg: 'bg-red-50', text: 'text-red-600', icon: '🎥' },
        'consulting': { bg: 'bg-indigo-50', text: 'text-indigo-600', icon: '💡' }
    };

    const categoryStyle = categoryColors[service.category] || { bg: 'bg-gray-50', text: 'text-gray-600', icon: '✨' };

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
            {/* Header avec actions - Version responsive */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <Link 
                        to="/freelancer/services"
                        className="p-2 rounded-lg hover:bg-[#E8EDE6] transition-colors flex-shrink-0"
                    >
                        <FiArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-heading font-bold text-[#1A1208]">
                            Détails du service
                        </h1>
                        <p className="text-[#6B5E4F] text-xs sm:text-sm mt-0.5">
                            Gérez et visualisez les informations de votre service
                        </p>
                    </div>
                </div>
                
                {/* Actions Desktop */}
                <div className="hidden md:flex gap-2">
                    <button
                        onClick={handleDuplicate}
                        className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all text-sm"
                    >
                        <FiCopy size={16} />
                        Dupliquer
                    </button>
                    <Link
                        to={`/freelancer/services/edit/${service._id}`}
                        className="flex items-center gap-2 px-3 py-2 bg-[#E8EDE6] text-[#3D5A3E] rounded-xl hover:bg-[#3D5A3E] hover:text-white transition-all text-sm"
                    >
                        <FiEdit2 size={16} />
                        Modifier
                    </Link>
                    <button
                        onClick={handleToggleStatus}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all text-sm ${
                            service.status === 'active' 
                                ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100' 
                                : 'bg-green-50 text-green-600 hover:bg-green-100'
                        }`}
                    >
                        {service.status === 'active' ? (
                            <><FiXCircle size={16} /> Désactiver</>
                        ) : (
                            <><FiCheckCircle size={16} /> Activer</>
                        )}
                    </button>
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all text-sm"
                    >
                        <FiTrash2 size={16} />
                        Supprimer
                    </button>
                </div>

                {/* Actions Mobile */}
                <div className="flex md:hidden gap-2 w-full">
                    <button
                        onClick={handleDuplicate}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all text-sm"
                    >
                        <FiCopy size={16} />
                        Dupliquer
                    </button>
                    <Link
                        to={`/freelancer/services/edit/${service._id}`}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#E8EDE6] text-[#3D5A3E] rounded-xl hover:bg-[#3D5A3E] hover:text-white transition-all text-sm"
                    >
                        <FiEdit2 size={16} />
                        Modifier
                    </Link>
                    <button
                        onClick={() => setShowMobileMenu(!showMobileMenu)}
                        className="px-3 py-2 bg-gray-100 text-gray-600 rounded-xl"
                    >
                        <FiMoreVertical size={20} />
                    </button>
                </div>
            </div>

            {/* Menu mobile supplémentaire */}
            {showMobileMenu && (
                <div className="md:hidden mb-4 p-3 bg-white rounded-xl border border-[#E8E2D9] shadow-lg animate-fade-in">
                    <div className="flex flex-col gap-2">
                        <button
                            onClick={() => {
                                handleToggleStatus();
                                setShowMobileMenu(false);
                            }}
                            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl transition-all text-sm ${
                                service.status === 'active' 
                                    ? 'bg-yellow-50 text-yellow-600' 
                                    : 'bg-green-50 text-green-600'
                            }`}
                        >
                            {service.status === 'active' ? (
                                <><FiXCircle size={16} /> Désactiver</>
                            ) : (
                                <><FiCheckCircle size={16} /> Activer</>
                            )}
                        </button>
                        <button
                            onClick={() => {
                                setShowDeleteConfirm(true);
                                setShowMobileMenu(false);
                            }}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all text-sm"
                        >
                            <FiTrash2 size={16} />
                            Supprimer
                        </button>
                    </div>
                </div>
            )}

            {/* Modal de confirmation suppression - Responsive */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-5 sm:p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg sm:text-xl font-heading font-bold text-[#1A1208] mb-2">
                            Confirmer la suppression
                        </h3>
                        <p className="text-[#6B5E4F] text-sm sm:text-base mb-6">
                            Êtes-vous sûr de vouloir supprimer le service "{service.title}" ?<br />
                            Cette action est irréversible.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="flex-1 px-4 py-2 border border-[#E8E2D9] rounded-xl text-[#6B5E4F] hover:bg-[#E8EDE6] transition-all text-sm sm:text-base"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all text-sm sm:text-base"
                            >
                                Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-6">
                
                {/* Colonne principale - Détails du service */}
                <div className="lg:flex-1 lg:w-2/3 space-y-6">
                    
                    {/* Image principale - Responsive */}
                    <div className="bg-white rounded-2xl border border-[#E8E2D9] overflow-hidden">
                        {service.images && service.images.length > 0 ? (
                            <img 
                                src={service.images[0]} 
                                alt={service.title}
                                className="w-full h-48 sm:h-64 md:h-80 object-cover"
                                onError={(e) => {
                                    e.target.src = 'https://placehold.co/800x400/E8EDE6/3D5A3E?text=Image+non+disponible';
                                }}
                            />
                        ) : (
                            <div className="h-48 sm:h-64 md:h-80 bg-gradient-to-r from-[#E8EDE6] to-[#FAF8F5] flex items-center justify-center">
                                <span className="text-6xl sm:text-7xl md:text-8xl">{categoryStyle.icon}</span>
                            </div>
                        )}
                    </div>

                    {/* Informations générales - Responsive */}
                    <div className="bg-white rounded-2xl border border-[#E8E2D9] p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                            <div>
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${categoryStyle.bg} ${categoryStyle.text}`}>
                                        {categoryStyle.icon} {service.category?.replace('-', ' ')}
                                    </span>
                                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${
                                        service.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-600'
                                    }`}>
                                        {service.status === 'active' ? 'Actif' : 'Inactif'}
                                    </span>
                                </div>
                                <h1 className="text-xl sm:text-2xl font-heading font-bold text-[#1A1208] break-words">
                                    {service.title}
                                </h1>
                            </div>
                            <div className="text-left sm:text-right">
                                <div className="text-2xl sm:text-3xl font-bold text-[#3D5A3E]">{formatNumber(service.price)} DH</div>
                                <div className="text-xs text-[#6B5E4F] mt-1">/ projet</div>
                            </div>
                        </div>

                        {/* Stats rapides - Responsive grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 py-3 sm:py-4 border-y border-[#E8E2D9] my-3 sm:my-4">
                            <div className="text-center">
                                <div className="flex items-center justify-center text-[#6B5E4F] mb-1">
                                    <FiEye size={16} />
                                </div>
                                <div className="text-lg sm:text-xl font-bold text-[#1A1208]">{service.views || 0}</div>
                                <div className="text-xs text-[#6B5E4F]">Vues</div>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center justify-center text-[#6B5E4F] mb-1">
                                    <FiShoppingBag size={16} />
                                </div>
                                <div className="text-lg sm:text-xl font-bold text-[#1A1208]">{service.orders || 0}</div>
                                <div className="text-xs text-[#6B5E4F]">Commandes</div>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center justify-center text-[#6B5E4F] mb-1">
                                    <FiStar size={16} />
                                </div>
                                <div className="text-lg sm:text-xl font-bold text-[#1A1208]">{service.rating || 'Nouveau'}</div>
                                <div className="text-xs text-[#6B5E4F]">Note</div>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center justify-center text-[#6B5E4F] mb-1">
                                    <FiClock size={16} />
                                </div>
                                <div className="text-lg sm:text-xl font-bold text-[#1A1208]">{service.deliveryDays}</div>
                                <div className="text-xs text-[#6B5E4F]">Jours</div>
                            </div>
                        </div>

                        {/* Description - Responsive */}
                        <div className="mb-5">
                            <h2 className="font-heading font-semibold text-[#1A1208] mb-2 sm:mb-3 text-base sm:text-lg">Description</h2>
                            <p className="text-[#6B5E4F] text-sm sm:text-base leading-relaxed whitespace-pre-line">
                                {service.description}
                            </p>
                        </div>

                        {/* Prérequis - Responsive */}
                        {service.requirements && (
                            <div className="mb-5 p-3 sm:p-4 bg-[#E8EDE6]/30 rounded-xl">
                                <h2 className="font-heading font-semibold text-[#1A1208] mb-2 flex items-center gap-2 text-sm sm:text-base">
                                    <FiAlertCircle size={16} className="text-[#3D5A3E]" />
                                    Prérequis
                                </h2>
                                <p className="text-[#6B5E4F] text-xs sm:text-sm">{service.requirements}</p>
                            </div>
                        )}

                        {/* Tags - Responsive */}
                        {service.tags && service.tags.length > 0 && (
                            <div className="mb-5">
                                <h2 className="font-heading font-semibold text-[#1A1208] mb-2 flex items-center gap-2 text-sm sm:text-base">
                                    <FiTag size={14} />
                                    Compétences
                                </h2>
                                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                    {service.tags.map((tag, idx) => (
                                        <span key={idx} className="px-2 sm:px-3 py-1 bg-[#E8EDE6] text-[#3D5A3E] rounded-full text-xs sm:text-sm">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Galerie - Responsive */}
                        {service.images && service.images.length > 1 && (
                            <div>
                                <h2 className="font-heading font-semibold text-[#1A1208] mb-2 sm:mb-3 text-sm sm:text-base">Galerie</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                                    {service.images.slice(1).map((img, idx) => (
                                        <img 
                                            key={idx}
                                            src={img} 
                                            alt={`Galerie ${idx + 2}`}
                                            className="rounded-xl aspect-video object-cover hover:opacity-90 transition-opacity cursor-pointer"
                                            onError={(e) => {
                                                e.target.src = 'https://placehold.co/400x300/E8EDE6/3D5A3E?text=Image';
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Colonne latérale - Statistiques et informations */}
                <div className="lg:w-1/3 space-y-5">
                    
                    {/* Performance - Responsive */}
                    <div className="bg-white rounded-2xl border border-[#E8E2D9] p-4 sm:p-5 lg:sticky lg:top-24">
                        <h3 className="font-heading font-semibold text-[#1A1208] mb-3 flex items-center gap-2 text-base">
                            <FiTrendingUp size={18} className="text-[#3D5A3E]" />
                            Performance
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-xs sm:text-sm mb-1">
                                    <span className="text-[#6B5E4F]">Taux de conversion</span>
                                    <span className="font-semibold text-[#1A1208]">
                                        {service.views > 0 ? ((service.orders / service.views) * 100).toFixed(1) : 0}%
                                    </span>
                                </div>
                                <div className="w-full h-2 bg-[#E8EDE6] rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-[#3D5A3E] rounded-full"
                                        style={{ width: `${service.views > 0 ? (service.orders / service.views) * 100 : 0}%` }}
                                    ></div>
                                </div>
                            </div>
                            <div className="flex justify-between text-xs sm:text-sm">
                                <span className="text-[#6B5E4F]">Revenus générés</span>
                                <span className="font-semibold text-[#3D5A3E]">
                                    {(service.price * service.orders).toLocaleString()} DH
                                </span>
                            </div>
                            <div className="flex justify-between text-xs sm:text-sm">
                                <span className="text-[#6B5E4F]">Note moyenne</span>
                                <div className="flex items-center gap-1">
                                    <FiStar className="text-yellow-500 fill-current" size={12} />
                                    <span className="font-semibold text-[#1A1208]">{service.rating || 'Nouveau'}</span>
                                    <span className="text-xs text-[#6B5E4F]">({service.ratingCount || 0})</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Informations de création - Responsive */}
                    <div className="bg-white rounded-2xl border border-[#E8E2D9] p-4 sm:p-5">
                        <h3 className="font-heading font-semibold text-[#1A1208] mb-3 flex items-center gap-2 text-base">
                            <FiCalendar size={18} className="text-[#3D5A3E]" />
                            Informations
                        </h3>
                        <div className="space-y-2 text-xs sm:text-sm">
                            <div className="flex justify-between flex-wrap gap-1">
                                <span className="text-[#6B5E4F]">Créé le</span>
                                <span className="text-[#1A1208] font-medium">{formatDate(service.createdAt)}</span>
                            </div>
                            <div className="flex justify-between flex-wrap gap-1">
                                <span className="text-[#6B5E4F]">Modifié le</span>
                                <span className="text-[#1A1208] font-medium">{formatDate(service.updatedAt)}</span>
                            </div>
                            <div className="flex justify-between flex-wrap gap-1">
                                <span className="text-[#6B5E4F]">ID</span>
                                <span className="text-[#1A1208] font-mono text-[10px] sm:text-xs break-all text-right">{service._id}</span>
                            </div>
                        </div>
                    </div>

                    {/* Actions rapides - Responsive */}
                    <div className="bg-white rounded-2xl border border-[#E8E2D9] p-4 sm:p-5">
                        <h3 className="font-heading font-semibold text-[#1A1208] mb-3 flex items-center gap-2 text-base">
                            <FiShare2 size={18} className="text-[#3D5A3E]" />
                            Actions rapides
                        </h3>
                        <div className="space-y-2">
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(`${window.location.origin}/services/${service._id}`);
                                    toast.success('Lien copié dans le presse-papier');
                                }}
                                className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-[#E8E2D9] rounded-xl text-[#6B5E4F] hover:border-[#3D5A3E] hover:text-[#3D5A3E] transition-all text-sm"
                            >
                                <FiShare2 size={14} />
                                Copier le lien
                            </button>
                            <Link
                                to={`/services/${service._id}`}
                                target="_blank"
                                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#3D5A3E] text-white rounded-xl hover:bg-[#2D452E] transition-all text-sm"
                            >
                                <FiEye size={14} />
                                Voir la page publique
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fadeIn 0.2s ease-out;
                }
            `}</style>
        </div>
    );
};

export default FreelancerServiceDetails;