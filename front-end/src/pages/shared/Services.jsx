// src/pages/shared/Services.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { serviceApi } from '../../api/serviceApi';
import { 
  FiSearch, FiFilter, FiStar, FiClock, FiEye, 
  FiShoppingBag, FiUser, FiX, FiChevronDown,
  FiTrendingUp, FiAward, FiGrid, FiList
} from 'react-icons/fi';

const Services = () => {
    const [services, setServices] = useState([]);
    const [allServices, setAllServices] = useState([]); // Pour garder tous les services
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const [filters, setFilters] = useState({
        category: '',
        minPrice: '',
        maxPrice: '',
        search: '',
        sortBy: 'rating'
    });

    // Configuration des catégories
    const categories = {
        'graphic-design': { name: 'Design Graphique', icon: '🎨', color: 'from-purple-500 to-pink-500', bg: 'bg-purple-50', text: 'text-purple-600' },
        'web-development': { name: 'Développement Web', icon: '💻', color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-50', text: 'text-blue-600' },
        'marketing': { name: 'Marketing Digital', icon: '📈', color: 'from-orange-500 to-red-500', bg: 'bg-orange-50', text: 'text-orange-600' },
        'writing': { name: 'Rédaction', icon: '✍️', color: 'from-green-500 to-emerald-500', bg: 'bg-green-50', text: 'text-green-600' },
        'video': { name: 'Vidéo & Animation', icon: '🎥', color: 'from-red-500 to-rose-500', bg: 'bg-red-50', text: 'text-red-600' },
        'consulting': { name: 'Consulting', icon: '💡', color: 'from-indigo-500 to-purple-500', bg: 'bg-indigo-50', text: 'text-indigo-600' }
    };

    const sortOptions = [
        { value: 'rating', label: 'Mieux notés', icon: <FiStar size={14} /> },
        { value: 'price_asc', label: 'Prix croissant', icon: <span>↑</span> },
        { value: 'price_desc', label: 'Prix décroissant', icon: <span>↓</span> },
        { value: 'newest', label: 'Plus récents', icon: <FiTrendingUp size={14} /> },
        { value: 'popular', label: 'Plus populaires', icon: <FiEye size={14} /> }
    ];

    // Charger tous les services au début
    useEffect(() => {
        fetchAllServices();
    }, []);

    // Appliquer les filtres quand ils changent
    useEffect(() => {
        applyFiltersAndSort();
    }, [filters, allServices]);

    const fetchAllServices = async () => {
        setLoading(true);
        try {
            const response = await serviceApi.getAllServices({ limit: 1000 });
            const fetchedServices = response.data.services || [];
            setAllServices(fetchedServices);
            setServices(fetchedServices);
        } catch (error) {
            console.error('Erreur chargement services:', error);
        } finally {
            setLoading(false);
        }
    };

    const applyFiltersAndSort = () => {
        let filtered = [...allServices];
        
        // Filtre par recherche
        if (filters.search.trim()) {
            const searchTerm = filters.search.toLowerCase().trim();
            filtered = filtered.filter(service => 
                service.title?.toLowerCase().includes(searchTerm) ||
                service.description?.toLowerCase().includes(searchTerm) ||
                service.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
            );
        }
        
        // Filtre par catégorie
        if (filters.category) {
            filtered = filtered.filter(service => service.category === filters.category);
        }
        
        // Filtre par prix minimum
        if (filters.minPrice) {
            const minPrice = parseFloat(filters.minPrice);
            filtered = filtered.filter(service => service.price >= minPrice);
        }
        
        // Filtre par prix maximum
        if (filters.maxPrice) {
            const maxPrice = parseFloat(filters.maxPrice);
            filtered = filtered.filter(service => service.price <= maxPrice);
        }
        
        // Tri
        filtered = sortServices(filtered, filters.sortBy);
        
        setServices(filtered);
    };

    const sortServices = (servicesList, sortBy) => {
        const sorted = [...servicesList];
        switch (sortBy) {
            case 'rating':
                return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            case 'price_asc':
                return sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
            case 'price_desc':
                return sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
            case 'newest':
                return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            case 'popular':
                return sorted.sort((a, b) => (b.views || 0) - (a.views || 0));
            default:
                return sorted;
        }
    };

    const resetFilters = () => {
        setFilters({
            category: '',
            minPrice: '',
            maxPrice: '',
            search: '',
            sortBy: 'rating'
        });
    };

    const getCategoryInfo = (categoryId) => {
        return categories[categoryId] || { name: categoryId || 'Service', icon: '✨', color: 'from-gray-500 to-gray-500', bg: 'bg-gray-50', text: 'text-gray-600' };
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('fr-MA').format(price);
    };

    // Compter les filtres actifs
    const activeFiltersCount = [
        filters.category,
        filters.minPrice,
        filters.maxPrice,
        filters.search
    ].filter(f => f && f !== '').length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FAF8F5] via-white to-[#FAF8F5]">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-[#3D5A3E] to-[#2D452E] text-white py-12">
                <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold mb-3">
                        Découvrez les talents marocains
                    </h1>
                    <p className="text-white/80 text-lg max-w-2xl">
                        Des services de qualité par des artisans passionnés
                    </p>
                </div>
            </div>

            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search and Filters Bar */}
                <div className="mb-8">
                    {/* Search Bar */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-4">
                        <div className="flex-1 relative">
                            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#9B9082]" size={20} />
                            <input
                                type="text"
                                placeholder="Rechercher un service, un artisan..."
                                className="w-full pl-12 pr-4 py-3 bg-white border border-[#E8E2D9] rounded-xl focus:outline-none focus:border-[#3D5A3E] focus:ring-2 focus:ring-[#3D5A3E]/10 transition-all"
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            />
                        </div>
                        
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center gap-2 px-5 py-3 bg-white border border-[#E8E2D9] rounded-xl hover:border-[#3D5A3E] transition-all relative"
                            >
                                <FiFilter size={18} />
                                <span className="hidden sm:inline">Filtres</span>
                                {activeFiltersCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#3D5A3E] text-white text-xs rounded-full flex items-center justify-center">
                                        {activeFiltersCount}
                                    </span>
                                )}
                            </button>
                            
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

                    {/* Filters Panel */}
                    {showFilters && (
                        <div className="bg-white rounded-xl border border-[#E8E2D9] p-5 mb-4 animate-fade-in">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-heading font-semibold text-[#1A1208]">Filtres avancés</h3>
                                <button 
                                    onClick={resetFilters} 
                                    className="text-sm text-[#3D5A3E] hover:underline flex items-center gap-1"
                                >
                                    <FiX size={14} /> Réinitialiser
                                </button>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {/* Catégories */}
                                <div>
                                    <label className="block text-sm font-semibold text-[#1A1208] mb-2">Catégorie</label>
                                    <select
                                        className="w-full px-4 py-2 bg-[#FAF8F5] border border-[#E8E2D9] rounded-lg focus:outline-none focus:border-[#3D5A3E]"
                                        value={filters.category}
                                        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                                    >
                                        <option value="">Toutes les catégories</option>
                                        {Object.entries(categories).map(([key, cat]) => (
                                            <option key={key} value={key}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Prix min */}
                                <div>
                                    <label className="block text-sm font-semibold text-[#1A1208] mb-2">Prix minimum (DH)</label>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        className="w-full px-4 py-2 bg-[#FAF8F5] border border-[#E8E2D9] rounded-lg focus:outline-none focus:border-[#3D5A3E]"
                                        value={filters.minPrice}
                                        onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                                    />
                                </div>

                                {/* Prix max */}
                                <div>
                                    <label className="block text-sm font-semibold text-[#1A1208] mb-2">Prix maximum (DH)</label>
                                    <input
                                        type="number"
                                        placeholder="Illimité"
                                        className="w-full px-4 py-2 bg-[#FAF8F5] border border-[#E8E2D9] rounded-lg focus:outline-none focus:border-[#3D5A3E]"
                                        value={filters.maxPrice}
                                        onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                                    />
                                </div>

                                {/* Tri */}
                                <div>
                                    <label className="block text-sm font-semibold text-[#1A1208] mb-2">Trier par</label>
                                    <div className="relative">
                                        <select
                                            className="w-full px-4 py-2 bg-[#FAF8F5] border border-[#E8E2D9] rounded-lg focus:outline-none focus:border-[#3D5A3E] appearance-none"
                                            value={filters.sortBy}
                                            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                                        >
                                            {sortOptions.map(opt => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                        <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#9B9082]" size={16} />
                                    </div>
                                </div>
                            </div>
                            
                            {/* Active filters display */}
                            {activeFiltersCount > 0 && (
                                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-[#E8E2D9]">
                                    {filters.category && (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#E8EDE6] text-[#3D5A3E] text-xs rounded-full">
                                            {categories[filters.category]?.name}
                                            <button onClick={() => setFilters({ ...filters, category: '' })} className="hover:text-red-500">
                                                <FiX size={12} />
                                            </button>
                                        </span>
                                    )}
                                    {filters.minPrice && (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#E8EDE6] text-[#3D5A3E] text-xs rounded-full">
                                            Min: {filters.minPrice} DH
                                            <button onClick={() => setFilters({ ...filters, minPrice: '' })} className="hover:text-red-500">
                                                <FiX size={12} />
                                            </button>
                                        </span>
                                    )}
                                    {filters.maxPrice && (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#E8EDE6] text-[#3D5A3E] text-xs rounded-full">
                                            Max: {filters.maxPrice} DH
                                            <button onClick={() => setFilters({ ...filters, maxPrice: '' })} className="hover:text-red-500">
                                                <FiX size={12} />
                                            </button>
                                        </span>
                                    )}
                                    {filters.search && (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#E8EDE6] text-[#3D5A3E] text-xs rounded-full">
                                            Recherche: {filters.search}
                                            <button onClick={() => setFilters({ ...filters, search: '' })} className="hover:text-red-500">
                                                <FiX size={12} />
                                            </button>
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Results count */}
                    <div className="flex justify-between items-center mt-4">
                        <p className="text-sm text-[#6B5E4F]">
                            {services.length} service{services.length > 1 ? 's' : ''} trouvé{services.length > 1 ? 's' : ''}
                            {allServices.length !== services.length && ` (sur ${allServices.length} total)`}
                        </p>
                        {filters.sortBy !== 'rating' && (
                            <div className="flex items-center gap-2 text-sm text-[#3D5A3E]">
                                <FiTrendingUp size={14} />
                                <span>Trié par {sortOptions.find(o => o.value === filters.sortBy)?.label}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Services Grid/List */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="relative w-12 h-12">
                            <div className="absolute inset-0 border-3 border-[#E8EDE6] rounded-full"></div>
                            <div className="absolute inset-0 border-3 border-[#3D5A3E] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    </div>
                ) : services.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-[#E8E2D9]">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-heading font-semibold text-[#1A1208] mb-2">Aucun service trouvé</h3>
                        <p className="text-[#6B5E4F]">Essayez de modifier vos filtres ou votre recherche</p>
                        <button onClick={resetFilters} className="mt-4 text-[#3D5A3E] font-semibold hover:underline">
                            Réinitialiser les filtres
                        </button>
                    </div>
                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map((service) => {
                            const categoryInfo = getCategoryInfo(service.category);
                            return (
                                <Link
                                    key={service._id}
                                    to={`/services/${service._id}`}
                                    className="group bg-white rounded-2xl overflow-hidden border border-[#E8E2D9] hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                                >
                                    <div className={`h-40 bg-gradient-to-r ${categoryInfo.color} flex items-center justify-center relative overflow-hidden`}>
                                        <span className="text-7xl group-hover:scale-110 transition-transform duration-500">
                                            {categoryInfo.icon}
                                        </span>
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all"></div>
                                        
                                        {service.rating >= 4.8 && (
                                            <div className="absolute top-4 right-4 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                                <FiStar className="fill-current" size={10} /> Top
                                            </div>
                                        )}
                                        
                                        {new Date(service.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
                                            <div className="absolute top-4 left-4 bg-[#C47D4E] text-white text-xs font-bold px-2 py-1 rounded-full">
                                                Nouveau
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="p-5">
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className="font-heading font-semibold text-[#1A1208] line-clamp-1 flex-1">
                                                {service.title}
                                            </h3>
                                            <span className={`text-xs px-2 py-1 rounded-full ${categoryInfo.bg} ${categoryInfo.text} ml-2 whitespace-nowrap`}>
                                                {categoryInfo.name}
                                            </span>
                                        </div>
                                        
                                        <p className="text-[#6B5E4F] text-sm line-clamp-2 mb-3">
                                            {service.description}
                                        </p>
                                        
                                        <div className="flex items-center gap-4 text-xs text-[#9B9082] mb-3">
                                            <div className="flex items-center gap-1">
                                                <FiStar className="text-yellow-500 fill-current" size={12} />
                                                <span>{service.rating || 'Nouveau'}</span>
                                                {service.ratingCount > 0 && <span>({service.ratingCount})</span>}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <FiEye size={12} />
                                                <span>{service.views || 0} vues</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <FiShoppingBag size={12} />
                                                <span>{service.orders || 0} commandes</span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center justify-between pt-3 border-t border-[#E8E2D9]">
                                            <div>
                                                <span className="text-2xl font-bold text-[#3D5A3E]">{formatPrice(service.price)} DH</span>
                                                <span className="text-xs text-[#9B9082] ml-1">/ projet</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-[#6B5E4F]">
                                                <FiClock size={12} />
                                                <span>{service.deliveryDays} jours</span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-2 mt-3 pt-2">
                                            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#3D5A3E] to-[#2D452E] flex items-center justify-center text-white text-xs font-bold">
                                                {service.freelancerId?.name?.charAt(0) || 'A'}
                                            </div>
                                            <span className="text-xs text-[#6B5E4F]">
                                                {service.freelancerId?.name || 'Artisan'}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {services.map((service) => {
                            const categoryInfo = getCategoryInfo(service.category);
                            return (
                                <Link
                                    key={service._id}
                                    to={`/services/${service._id}`}
                                    className="group bg-white rounded-2xl border border-[#E8E2D9] p-5 hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row gap-5"
                                >
                                    <div className={`w-24 h-24 rounded-xl bg-gradient-to-r ${categoryInfo.color} flex items-center justify-center text-3xl flex-shrink-0`}>
                                        {categoryInfo.icon}
                                    </div>
                                    
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                                            <div>
                                                <h3 className="font-heading font-semibold text-[#1A1208] text-lg">
                                                    {service.title}
                                                </h3>
                                                <span className={`text-xs px-2 py-1 rounded-full ${categoryInfo.bg} ${categoryInfo.text} inline-block mt-1`}>
                                                    {categoryInfo.name}
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-[#3D5A3E]">{formatPrice(service.price)} DH</div>
                                                <div className="flex items-center gap-1 text-xs text-[#6B5E4F]">
                                                    <FiClock size={12} /> {service.deliveryDays} jours
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <p className="text-[#6B5E4F] text-sm line-clamp-2 mb-3">
                                            {service.description}
                                        </p>
                                        
                                        <div className="flex flex-wrap items-center justify-between gap-3">
                                            <div className="flex items-center gap-4 text-xs text-[#9B9082]">
                                                <div className="flex items-center gap-1">
                                                    <FiStar className="text-yellow-500 fill-current" size={12} />
                                                    <span>{service.rating || 'Nouveau'}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <FiEye size={12} />
                                                    <span>{service.views || 0} vues</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <FiShoppingBag size={12} />
                                                    <span>{service.orders || 0} commandes</span>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#3D5A3E] to-[#2D452E] flex items-center justify-center text-white text-xs font-bold">
                                                    {service.freelancerId?.name?.charAt(0) || 'A'}
                                                </div>
                                                <span className="text-xs text-[#6B5E4F]">
                                                    {service.freelancerId?.name || 'Artisan'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fadeIn 0.3s ease-out;
                }
                .line-clamp-1 {
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
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

export default Services;