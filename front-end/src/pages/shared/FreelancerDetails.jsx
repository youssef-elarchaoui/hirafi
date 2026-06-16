// src/pages/shared/FreelancerDetails.jsx - Modifiez le bouton Contacter
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { userApi } from '../../api/userApi';
import { serviceApi } from '../../api/serviceApi';
import { reviewApi } from '../../api/reviewApi';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import { 
  FiArrowLeft, FiStar, FiMapPin, FiBriefcase, FiClock,
  FiDollarSign, FiMail, FiPhone, FiGlobe, FiAward,
  FiCheckCircle, FiMessageCircle, FiShare2, FiHeart,
  FiGithub, FiLinkedin, FiTwitter, FiInstagram,
  FiCalendar, FiTrendingUp, FiUsers
} from 'react-icons/fi';

const FreelancerDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth(); // ✅ Ajouté pour vérifier si l'utilisateur est connecté
    const [freelancer, setFreelancer] = useState(null);
    const [services, setServices] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('services');

    useEffect(() => {
        fetchFreelancerData();
    }, [id]);

    const fetchFreelancerData = async () => {
        setLoading(true);
        try {
            const userResponse = await userApi.getFreelancerById(id);
            setFreelancer(userResponse.data.freelancer || userResponse.data.user);
            
            const servicesResponse = await serviceApi.getFreelancerServices(id);
            setServices(servicesResponse.data.services || []);
            
            const reviewsResponse = await reviewApi.getFreelancerReviews(id);
            setReviews(reviewsResponse.data.reviews || []);
            
        } catch (error) {
            console.error('Erreur:', error);
            toast.error('Impossible de charger le profil');
            navigate('/freelancers');
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('fr-MA').format(price || 0);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    // ✅ Fonction pour gérer le contact
    const handleContact = () => {
        if (!user) {
            toast.error('Veuillez vous connecter pour contacter un artisan');
            navigate('/login');
            return;
        }
        
        // Rediriger vers la page des messages avec l'ID du freelancer
        navigate(`/messages?user=${id}`);
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

    if (!freelancer) {
        return (
            <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h2 className="text-2xl font-heading font-bold text-[#1A1208] mb-2">
                    Artisan non trouvé
                </h2>
                <Link to="/freelancers" className="text-[#3D5A3E] hover:underline">
                    Retour à la liste
                </Link>
            </div>
        );
    }

    const socialLinks = [
        { key: 'github', icon: FiGithub, label: 'GitHub' },
        { key: 'linkedin', icon: FiLinkedin, label: 'LinkedIn' },
        { key: 'twitter', icon: FiTwitter, label: 'Twitter' },
        { key: 'instagram', icon: FiInstagram, label: 'Instagram' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FAF8F5] via-white to-[#FAF8F5]">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                
                {/* Bouton retour */}
                <button 
                    onClick={() => navigate('/freelancers')}
                    className="flex items-center gap-2 text-[#6B5E4F] hover:text-[#3D5A3E] transition-colors mb-6"
                >
                    <FiArrowLeft size={20} />
                    Retour aux artisans
                </button>

                {/* Profil */}
                <div className="bg-white rounded-2xl border border-[#E8E2D9] overflow-hidden shadow-sm">
                    {/* Header */}
                    <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 border-b border-[#E8E2D9]">
                        <img 
                            src={freelancer.avatar || `https://ui-avatars.com/api/?background=3D5A3E&color=fff&bold=true&name=${freelancer.name || 'U'}`}
                            alt={freelancer.name}
                            className="w-24 h-24 rounded-full object-cover border-4 border-[#E8EDE6]"
                        />
                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-2xl font-heading font-bold text-[#1A1208]">
                                    {freelancer.name}
                                </h1>
                                {freelancer.isVerified && (
                                    <span className="flex items-center gap-1 text-sm bg-[#E8EDE6] text-[#3D5A3E] px-2 py-1 rounded-full">
                                        <FiCheckCircle size={14} /> Vérifié
                                    </span>
                                )}
                                <div className="flex items-center gap-1 text-yellow-500">
                                    <FiStar className="fill-current" />
                                    <span className="font-semibold text-[#1A1208]">{freelancer.rating || 'Nouveau'}</span>
                                    <span className="text-xs text-[#6B5E4F]">({freelancer.ratingCount || 0} avis)</span>
                                </div>
                            </div>
                            {freelancer.city && (
                                <p className="text-[#6B5E4F] flex items-center gap-1 mt-1">
                                    <FiMapPin size={14} />
                                    {freelancer.city}
                                </p>
                            )}
                            {freelancer.bio && (
                                <p className="text-[#6B5E4F] mt-3 max-w-2xl">{freelancer.bio}</p>
                            )}
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                            {/* ✅ Bouton Contacter corrigé */}
                            <button 
                                onClick={handleContact}
                                className="flex items-center gap-2 px-4 py-2 bg-[#3D5A3E] hover:bg-[#2D452E] text-white rounded-xl font-semibold transition-all"
                            >
                                <FiMessageCircle size={18} />
                                Contacter
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 border border-[#E8E2D9] rounded-xl hover:border-[#3D5A3E] transition-all">
                                <FiShare2 size={18} />
                                Partager
                            </button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-[#FAF8F5] border-b border-[#E8E2D9]">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-[#1A1208]">{services.length}</div>
                            <div className="text-xs text-[#6B5E4F]">Services</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-[#1A1208]">{freelancer.totalOrders || 0}</div>
                            <div className="text-xs text-[#6B5E4F]">Commandes</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-[#3D5A3E]">{formatPrice(freelancer.hourlyRate)} DH</div>
                            <div className="text-xs text-[#6B5E4F]">Tarif horaire</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-[#1A1208]">{freelancer.totalEarnings || 0} DH</div>
                            <div className="text-xs text-[#6B5E4F]">Revenus</div>
                        </div>
                    </div>

                    {/* Social Links */}
                    {freelancer.socialLinks && Object.values(freelancer.socialLinks).some(v => v) && (
                        <div className="p-6 border-b border-[#E8E2D9]">
                            <h3 className="font-heading font-semibold text-[#1A1208] mb-3 flex items-center gap-2">
                                <FiGlobe size={18} />
                                Réseaux sociaux
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {socialLinks.map(({ key, icon: Icon, label }) => {
                                    const url = freelancer.socialLinks?.[key];
                                    if (!url) return null;
                                    return (
                                        <a
                                            key={key}
                                            href={url.startsWith('http') ? url : `https://${url}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-3 py-1.5 bg-[#FAF8F5] hover:bg-[#E8EDE6] rounded-lg text-sm text-[#6B5E4F] hover:text-[#3D5A3E] transition-all"
                                        >
                                            <Icon size={16} />
                                            {label}
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Tabs */}
                    <div className="flex border-b border-[#E8E2D9] overflow-x-auto">
                        <button
                            onClick={() => setActiveTab('services')}
                            className={`px-6 py-3 text-sm font-medium transition-all ${
                                activeTab === 'services'
                                    ? 'border-b-2 border-[#3D5A3E] text-[#3D5A3E]'
                                    : 'text-[#6B5E4F] hover:text-[#3D5A3E]'
                            }`}
                        >
                            Services ({services.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('reviews')}
                            className={`px-6 py-3 text-sm font-medium transition-all ${
                                activeTab === 'reviews'
                                    ? 'border-b-2 border-[#3D5A3E] text-[#3D5A3E]'
                                    : 'text-[#6B5E4F] hover:text-[#3D5A3E]'
                            }`}
                        >
                            Avis ({reviews.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('info')}
                            className={`px-6 py-3 text-sm font-medium transition-all ${
                                activeTab === 'info'
                                    ? 'border-b-2 border-[#3D5A3E] text-[#3D5A3E]'
                                    : 'text-[#6B5E4F] hover:text-[#3D5A3E]'
                            }`}
                        >
                            Informations
                        </button>
                    </div>

                    {/* Contenu des onglets */}
                    <div className="p-6">
                        {/* Services */}
                        {activeTab === 'services' && (
                            <div>
                                {services.length === 0 ? (
                                    <div className="text-center py-8">
                                        <p className="text-[#6B5E4F]">Aucun service proposé</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {services.map((service) => (
                                            <Link
                                                key={service._id}
                                                to={`/services/${service._id}`}
                                                className="group p-4 bg-[#FAF8F5] rounded-xl hover:bg-white hover:shadow-md transition-all"
                                            >
                                                <h4 className="font-semibold text-[#1A1208] group-hover:text-[#3D5A3E] transition-colors">
                                                    {service.title}
                                                </h4>
                                                <p className="text-sm text-[#6B5E4F] mt-1 line-clamp-2">{service.description}</p>
                                                <div className="flex items-center justify-between mt-3">
                                                    <span className="text-lg font-bold text-[#3D5A3E]">{formatPrice(service.price)} DH</span>
                                                    <span className="flex items-center gap-1 text-sm text-[#6B5E4F]">
                                                        <FiClock size={14} /> {service.deliveryDays} jours
                                                    </span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Avis */}
                        {activeTab === 'reviews' && (
                            <div>
                                {reviews.length === 0 ? (
                                    <div className="text-center py-8">
                                        <p className="text-[#6B5E4F]">Aucun avis pour le moment</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {reviews.map((review) => (
                                            <div key={review._id} className="p-4 bg-[#FAF8F5] rounded-xl">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-full bg-[#E8EDE6] flex items-center justify-center text-[#3D5A3E] font-bold">
                                                            {review.clientId?.name?.charAt(0) || 'C'}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-[#1A1208]">{review.clientId?.name}</p>
                                                            <div className="flex items-center gap-1 text-yellow-500">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <FiStar key={i} className={i < review.rating ? 'fill-current' : ''} size={12} />
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <span className="text-xs text-[#6B5E4F]">{formatDate(review.createdAt)}</span>
                                                </div>
                                                <p className="text-[#6B5E4F] text-sm">{review.comment}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Informations */}
                        {activeTab === 'info' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-4 bg-[#FAF8F5] rounded-xl">
                                    <p className="text-xs text-[#6B5E4F] uppercase tracking-wide">Email</p>
                                    <p className="text-[#1A1208] font-medium">{freelancer.email || 'Non renseigné'}</p>
                                </div>
                                <div className="p-4 bg-[#FAF8F5] rounded-xl">
                                    <p className="text-xs text-[#6B5E4F] uppercase tracking-wide">Téléphone</p>
                                    <p className="text-[#1A1208] font-medium">{freelancer.phone || 'Non renseigné'}</p>
                                </div>
                                <div className="p-4 bg-[#FAF8F5] rounded-xl">
                                    <p className="text-xs text-[#6B5E4F] uppercase tracking-wide">Ville</p>
                                    <p className="text-[#1A1208] font-medium">{freelancer.city || 'Non renseigné'}</p>
                                </div>
                                <div className="p-4 bg-[#FAF8F5] rounded-xl">
                                    <p className="text-xs text-[#6B5E4F] uppercase tracking-wide">Membre depuis</p>
                                    <p className="text-[#1A1208] font-medium">{formatDate(freelancer.createdAt)}</p>
                                </div>
                                <div className="p-4 bg-[#FAF8F5] rounded-xl sm:col-span-2">
                                    <p className="text-xs text-[#6B5E4F] uppercase tracking-wide">Compétences</p>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {freelancer.skills?.length > 0 ? (
                                            freelancer.skills.map((skill, idx) => (
                                                <span key={idx} className="px-3 py-1 bg-white border border-[#E8E2D9] rounded-full text-sm text-[#3D5A3E]">
                                                    {skill}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-[#6B5E4F]">Aucune compétence renseignée</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FreelancerDetails;