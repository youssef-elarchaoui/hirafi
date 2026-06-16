// src/pages/client/ClientWishlist.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { wishlistApi } from '../../api/wishlistApi';
import toast from 'react-hot-toast';
import { 
  FiHeart, FiStar, FiClock, FiDollarSign, FiShoppingBag,
  FiTrash2, FiEye, FiX, FiShoppingCart, FiRefreshCw,
  FiAlertCircle
} from 'react-icons/fi';

const ClientWishlist = () => {
    const { user } = useAuth();
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await wishlistApi.getMyWishlist();
            console.log('📋 Liste de souhaits reçue:', response.data);
            
            // Gérer différents formats de réponse
            let wishlistData = [];
            if (response.data.success) {
                wishlistData = response.data.wishlist || response.data.items || [];
            } else if (Array.isArray(response.data)) {
                wishlistData = response.data;
            } else {
                wishlistData = response.data.wishlist || response.data.items || [];
            }
            
            setWishlist(wishlistData);
        } catch (error) {
            console.error('❌ Erreur chargement wishlist:', error);
            setError('Impossible de charger votre liste de souhaits');
            
            // Si l'API n'existe pas encore, utiliser des données mock
            if (error.response?.status === 404) {
                console.log('ℹ️ API wishlist non trouvée, utilisation de données mock');
                setWishlist(getMockWishlist());
            }
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const getMockWishlist = () => {
        return [
            {
                _id: 'mock1',
                serviceId: {
                    _id: '1',
                    title: 'Calligraphie sur mesure',
                    description: 'Création d\'œuvres calligraphiques personnalisées. Mariage entre tradition et modernité.',
                    price: 800,
                    deliveryDays: 4,
                    rating: 5,
                    ratingCount: 12,
                    category: 'graphic-design',
                    images: ['https://placehold.co/600x400/E8EDE6/3D5A3E?text=Calligraphie']
                },
                freelancerId: {
                    _id: 'f1',
                    name: 'Nadia Benali',
                    avatar: null,
                    rating: 5
                },
                addedAt: new Date().toISOString()
            },
            {
                _id: 'mock2',
                serviceId: {
                    _id: '2',
                    title: 'Application mobile React Native',
                    description: 'Développement d\'applications mobiles cross-platform avec React Native.',
                    price: 1500,
                    deliveryDays: 15,
                    rating: 4.9,
                    ratingCount: 67,
                    category: 'web-development',
                    images: ['https://placehold.co/600x400/E8EDE6/3D5A3E?text=Mobile+App']
                },
                freelancerId: {
                    _id: 'f2',
                    name: 'Mohamed Amine',
                    avatar: null,
                    rating: 4.9
                },
                addedAt: new Date().toISOString()
            }
        ];
    };

    const removeFromWishlist = async (id) => {
        const confirmRemove = window.confirm('Supprimer ce service de votre liste de souhaits ?');
        if (!confirmRemove) return;
        
        const removeToast = toast.loading('Suppression en cours...');
        try {
            const response = await wishlistApi.removeFromWishlist(id);
            if (response.data.success) {
                // Supprimer localement
                setWishlist(prev => prev.filter(item => item._id !== id));
                toast.success('✓ Service retiré de votre liste de souhaits', {
                    id: removeToast,
                    duration: 3000,
                });
            }
        } catch (error) {
            console.error('❌ Erreur suppression:', error);
            
            // Si l'API n'existe pas, supprimer localement
            setWishlist(prev => prev.filter(item => item._id !== id));
            toast.success('✓ Service retiré de votre liste (local)', {
                id: removeToast,
                duration: 3000,
            });
        }
    };

    const addToCart = (serviceId) => {
        toast.success('Service ajouté au panier');
        // Navigation vers le service ou le panier
        // window.location.href = `/services/${serviceId}`;
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
        return icons[category] || '✨';
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

    if (error) {
        return (
            <div className="text-center py-12 bg-white rounded-2xl border border-[#E8E2D9]">
                <div className="text-6xl mb-4">⚠️</div>
                <h3 className="text-xl font-heading font-semibold text-[#1A1208] mb-2">
                    Erreur de chargement
                </h3>
                <p className="text-[#6B5E4F] mb-6">{error}</p>
                <button 
                    onClick={fetchWishlist}
                    className="inline-flex items-center gap-2 bg-[#3D5A3E] hover:bg-[#2D452E] text-white px-6 py-2 rounded-xl font-semibold transition-all"
                >
                    <FiRefreshCw size={16} />
                    Réessayer
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-heading font-bold text-[#1A1208] flex items-center gap-2">
                        <FiHeart className="text-red-500" />
                        Liste de souhaits
                    </h1>
                    <p className="text-[#6B5E4F] text-sm mt-1">
                        {wishlist.length} service{wishlist.length > 1 ? 's' : ''} enregistré{wishlist.length > 1 ? 's' : ''}
                    </p>
                </div>
                <button 
                    onClick={fetchWishlist}
                    disabled={refreshing}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E8E2D9] rounded-xl text-[#6B5E4F] hover:text-[#3D5A3E] transition-all disabled:opacity-50"
                >
                    <FiRefreshCw className={refreshing ? 'animate-spin' : ''} size={16} />
                    Actualiser
                </button>
            </div>

            {/* Wishlist Grid */}
            {wishlist.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-[#E8E2D9]">
                    <div className="text-6xl mb-4">💔</div>
                    <h3 className="text-xl font-heading font-semibold text-[#1A1208] mb-2">
                        Liste de souhaits vide
                    </h3>
                    <p className="text-[#6B5E4F] mb-6">
                        Vous n'avez pas encore ajouté de services à votre liste de souhaits
                    </p>
                    <Link 
                        to="/services"
                        className="inline-flex items-center gap-2 bg-[#3D5A3E] hover:bg-[#2D452E] text-white px-6 py-2 rounded-xl font-semibold transition-all"
                    >
                        Découvrir des services
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {wishlist.map((item) => {
                        // Extraire les données selon la structure
                        const service = item.serviceId || item;
                        const freelancer = item.freelancerId || {};
                        const itemId = item._id || item.id;
                        
                        return (
                            <div key={itemId} className="bg-white rounded-2xl border border-[#E8E2D9] overflow-hidden hover:shadow-lg transition-all group">
                                {/* Image ou icône */}
                                <div className="h-32 bg-gradient-to-r from-[#E8EDE6] to-[#FAF8F5] flex items-center justify-center relative">
                                    {service.images && service.images[0] ? (
                                        <img 
                                            src={service.images[0]} 
                                            alt={service.title}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.src = 'https://placehold.co/600x400/E8EDE6/3D5A3E?text=Image';
                                            }}
                                        />
                                    ) : (
                                        <span className="text-6xl">{getCategoryIcon(service.category)}</span>
                                    )}
                                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                                        <div className="flex items-center gap-1 text-yellow-500">
                                            <FiStar className="fill-current" size={14} />
                                            <span className="text-sm font-semibold text-[#1A1208]">{service.rating || 'Nouveau'}</span>
                                        </div>
                                    </div>
                                    {item.addedAt && (
                                        <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                                            Ajouté le {formatDate(item.addedAt)}
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    <Link 
                                        to={`/services/${service._id}`}
                                        className="font-heading font-semibold text-[#1A1208] hover:text-[#3D5A3E] transition-colors text-lg line-clamp-1"
                                    >
                                        {service.title}
                                    </Link>
                                    <p className="text-[#6B5E4F] text-sm mt-1 line-clamp-2">
                                        {service.description}
                                    </p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#3D5A3E] to-[#2D452E] flex items-center justify-center text-white text-xs font-bold">
                                            {freelancer.name?.charAt(0) || 'A'}
                                        </div>
                                        <span className="text-sm text-[#6B5E4F]">{freelancer.name || 'Artisan'}</span>
                                    </div>
                                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#E8E2D9]">
                                        <div>
                                            <span className="text-xl font-bold text-[#3D5A3E]">{formatPrice(service.price)} DH</span>
                                            <span className="text-xs text-[#6B5E4F] ml-1">/ projet</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-[#6B5E4F]">
                                            <FiClock size={12} />
                                            <span>{service.deliveryDays || 7} jours</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 mt-3">
                                        <Link 
                                            to={`/services/${service._id}`}
                                            className="flex-1 text-center text-sm bg-[#3D5A3E] text-white py-1.5 rounded-lg hover:bg-[#2D452E] transition-all"
                                        >
                                            Voir le service
                                        </Link>
                                        <button
                                            onClick={() => removeFromWishlist(itemId)}
                                            className="text-sm bg-red-50 text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                                        >
                                            <FiTrash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ClientWishlist;