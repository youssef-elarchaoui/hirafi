// src/pages/shared/SuccessStories.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { serviceApi } from '../../api/serviceApi';
import { reviewApi } from '../../api/reviewApi';
import { userApi } from '../../api/userApi';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import { 
  FiStar, FiHeart, FiUsers, FiBriefcase, FiTrendingUp,
  FiArrowRight, FiClock, FiMapPin, FiAward,
  FiCheckCircle, FiMessageCircle, FiShare2,
  FiFilter, FiSearch, FiGrid, FiList, FiUser, // ✅ Ajout de FiUser
  FiDollarSign, FiEye // ✅ Ajout de FiDollarSign et FiEye si besoin
} from 'react-icons/fi';

const SuccessStories = () => {
    const { user } = useAuth();
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('grid');

    useEffect(() => {
        fetchSuccessStories();
    }, []);

    const fetchSuccessStories = async () => {
        setLoading(true);
        try {
            const servicesRes = await serviceApi.getAllServices({ limit: 1000 });
            const services = servicesRes.data.services || [];
            
            const reviewsRes = await reviewApi.getMyReviews();
            const allReviews = reviewsRes.data.reviews || [];
            
            const storiesData = [];
            
            for (const review of allReviews) {
                const service = services.find(s => s._id === review.serviceId);
                
                let freelancer = null;
                try {
                    if (review.freelancerId) {
                        const userRes = await userApi.getUserById(review.freelancerId);
                        freelancer = userRes.data.user;
                    }
                } catch (e) {
                    // Ignorer
                }
                
                if (review.rating >= 4 && review.comment && review.comment.length > 20) {
                    storiesData.push({
                        _id: review._id,
                        rating: review.rating,
                        comment: review.comment,
                        clientId: review.clientId || { name: 'Client' },
                        freelancerName: freelancer?.name || 'Artisan',
                        freelancerCity: freelancer?.city || 'Maroc',
                        freelancerAvatar: freelancer?.avatar || null,
                        serviceTitle: service?.title || 'Service',
                        category: service?.category || 'general',
                        price: service?.price || 0,
                        createdAt: review.createdAt,
                        helpful: review.helpful || [],
                        freelancerId: review.freelancerId
                    });
                }
            }
            
            if (storiesData.length < 3) {
                const defaultStories = getDefaultStories();
                const existingIds = new Set(storiesData.map(s => s._id));
                for (const story of defaultStories) {
                    if (!existingIds.has(story._id)) {
                        storiesData.push(story);
                    }
                }
            }
            
            storiesData.sort((a, b) => {
                if (b.rating !== a.rating) return b.rating - a.rating;
                return new Date(b.createdAt) - new Date(a.createdAt);
            });
            
            setStories(storiesData);
        } catch (error) {
            console.error('Erreur:', error);
            setStories(getDefaultStories());
        } finally {
            setLoading(false);
        }
    };

    const getDefaultStories = () => {
        return [
            {
                _id: 'default1',
                rating: 5,
                comment: 'Un vrai talent ! La calligraphie est sublime, un mélange parfait entre tradition et modernité. Merci Nadia !',
                clientId: { name: 'Ahmed Tazi' },
                freelancerName: 'Nadia Benali',
                freelancerCity: 'Marrakech',
                freelancerAvatar: null,
                serviceTitle: 'Calligraphie sur mesure',
                category: 'graphic-design',
                price: 800,
                createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                helpful: ['user1', 'user2', 'user3']
            },
            {
                _id: 'default2',
                rating: 5,
                comment: 'Application mobile développée avec une qualité exceptionnelle. Je recommande vivement !',
                clientId: { name: 'Karim Benjelloun' },
                freelancerName: 'Mohamed Amine',
                freelancerCity: 'Casablanca',
                freelancerAvatar: null,
                serviceTitle: 'Application React Native',
                category: 'web-development',
                price: 1500,
                createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
                helpful: ['user1', 'user2', 'user3', 'user4']
            },
            {
                _id: 'default3',
                rating: 5,
                comment: 'Stratégie marketing sur mesure qui a transformé notre présence en ligne.',
                clientId: { name: 'Sara El Fassi' },
                freelancerName: 'Youssef El Mansouri',
                freelancerCity: 'Rabat',
                freelancerAvatar: null,
                serviceTitle: 'Marketing Digital',
                category: 'marketing',
                price: 1200,
                createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
                helpful: ['user1', 'user2']
            }
        ];
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

    const getCategoryColor = (category) => {
        const colors = {
            'graphic-design': 'from-purple-500 to-pink-500',
            'web-development': 'from-blue-500 to-cyan-500',
            'marketing': 'from-orange-500 to-red-500',
            'writing': 'from-green-500 to-emerald-500',
            'video': 'from-red-500 to-rose-500',
            'consulting': 'from-indigo-500 to-purple-500'
        };
        return colors[category] || 'from-emerald-500 to-teal-500';
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const filteredStories = stories.filter(story => {
        const matchesSearch = 
            story.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            story.freelancerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            story.serviceTitle?.toLowerCase().includes(searchTerm.toLowerCase());
        
        if (filter === 'all') return matchesSearch;
        if (filter === 'top-rated') return matchesSearch && story.rating >= 4.8;
        if (filter === 'recent') return matchesSearch && new Date(story.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        return matchesSearch;
    });

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
        <div className="min-h-screen bg-gradient-to-br from-[#FAF8F5] via-white to-[#FAF8F5]">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#3D5A3E] to-[#2D452E] text-white py-12">
                <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3 mb-3">
                        <span className="text-4xl">⭐</span>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold">
                            Success Stories
                        </h1>
                    </div>
                    <p className="text-white/80 text-lg max-w-2xl">
                        Découvrez les témoignages de clients satisfaits et les histoires de réussite de nos artisans
                    </p>
                </div>
            </div>

            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                
                {/* Search and Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <div className="flex-1 relative">
                        <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#9B9082]" size={20} />
                        <input
                            type="text"
                            placeholder="Rechercher une histoire, un artisan..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white border border-[#E8E2D9] rounded-xl focus:outline-none focus:border-[#3D5A3E] focus:ring-2 focus:ring-[#3D5A3E]/10 transition-all"
                        />
                    </div>
                    <div className="flex gap-3">
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="px-4 py-3 bg-white border border-[#E8E2D9] rounded-xl focus:outline-none focus:border-[#3D5A3E] text-sm"
                        >
                            <option value="all">Toutes les histoires</option>
                            <option value="top-rated">⭐ Top notées</option>
                            <option value="recent">📅 Récentes</option>
                        </select>
                        <div className="flex bg-white border border-[#E8E2D9] rounded-xl overflow-hidden">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-3 transition-all ${viewMode === 'grid' ? 'bg-[#E8EDE6] text-[#3D5A3E]' : 'text-[#9B9082]'}`}
                            >
                                <FiGrid size={18} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-3 transition-all ${viewMode === 'list' ? 'bg-[#E8EDE6] text-[#3D5A3E]' : 'text-[#9B9082]'}`}
                            >
                                <FiList size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white rounded-xl border border-[#E8E2D9] p-4 text-center">
                        <div className="text-3xl font-bold text-[#3D5A3E]">{stories.length}</div>
                        <div className="text-sm text-[#6B5E4F]">Histoires de réussite</div>
                    </div>
                    <div className="bg-white rounded-xl border border-[#E8E2D9] p-4 text-center">
                        <div className="text-3xl font-bold text-[#3D5A3E]">
                            {stories.length > 0 ? (stories.reduce((acc, s) => acc + s.rating, 0) / stories.length).toFixed(1) : 0}
                        </div>
                        <div className="text-sm text-[#6B5E4F]">Note moyenne</div>
                    </div>
                    <div className="bg-white rounded-xl border border-[#E8E2D9] p-4 text-center">
                        <div className="text-3xl font-bold text-[#3D5A3E]">
                            {stories.filter(s => s.rating >= 5).length}
                        </div>
                        <div className="text-sm text-[#6B5E4F]">Histoires 5 étoiles</div>
                    </div>
                </div>

                {/* Stories Grid/List */}
                {filteredStories.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl border border-[#E8E2D9]">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-heading font-semibold text-[#1A1208] mb-2">
                            Aucune histoire trouvée
                        </h3>
                        <p className="text-[#6B5E4F]">
                            {searchTerm ? 'Aucune histoire ne correspond à votre recherche' : 'Aucune histoire disponible pour le moment'}
                        </p>
                    </div>
                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredStories.map((story) => (
                            <div key={story._id} className="group bg-white rounded-2xl border border-[#E8E2D9] overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                <div className={`h-20 bg-gradient-to-r ${getCategoryColor(story.category)} flex items-center justify-between px-6`}>
                                    <div className="flex items-center gap-3">
                                        <span className="text-3xl">{getCategoryIcon(story.category)}</span>
                                        <span className="text-white font-semibold text-sm truncate max-w-[150px]">
                                            {story.serviceTitle}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full">
                                        <FiStar className="text-yellow-400 fill-current" size={14} />
                                        <span className="text-white text-sm font-bold">{story.rating}</span>
                                    </div>
                                </div>

                                <div className="p-5">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#3D5A3E] to-[#2D452E] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                            {story.freelancerName?.charAt(0) || 'A'}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-[#1A1208]">{story.freelancerName}</p>
                                            <div className="flex items-center gap-1 text-xs text-[#6B5E4F]">
                                                <FiMapPin size={12} />
                                                <span>{story.freelancerCity}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-[#6B5E4F] text-sm leading-relaxed line-clamp-3 mb-4">
                                        "{story.comment}"
                                    </p>
                                    <div className="flex items-center justify-between text-xs text-[#6B5E4F] pt-3 border-t border-[#E8E2D9]">
                                        <span className="flex items-center gap-1">
                                            <FiClock size={12} />
                                            {formatDate(story.createdAt)}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <span className="flex items-center gap-1">
                                                <FiHeart size={12} />
                                                {story.helpful?.length || 0}
                                            </span>
                                            <span className="text-xs text-[#6B5E4F]">
                                                {story.clientId?.name?.split(' ')[0] || 'Client'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredStories.map((story) => (
                            <div key={story._id} className="bg-white rounded-2xl border border-[#E8E2D9] p-5 hover:shadow-lg transition-all">
                                <div className="flex flex-col sm:flex-row gap-5">
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-3 mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-2xl">{getCategoryIcon(story.category)}</span>
                                                <span className="font-semibold text-[#1A1208]">{story.serviceTitle}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-yellow-500">
                                                {[...Array(5)].map((_, i) => (
                                                    <FiStar key={i} className={i < story.rating ? 'fill-current' : ''} size={14} />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-[#6B5E4F] text-sm leading-relaxed italic">
                                            "{story.comment}"
                                        </p>
                                        <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-[#6B5E4F]">
                                            <span className="flex items-center gap-1">
                                                <FiUser size={12} />
                                                {story.freelancerName}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <FiMapPin size={12} />
                                                {story.freelancerCity}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <FiClock size={12} />
                                                {formatDate(story.createdAt)}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <FiHeart size={12} />
                                                {story.helpful?.length || 0} utiles
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 sm:flex-col sm:items-end">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#3D5A3E] to-[#2D452E] flex items-center justify-center text-white font-bold text-sm">
                                            {story.freelancerName?.charAt(0) || 'A'}
                                        </div>
                                        <span className="px-3 py-1 bg-[#E8EDE6] text-[#3D5A3E] rounded-full text-xs font-medium">
                                            {story.price} DH
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* CTA Section */}
            <section className="py-16 bg-[#E8EDE6]/30 mt-8">
                <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="text-5xl mb-4">🌟</div>
                    <h2 className="text-3xl font-heading font-bold text-[#1A1208] mb-4">
                        Vous aussi, créez votre histoire de réussite
                    </h2>
                    <p className="text-[#6B5E4F] max-w-2xl mx-auto mb-8">
                        Rejoignez notre communauté et faites partie des prochaines success stories
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        {!user ? (
                            <>
                                <Link
                                    to="/register?role=client"
                                    className="bg-[#3D5A3E] hover:bg-[#2D452E] text-white px-8 py-3 rounded-xl font-semibold transition-all"
                                >
                                    Commencer en tant que client
                                </Link>
                                <Link
                                    to="/register?role=freelancer"
                                    className="bg-white border-2 border-[#3D5A3E] text-[#3D5A3E] hover:bg-[#E8EDE6] px-8 py-3 rounded-xl font-semibold transition-all"
                                >
                                    Devenir artisan
                                </Link>
                            </>
                        ) : (
                            <Link
                                to="/services"
                                className="bg-[#3D5A3E] hover:bg-[#2D452E] text-white px-8 py-3 rounded-xl font-semibold transition-all"
                            >
                                Explorer les services
                            </Link>
                        )}
                    </div>
                </div>
            </section>

            <style>{`
                .line-clamp-3 {
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </div>
    );
};

export default SuccessStories;