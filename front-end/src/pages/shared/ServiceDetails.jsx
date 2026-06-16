// src/pages/shared/ServiceDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { serviceApi } from '../../api/serviceApi';
import { orderApi } from '../../api/orderApi';
import { reviewApi } from '../../api/reviewApi';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import ErrorAlert from '../../components/common/ErrorAlert';
import { 
  FiStar, FiClock, FiEye, FiShoppingBag, FiUser, 
  FiMapPin, FiAlertCircle, FiSend, FiArrowLeft, 
  FiShare2, FiCalendar, FiShield, FiHeart, FiEdit2, FiTrash2
} from 'react-icons/fi';

function ServiceDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [orderLoading, setOrderLoading] = useState(false);
    const [requirements, setRequirements] = useState('');
    const [reviews, setReviews] = useState([]);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [orderError, setOrderError] = useState('');

    // Configuration des catégories
    const categories = {
        'graphic-design': { name: 'Design Graphique', icon: '🎨', bg: 'bg-purple-50', text: 'text-purple-600' },
        'web-development': { name: 'Développement Web', icon: '💻', bg: 'bg-blue-50', text: 'text-blue-600' },
        'marketing': { name: 'Marketing Digital', icon: '📈', bg: 'bg-orange-50', text: 'text-orange-600' },
        'writing': { name: 'Rédaction', icon: '✍️', bg: 'bg-green-50', text: 'text-green-600' },
        'video': { name: 'Vidéo & Animation', icon: '🎥', bg: 'bg-red-50', text: 'text-red-600' },
        'consulting': { name: 'Consulting', icon: '💡', bg: 'bg-indigo-50', text: 'text-indigo-600' }
    };

    useEffect(() => {
        fetchServiceData();
        fetchReviews();
    }, [id]);

    const fetchServiceData = async () => {
        setLoading(true);
        try {
            const response = await serviceApi.getServiceById(id);
            setService(response.data.service);
        } catch (err) {
            setError('Impossible de charger les détails de ce service.');
            toast.error('Service non trouvé');
        } finally {
            setLoading(false);
        }
    };

    const fetchReviews = async () => {
        try {
            const response = await reviewApi.getServiceReviews(id);
            setReviews(response.data.reviews || []);
        } catch (err) {
            console.error('Erreur chargement avis:', err);
        }
    };

    const handleOrder = async () => {
        // Vider l'erreur précédente
        setOrderError('');
        
        // Vérifier si l'utilisateur est connecté
        if (!user) {
            setOrderError('Veuillez vous connecter pour commander ce service');
            return;
        }
        
        // Vérifier que ce n'est pas le propriétaire du service
        if (user._id === service?.freelancerId?._id) {
            setOrderError('Vous ne pouvez pas commander votre propre service');
            return;
        }
        
        // Vérifier le rôle
        if (user.role === 'freelancer') {
            setOrderError('Seuls les clients peuvent commander des services');
            return;
        }
        
        if (user.role === 'admin') {
            setOrderError('Les administrateurs ne peuvent pas commander de services');
            return;
        }

        if (!requirements.trim()) {
            setOrderError('Veuillez décrire vos besoins avant de commander');
            return;
        }
        
        setOrderLoading(true);
        try {
            const response = await orderApi.createOrder({
                serviceId: id,
                requirements: requirements
            });
            if (response.data.success) {
                toast.success('Commande créée avec succès !');
                navigate('/client/orders');
            }
        } catch (err) {
            setOrderError(err.response?.data?.message || 'Erreur lors de la commande');
        } finally {
            setOrderLoading(false);
        }
    };

    const handleEdit = () => {
        navigate(`/freelancer/services/edit/${id}`);
    };

    const handleDelete = async () => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) {
            try {
                await serviceApi.deleteService(id);
                toast.success('Service supprimé avec succès');
                navigate('/freelancer/services');
            } catch (err) {
                toast.error('Erreur lors de la suppression');
            }
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('fr-MA').format(price);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FAF8F5] via-white to-[#FAF8F5]">
                <div className="relative w-12 h-12">
                    <div className="absolute inset-0 border-3 border-[#E8EDE6] rounded-full"></div>
                    <div className="absolute inset-0 border-3 border-[#3D5A3E] border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    if (error || !service) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FAF8F5] via-white to-[#FAF8F5]">
                <div className="text-center bg-white p-8 rounded-2xl border border-[#E8E2D9] shadow-sm max-w-md">
                    <div className="text-6xl mb-4">🔍</div>
                    <ErrorAlert message={error || 'Service introuvable.'} />
                    <Link to="/services" className="text-[#3D5A3E] font-bold hover:underline inline-flex items-center gap-2 mt-4">
                        <FiArrowLeft size={16} /> Retour aux services
                    </Link>
                </div>
            </div>
        );
    }

    const categoryInfo = categories[service.category] || { 
        name: service.category || 'Service', 
        icon: '✨', 
        bg: 'bg-gray-50', 
        text: 'text-gray-600' 
    };
    
    // Vérifier si l'utilisateur est le propriétaire
    const isOwner = user?._id === service.freelancerId?._id;
    
    // Vérifier si l'utilisateur est admin
    const isAdmin = user?.role === 'admin';

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FAF8F5] via-white to-[#FAF8F5]">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-md border-b border-[#E8E2D9] sticky top-0 z-10">
                <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <button 
                            onClick={() => navigate(-1)} 
                            className="flex items-center gap-2 text-[#6B5E4F] hover:text-[#3D5A3E] transition-colors"
                        >
                            <FiArrowLeft size={20} />
                            <span>Retour</span>
                        </button>
                        <div className="flex gap-3">
                            {/* Boutons d'action pour le propriétaire */}
                            {isOwner && (
                                <>
                                    <button 
                                        onClick={handleEdit}
                                        className="p-2 text-[#3D5A3E] hover:text-[#2D452E] transition-colors rounded-full hover:bg-[#E8EDE6]"
                                    >
                                        <FiEdit2 size={18} />
                                    </button>
                                    <button 
                                        onClick={handleDelete}
                                        className="p-2 text-red-500 hover:text-red-600 transition-colors rounded-full hover:bg-red-50"
                                    >
                                        <FiTrash2 size={18} />
                                    </button>
                                </>
                            )}
                            {!isOwner && !isAdmin && (
                                <>
                                    <button className="p-2 text-[#6B5E4F] hover:text-[#3D5A3E] transition-colors rounded-full hover:bg-[#E8EDE6]">
                                        <FiHeart size={18} />
                                    </button>
                                    <button className="p-2 text-[#6B5E4F] hover:text-[#3D5A3E] transition-colors rounded-full hover:bg-[#E8EDE6]">
                                        <FiShare2 size={18} />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* ========== COLONNE PRINCIPALE (2/3) ========== */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Carte du service */}
                        <div className="bg-white rounded-2xl border border-[#E8E2D9] overflow-hidden shadow-sm">
                            {/* Image */}
                            {service.images && service.images.length > 0 ? (
                                <img 
                                    src={service.images[0]} 
                                    alt={service.title}
                                    className="w-full h-64 object-cover"
                                />
                            ) : (
                                <div className="h-64 bg-gradient-to-r from-[#E8EDE6] to-[#FAF8F5] flex items-center justify-center">
                                    <span className="text-8xl">{categoryInfo.icon}</span>
                                </div>
                            )}
                            
                            {/* Contenu */}
                            <div className="p-6">
                                {/* Catégorie */}
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${categoryInfo.bg} ${categoryInfo.text} text-xs font-semibold mb-4`}>
                                    <span>{categoryInfo.icon}</span>
                                    <span>{categoryInfo.name}</span>
                                </span>
                                
                                {/* Titre */}
                                <h1 className="text-2xl font-heading font-bold text-[#1A1208] mb-3">
                                    {service.title}
                                </h1>
                                
                                {/* Stats */}
                                <div className="flex flex-wrap items-center gap-4 text-sm text-[#6B5E4F] mb-6 pb-5 border-b border-[#E8E2D9]">
                                    <div className="flex items-center gap-1">
                                        <FiStar className="text-yellow-500 fill-current" size={15} />
                                        <span className="font-medium text-[#1A1208]">{service.rating || 'Nouveau'}</span>
                                        <span className="text-xs">({service.ratingCount || 0})</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <FiEye size={15} />
                                        <span>{service.views || 0} vues</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <FiShoppingBag size={15} />
                                        <span>{service.orders || 0} commandes</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <FiClock size={15} />
                                        <span>{service.deliveryDays} jours</span>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="mb-5">
                                    <h2 className="font-heading font-semibold text-[#1A1208] mb-2 text-base">Description</h2>
                                    <div className="text-[#6B5E4F] text-sm leading-relaxed">
                                        <p className={!showFullDescription ? "line-clamp-4" : ""}>
                                            {service.description}
                                        </p>
                                        {service.description && service.description.length > 250 && (
                                            <button 
                                                onClick={() => setShowFullDescription(!showFullDescription)}
                                                className="text-[#3D5A3E] text-xs font-medium mt-1 hover:underline"
                                            >
                                                {showFullDescription ? 'Voir moins' : 'Voir plus'}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Prérequis */}
                                {service.requirements && (
                                    <div className="p-4 bg-[#E8EDE6]/30 rounded-xl mb-4">
                                        <h2 className="font-heading font-semibold text-[#1A1208] text-sm mb-2 flex items-center gap-1.5">
                                            <FiAlertCircle size={14} className="text-[#3D5A3E]" />
                                            Prérequis
                                        </h2>
                                        <p className="text-[#6B5E4F] text-xs">{service.requirements}</p>
                                    </div>
                                )}

                                {/* Tags */}
                                {service.tags && service.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5">
                                        {service.tags.map((tag, i) => (
                                            <span key={i} className="px-2 py-0.5 bg-[#E8EDE6] rounded-full text-xs text-[#6B5E4F]">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Avis clients */}
                        {reviews.length > 0 && (
                            <div className="bg-white rounded-2xl border border-[#E8E2D9] p-5 shadow-sm">
                                <h2 className="font-heading font-semibold text-[#1A1208] mb-3 text-base flex items-center gap-2">
                                    <FiStar className="text-yellow-500 fill-current" size={16} />
                                    Avis clients ({reviews.length})
                                </h2>
                                <div className="space-y-3">
                                    {reviews.slice(0, 3).map((review) => (
                                        <div key={review._id} className="bg-[#FAF8F5] rounded-xl p-3">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 rounded-full bg-gradient-to-r from-[#3D5A3E] to-[#2D452E] flex items-center justify-center text-white text-xs font-bold">
                                                        {review.clientId?.name?.charAt(0) || 'C'}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-[#1A1208] text-xs">{review.clientId?.name}</p>
                                                        <div className="flex items-center gap-0.5">
                                                            {[...Array(5)].map((_, i) => (
                                                                <FiStar key={i} className={`${i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} size={10} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-[#9B9082] flex items-center gap-1">
                                                    <FiCalendar size={10} />
                                                    {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                                                </p>
                                            </div>
                                            <p className="text-[#6B5E4F] text-xs leading-relaxed">{review.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ========== COLONNE LATÉRALE (1/3) ========== */}
                    <div className="lg:col-span-1">
                        <div className="space-y-5 sticky top-24">
                            
                            {/* Carte de commande - Visible seulement pour les clients */}
                            {(!isOwner && !isAdmin && user?.role === 'client') && (
                                <div className="bg-white rounded-2xl border border-[#E8E2D9] p-5 shadow-sm">
                                    <div className="text-center pb-3 border-b border-[#E8E2D9] mb-4">
                                        <p className="text-xs text-[#6B5E4F] uppercase tracking-wide">Tarif</p>
                                        <div className="text-3xl font-heading font-bold text-[#3D5A3E]">
                                            {formatPrice(service.price)} <span className="text-sm font-body">DH</span>
                                        </div>
                                        <p className="text-xs text-[#9B9082]">/ projet</p>
                                    </div>
                                    
                                    {orderError && (
                                        <ErrorAlert 
                                            message={orderError} 
                                            onClose={() => setOrderError('')}
                                        />
                                    )}
                                    
                                    <div className="space-y-2 mb-4">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-[#6B5E4F]">Livraison</span>
                                            <span className="font-medium text-[#1A1208]">{service.deliveryDays} jours</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-[#6B5E4F]">Commandes</span>
                                            <span className="font-medium text-[#1A1208]">{service.orders || 0}</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-[#6B5E4F]">Note</span>
                                            <div className="flex items-center gap-1">
                                                <FiStar className="text-yellow-500 fill-current" size={12} />
                                                <span className="font-medium text-[#1A1208]">{service.rating || 'Nouveau'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <textarea
                                        className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl focus:outline-none focus:border-[#3D5A3E] focus:ring-1 focus:ring-[#3D5A3E]/10 transition-all mb-3 text-sm"
                                        rows="3"
                                        placeholder="Décrivez votre projet..."
                                        value={requirements}
                                        onChange={(e) => setRequirements(e.target.value)}
                                    />
                                    <button
                                        onClick={handleOrder}
                                        disabled={orderLoading}
                                        className="w-full bg-[#3D5A3E] hover:bg-[#2D452E] text-white py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {orderLoading ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Commande...
                                            </>
                                        ) : (
                                            <>
                                                <FiSend size={14} />
                                                Commander
                                            </>
                                        )}
                                    </button>
                                    <p className="text-xs text-center text-[#9B9082] mt-2 flex items-center justify-center gap-1">
                                        <FiShield size={11} />
                                        Paiement sécurisé
                                    </p>
                                </div>
                            )}

                            {/* Message pour les freelancers qui voient leur propre service */}
                            {isOwner && (
                                <div className="bg-[#E8EDE6]/30 rounded-2xl p-5 text-center">
                                    <div className="text-4xl mb-3">🛠️</div>
                                    <h3 className="font-heading font-semibold text-[#1A1208] mb-2">Votre service</h3>
                                    <p className="text-[#6B5E4F] text-sm mb-3">
                                        Ce service vous appartient. Vous pouvez le modifier ou le supprimer.
                                    </p>
                                    <div className="flex gap-3 justify-center">
                                        <button 
                                            onClick={handleEdit}
                                            className="flex items-center gap-2 px-4 py-2 bg-[#3D5A3E] text-white rounded-xl text-sm font-medium hover:bg-[#2D452E] transition-all"
                                        >
                                            <FiEdit2 size={14} />
                                            Modifier
                                        </button>
                                        <button 
                                            onClick={handleDelete}
                                            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 transition-all"
                                        >
                                            <FiTrash2 size={14} />
                                            Supprimer
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Message pour les admins */}
                            {isAdmin && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 text-center">
                                    <div className="text-4xl mb-3">👑</div>
                                    <h3 className="font-heading font-semibold text-yellow-800 mb-2">Mode Admin</h3>
                                    <p className="text-yellow-700 text-sm">
                                        Vous êtes en mode administrateur. Vous ne pouvez pas commander ce service.
                                    </p>
                                </div>
                            )}

                            {/* Profil de l'artisan */}
                            <div className="bg-white rounded-2xl border border-[#E8E2D9] p-4 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#3D5A3E] to-[#2D452E] flex items-center justify-center text-white text-lg font-bold">
                                        {service.freelancerId?.name?.charAt(0) || 'A'}
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-semibold text-[#1A1208]">{service.freelancerId?.name || 'Artisan'}</div>
                                        {service.freelancerId?.city && (
                                            <div className="flex items-center gap-1 text-xs text-[#6B5E4F]">
                                                <FiMapPin size={11} />
                                                <span>{service.freelancerId.city}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-1 mt-1">
                                            <FiStar className="text-yellow-500 fill-current" size={11} />
                                            <span className="text-xs font-medium">{service.freelancerId?.rating || '5.0'}</span>
                                            <span className="text-xs text-[#9B9082]">({service.freelancerId?.ratingCount || 0})</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-3 pt-3 border-t border-[#E8E2D9]">
                                    <Link 
                                        to={`/freelancers/${service.freelancerId?._id}`}
                                        className="w-full inline-block text-center text-[#3D5A3E] text-sm font-medium hover:underline"
                                    >
                                        Voir le profil complet
                                    </Link>
                                </div>
                            </div>

                            {/* Garanties */}
                            <div className="bg-[#E8EDE6]/20 rounded-xl p-3">
                                <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-[#6B5E4F]">
                                    <FiShield size={14} className="text-[#3D5A3E]" />
                                    <span>Paiement sécurisé</span>
                                    <span>•</span>
                                    <span>Satisfait ou remboursé</span>
                                    <span>•</span>
                                    <span>Support 24/7</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .line-clamp-4 {
                    display: -webkit-box;
                    -webkit-line-clamp: 4;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </div>
    );
}

export default ServiceDetails;