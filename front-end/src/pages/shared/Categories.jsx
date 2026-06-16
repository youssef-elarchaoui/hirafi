// src/pages/shared/Categories.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { serviceApi } from '../../api/serviceApi';
import { FiArrowRight, FiStar, FiBriefcase, FiTrendingUp, FiSearch, FiUsers, FiShoppingBag, FiClock } from 'react-icons/fi';

const Categories = () => {
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [featuredCategory, setFeaturedCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [totalStats, setTotalStats] = useState({
        totalServices: 0,
        totalFreelancers: 0,
        totalOrders: 0
    });

    // Configuration des catégories avec icônes et couleurs
    const categoriesConfig = {
        'graphic-design': {
            name: 'Design Graphique',
            icon: '🎨',
            description: 'Logo, branding, illustration, packaging',
            color: 'from-purple-500 to-pink-500',
            bg: 'bg-purple-50',
            text: 'text-purple-600',
            border: 'border-purple-200',
            hover: 'hover:border-purple-400',
            subcategories: ['Logo Design', 'Branding', 'Illustration', 'Packaging', 'Infographie']
        },
        'web-development': {
            name: 'Développement Web',
            icon: '💻',
            description: 'Sites web, applications, e-commerce, CMS',
            color: 'from-blue-500 to-cyan-500',
            bg: 'bg-blue-50',
            text: 'text-blue-600',
            border: 'border-blue-200',
            hover: 'hover:border-blue-400',
            subcategories: ['Frontend', 'Backend', 'Full Stack', 'E-commerce', 'WordPress']
        },
        'marketing': {
            name: 'Marketing Digital',
            icon: '📈',
            description: 'SEO, réseaux sociaux, publicité, emailing',
            color: 'from-orange-500 to-red-500',
            bg: 'bg-orange-50',
            text: 'text-orange-600',
            border: 'border-orange-200',
            hover: 'hover:border-orange-400',
            subcategories: ['SEO', 'Social Media', 'Ads', 'Email Marketing', 'Content Strategy']
        },
        'writing': {
            name: 'Rédaction',
            icon: '✍️',
            description: 'Contenu web, traduction, copywriting, relecture',
            color: 'from-green-500 to-emerald-500',
            bg: 'bg-green-50',
            text: 'text-green-600',
            border: 'border-green-200',
            hover: 'hover:border-green-400',
            subcategories: ['Rédaction web', 'Traduction', 'Copywriting', 'Proofreading', 'Blog posts']
        },
        'video': {
            name: 'Vidéo & Animation',
            icon: '🎥',
            description: 'Montage, motion design, 3D, effets spéciaux',
            color: 'from-red-500 to-rose-500',
            bg: 'bg-red-50',
            text: 'text-red-600',
            border: 'border-red-200',
            hover: 'hover:border-red-400',
            subcategories: ['Montage', 'Motion Design', 'Animation 3D', 'Effets spéciaux', 'Color grading']
        },
        'consulting': {
            name: 'Consulting',
            icon: '💡',
            description: 'Stratégie, coaching, conseil, audit',
            color: 'from-indigo-500 to-purple-500',
            bg: 'bg-indigo-50',
            text: 'text-indigo-600',
            border: 'border-indigo-200',
            hover: 'hover:border-indigo-400',
            subcategories: ['Stratégie', 'Coaching', 'Conseil', 'Audit', 'Formation']
        }
    };

    useEffect(() => {
        fetchCategoriesStats();
    }, []);

    const fetchCategoriesStats = async () => {
        setLoading(true);
        try {
            const response = await serviceApi.getAllServices({ limit: 1000 });
            const services = response.data.services || [];
            
            // Calculer les stats globales
            const uniqueFreelancers = new Set();
            let totalOrders = 0;
            
            services.forEach(service => {
                if (service.freelancerId?._id) {
                    uniqueFreelancers.add(service.freelancerId._id);
                }
                totalOrders += service.orders || 0;
            });
            
            setTotalStats({
                totalServices: services.length,
                totalFreelancers: uniqueFreelancers.size,
                totalOrders: totalOrders
            });
            
            // Calculer les stats pour chaque catégorie
            const categoriesWithStats = Object.keys(categoriesConfig).map(catId => {
                const categoryServices = services.filter(s => s.category === catId);
                const totalServices = categoryServices.length;
                const totalOrdersCat = categoryServices.reduce((acc, s) => acc + (s.orders || 0), 0);
                const avgRating = categoryServices.length > 0 
                    ? (categoryServices.reduce((acc, s) => acc + (s.rating || 0), 0) / categoryServices.length).toFixed(1) 
                    : 0;
                const totalViews = categoryServices.reduce((acc, s) => acc + (s.views || 0), 0);
                
                // Meilleur service de la catégorie
                const topService = categoryServices.sort((a, b) => (b.rating || 0) - (a.rating || 0))[0];
                
                // Artisans dans cette catégorie
                const freelancersInCat = new Set();
                categoryServices.forEach(s => {
                    if (s.freelancerId?._id) freelancersInCat.add(s.freelancerId._id);
                });
                
                return {
                    id: catId,
                    ...categoriesConfig[catId],
                    totalServices,
                    totalOrders: totalOrdersCat,
                    avgRating: avgRating > 0 ? avgRating : 'Nouveau',
                    totalViews,
                    totalFreelancers: freelancersInCat.size,
                    topService: topService || null
                };
            });
            
            // Trier par nombre de services (décroissant)
            const sortedCategories = categoriesWithStats.sort((a, b) => b.totalServices - a.totalServices);
            setCategories(sortedCategories);
            
            // Catégorie mise en avant (celle avec le plus de services)
            if (sortedCategories.length > 0 && sortedCategories[0].totalServices > 0) {
                setFeaturedCategory(sortedCategories[0]);
            }
            
        } catch (error) {
            console.error('Erreur chargement catégories:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatNumber = (num) => {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
        return num;
    };

    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FAF8F5] via-white to-[#FAF8F5]">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-[#3D5A3E] to-[#2D452E] text-white py-12">
                <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold mb-3">
                        Catégories de services
                    </h1>
                    <p className="text-white/80 text-lg max-w-2xl">
                        Explorez tous nos domaines d'expertise et trouvez l'artisan qu'il vous faut
                    </p>
                </div>
            </div>

            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                
                {/* Search Bar */}
                <div className="mb-8">
                    <div className="relative max-w-md">
                        <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#9B9082]" size={20} />
                        <input
                            type="text"
                            placeholder="Rechercher une catégorie..."
                            className="w-full pl-12 pr-4 py-3 bg-white border border-[#E8E2D9] rounded-xl focus:outline-none focus:border-[#3D5A3E] focus:ring-2 focus:ring-[#3D5A3E]/10 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                    <div className="bg-white rounded-xl p-4 text-center border border-[#E8E2D9]">
                        <div className="text-2xl font-bold text-[#3D5A3E]">{totalStats.totalServices}</div>
                        <div className="text-xs text-[#6B5E4F]">Services disponibles</div>
                    </div>
                    <div className="bg-white rounded-xl p-4 text-center border border-[#E8E2D9]">
                        <div className="text-2xl font-bold text-[#3D5A3E]">{totalStats.totalFreelancers}</div>
                        <div className="text-xs text-[#6B5E4F]">Artisans inscrits</div>
                    </div>
                    <div className="bg-white rounded-xl p-4 text-center border border-[#E8E2D9]">
                        <div className="text-2xl font-bold text-[#3D5A3E]">{formatNumber(totalStats.totalOrders)}+</div>
                        <div className="text-xs text-[#6B5E4F]">Commandes réalisées</div>
                    </div>
                </div>

                {/* Featured Category Banner */}
                {featuredCategory && featuredCategory.totalServices > 0 && !searchTerm && (
                    <div className="mb-12 bg-gradient-to-r from-[#3D5A3E] to-[#2D452E] rounded-2xl overflow-hidden shadow-xl">
                        <div className="flex flex-col lg:flex-row items-center justify-between p-8">
                            <div className="flex-1 text-center lg:text-left mb-6 lg:mb-0">
                                <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-3 py-1 text-xs text-white mb-4">
                                    <FiTrendingUp size={12} />
                                    Catégorie la plus populaire
                                </div>
                                <div className="text-6xl mb-3">{featuredCategory.icon}</div>
                                <h2 className="text-2xl font-heading font-bold text-white mb-2">
                                    {featuredCategory.name}
                                </h2>
                                <p className="text-white/80 text-sm mb-4 max-w-md">
                                    {featuredCategory.description}
                                </p>
                                <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                                    <div className="flex items-center gap-1 text-white/70 text-xs">
                                        <FiBriefcase size={12} />
                                        <span>{featuredCategory.totalServices} services</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-white/70 text-xs">
                                        <FiUsers size={12} />
                                        <span>{featuredCategory.totalFreelancers} artisans</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-white/70 text-xs">
                                        <FiStar className="fill-current" size={12} />
                                        <span>{featuredCategory.avgRating} / 5</span>
                                    </div>
                                </div>
                            </div>
                            <Link
                                to={`/services?category=${featuredCategory.id}`}
                                className="inline-flex items-center gap-2 bg-white text-[#3D5A3E] hover:bg-gray-100 px-6 py-3 rounded-xl font-semibold transition-all hover:gap-3"
                            >
                                Explorer {featuredCategory.name}
                                <FiArrowRight size={18} />
                            </Link>
                        </div>
                    </div>
                )}

                {/* Categories Grid */}
                {filteredCategories.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl border border-[#E8E2D9]">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-heading font-semibold text-[#1A1208] mb-2">Aucune catégorie trouvée</h3>
                        <p className="text-[#6B5E4F]">Essayez une autre recherche</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCategories.map((category) => (
                            <Link
                                key={category.id}
                                to={`/services?category=${category.id}`}
                                className="group bg-white rounded-2xl border border-[#E8E2D9] overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                            >
                                {/* Header with icon and color */}
                                <div className={`bg-gradient-to-r ${category.color} p-6 text-white relative overflow-hidden`}>
                                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full"></div>
                                    <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/5 rounded-full"></div>
                                    <div className="relative z-10">
                                        <span className="text-5xl group-hover:scale-110 transition-transform inline-block">{category.icon}</span>
                                    </div>
                                </div>
                                
                                {/* Content */}
                                <div className="p-5">
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="text-xl font-heading font-bold text-[#1A1208] group-hover:text-[#3D5A3E] transition-colors">
                                            {category.name}
                                        </h3>
                                        <div className={`${category.bg} ${category.text} px-2 py-0.5 rounded-full text-xs font-semibold`}>
                                            {category.totalServices} services
                                        </div>
                                    </div>
                                    
                                    <p className="text-[#6B5E4F] text-sm mb-4 line-clamp-2">
                                        {category.description}
                                    </p>
                                    
                                    {/* Stats */}
                                    <div className="flex flex-wrap gap-3 text-xs text-[#9B9082] mb-4">
                                        <div className="flex items-center gap-1">
                                            <FiUsers size={12} />
                                            <span>{category.totalFreelancers} artisans</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <FiShoppingBag size={12} />
                                            <span>{formatNumber(category.totalOrders)} commandes</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <FiStar className="fill-current" size={12} />
                                            <span>{category.avgRating}</span>
                                        </div>
                                    </div>
                                    
                                    {/* Subcategories */}
                                    {category.subcategories && (
                                        <div className="flex flex-wrap gap-1 mb-4">
                                            {category.subcategories.slice(0, 3).map((sub, idx) => (
                                                <span key={idx} className="px-2 py-0.5 bg-[#E8EDE6] rounded-full text-xs text-[#6B5E4F]">
                                                    {sub}
                                                </span>
                                            ))}
                                            {category.subcategories.length > 3 && (
                                                <span className="px-2 py-0.5 bg-[#E8EDE6] rounded-full text-xs text-[#6B5E4F]">
                                                    +{category.subcategories.length - 3}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                    
                                    {/* Top service if exists */}
                                    {category.topService && (
                                        <div className="pt-3 border-t border-[#E8E2D9]">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-[#E8EDE6] flex items-center justify-center text-xs">
                                                        🏆
                                                    </div>
                                                    <span className="text-xs text-[#6B5E4F]">Top service</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-xs">
                                                    <FiStar className="text-yellow-500 fill-current" size={10} />
                                                    <span className="text-[#1A1208] font-medium">{category.topService.rating || 'Nouveau'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    
                                    <div className="mt-4 flex items-center text-[#3D5A3E] font-medium text-sm group-hover:gap-2 transition-all gap-1">
                                        Explorer <FiArrowRight size={14} />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* No results message */}
                {searchTerm && filteredCategories.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-[#6B5E4F]">Aucune catégorie ne correspond à "{searchTerm}"</p>
                    </div>
                )}
            </div>

            <style>{`
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

export default Categories;