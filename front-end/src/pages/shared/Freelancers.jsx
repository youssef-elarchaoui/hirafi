// src/pages/shared/Freelancers.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userApi } from '../../api/userApi';
import { serviceApi } from '../../api/serviceApi';
import toast from 'react-hot-toast';
import { 
  FiSearch, FiStar, FiMapPin, FiBriefcase, FiClock,
  FiAward, FiTrendingUp, FiUsers, FiDollarSign,
  FiFilter, FiGrid, FiList, FiChevronDown,
  FiEye, FiMessageCircle, FiCheckCircle
} from 'react-icons/fi';

const Freelancers = () => {
    const [freelancers, setFreelancers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        city: '',
        minRating: '',
        minHourlyRate: '',
        maxHourlyRate: '',
        skills: ''
    });
    const [viewMode, setViewMode] = useState('grid');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedFreelancer, setSelectedFreelancer] = useState(null);
    const [services, setServices] = useState({});

    useEffect(() => {
        fetchFreelancers();
    }, []);

    const fetchFreelancers = async () => {
        setLoading(true);
        try {
            const response = await userApi.getFreelancers();
            console.log('📋 Freelancers reçus:', response.data);
            
            let freelancersList = response.data.freelancers || response.data || [];
            
            // Filtrer par recherche
            if (searchTerm) {
                freelancersList = freelancersList.filter(f => 
                    f.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    f.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    f.skills?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
                );
            }
            
            // Filtrer par ville
            if (filters.city) {
                freelancersList = freelancersList.filter(f => 
                    f.city?.toLowerCase().includes(filters.city.toLowerCase())
                );
            }
            
            // Filtrer par note
            if (filters.minRating) {
                freelancersList = freelancersList.filter(f => 
                    (f.rating || 0) >= parseFloat(filters.minRating)
                );
            }
            
            // Filtrer par tarif
            if (filters.minHourlyRate) {
                freelancersList = freelancersList.filter(f => 
                    (f.hourlyRate || 0) >= parseFloat(filters.minHourlyRate)
                );
            }
            if (filters.maxHourlyRate) {
                freelancersList = freelancersList.filter(f => 
                    (f.hourlyRate || 0) <= parseFloat(filters.maxHourlyRate)
                );
            }
            
            // Filtrer par compétences
            if (filters.skills) {
                const skillFilter = filters.skills.toLowerCase().split(',').map(s => s.trim());
                freelancersList = freelancersList.filter(f => 
                    f.skills?.some(s => skillFilter.some(sf => s.toLowerCase().includes(sf)))
                );
            }
            
            setFreelancers(freelancersList);
            
            // Charger les services pour chaque freelancer
            fetchServicesForFreelancers(freelancersList);
            
        } catch (error) {
            console.error('Erreur:', error);
            toast.error('Impossible de charger les freelancers');
        } finally {
            setLoading(false);
        }
    };

    const fetchServicesForFreelancers = async (freelancersList) => {
        const servicesMap = {};
        for (const freelancer of freelancersList) {
            try {
                const response = await serviceApi.getFreelancerServices(freelancer._id);
                servicesMap[freelancer._id] = response.data.services || [];
            } catch (error) {
                servicesMap[freelancer._id] = [];
            }
        }
        setServices(servicesMap);
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setTimeout(fetchFreelancers, 300);
    };

    const resetFilters = () => {
        setFilters({
            city: '',
            minRating: '',
            minHourlyRate: '',
            maxHourlyRate: '',
            skills: ''
        });
        setSearchTerm('');
        setTimeout(fetchFreelancers, 100);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('fr-MA').format(price || 0);
    };

    const getTopSkills = (skills, limit = 3) => {
        return skills?.slice(0, limit) || [];
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
        <div className="min-h-screen bg-gradient-to-br from-[#FAF8F5] via-white to-[#FAF8F5]">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#3D5A3E] to-[#2D452E] text-white py-12">
                <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold mb-3">
                        Nos artisans
                    </h1>
                    <p className="text-white/80 text-lg max-w-2xl">
                        Découvrez les meilleurs talents marocains
                    </p>
                </div>
            </div>

            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                
                {/* Search and Filters */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#9B9082]" size={20} />
                            <input
                                type="text"
                                placeholder="Rechercher un artisan, une compétence..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && fetchFreelancers()}
                                className="w-full pl-12 pr-4 py-3 bg-white border border-[#E8E2D9] rounded-xl focus:outline-none focus:border-[#3D5A3E] focus:ring-2 focus:ring-[#3D5A3E]/10 transition-all"
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center gap-2 px-5 py-3 bg-white border border-[#E8E2D9] rounded-xl hover:border-[#3D5A3E] transition-all"
                            >
                                <FiFilter size={18} />
                                <span className="hidden sm:inline">Filtres</span>
                                {Object.values(filters).some(v => v) && (
                                    <span className="w-2 h-2 bg-[#3D5A3E] rounded-full"></span>
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
                        <div className="mt-4 bg-white rounded-xl border border-[#E8E2D9] p-5 animate-fade-in">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-heading font-semibold text-[#1A1208]">Filtres avancés</h3>
                                <button 
                                    onClick={resetFilters}
                                    className="text-sm text-[#3D5A3E] hover:underline"
                                >
                                    Réinitialiser
                                </button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#6B5E4F] mb-2">Ville</label>
                                    <input
                                        type="text"
                                        placeholder="Casablanca, Rabat..."
                                        value={filters.city}
                                        onChange={(e) => handleFilterChange('city', e.target.value)}
                                        className="w-full px-4 py-2 bg-[#FAF8F5] border border-[#E8E2D9] rounded-lg focus:outline-none focus:border-[#3D5A3E]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#6B5E4F] mb-2">Note minimum</label>
                                    <select
                                        value={filters.minRating}
                                        onChange={(e) => handleFilterChange('minRating', e.target.value)}
                                        className="w-full px-4 py-2 bg-[#FAF8F5] border border-[#E8E2D9] rounded-lg focus:outline-none focus:border-[#3D5A3E]"
                                    >
                                        <option value="">Toutes les notes</option>
                                        <option value="4.5">4.5+ étoiles</option>
                                        <option value="4">4+ étoiles</option>
                                        <option value="3.5">3.5+ étoiles</option>
                                        <option value="3">3+ étoiles</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#6B5E4F] mb-2">Tarif horaire (DH)</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            placeholder="Min"
                                            value={filters.minHourlyRate}
                                            onChange={(e) => handleFilterChange('minHourlyRate', e.target.value)}
                                            className="w-1/2 px-4 py-2 bg-[#FAF8F5] border border-[#E8E2D9] rounded-lg focus:outline-none focus:border-[#3D5A3E]"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Max"
                                            value={filters.maxHourlyRate}
                                            onChange={(e) => handleFilterChange('maxHourlyRate', e.target.value)}
                                            className="w-1/2 px-4 py-2 bg-[#FAF8F5] border border-[#E8E2D9] rounded-lg focus:outline-none focus:border-[#3D5A3E]"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Results count */}
                    <div className="flex justify-between items-center mt-4">
                        <p className="text-sm text-[#6B5E4F]">
                            {freelancers.length} artisan{freelancers.length > 1 ? 's' : ''} trouvé{freelancers.length > 1 ? 's' : ''}
                        </p>
                    </div>
                </div>

                {/* Freelancers Grid/List */}
                {freelancers.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl border border-[#E8E2D9]">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-heading font-semibold text-[#1A1208] mb-2">
                            Aucun artisan trouvé
                        </h3>
                        <p className="text-[#6B5E4F]">
                            {searchTerm ? 'Aucun artisan ne correspond à votre recherche' : 'Aucun artisan disponible pour le moment'}
                        </p>
                        {(searchTerm || Object.values(filters).some(v => v)) && (
                            <button 
                                onClick={resetFilters}
                                className="mt-4 text-[#3D5A3E] font-semibold hover:underline"
                            >
                                Réinitialiser les filtres
                            </button>
                        )}
                    </div>
                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {freelancers.map((freelancer) => (
                            <Link
                                key={freelancer._id}
                                to={`/freelancers/${freelancer._id}`}
                                className="group bg-white rounded-2xl border border-[#E8E2D9] overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                            >
                                {/* Avatar et stats */}
                                <div className="p-6 text-center">
                                    <div className="relative inline-block">
                                        <img 
                                            src={freelancer.avatar || `https://ui-avatars.com/api/?background=3D5A3E&color=fff&bold=true&name=${freelancer.name || 'U'}`}
                                            alt={freelancer.name}
                                            className="w-24 h-24 rounded-full object-cover border-4 border-[#E8EDE6] group-hover:border-[#3D5A3E] transition-all"
                                        />
                                        {freelancer.isVerified && (
                                            <span className="absolute bottom-0 right-0 bg-[#3D5A3E] text-white rounded-full p-1">
                                                <FiCheckCircle size={14} />
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="mt-4 font-heading font-semibold text-[#1A1208] text-lg group-hover:text-[#3D5A3E] transition-colors">
                                        {freelancer.name}
                                    </h3>
                                    {freelancer.city && (
                                        <p className="text-sm text-[#6B5E4F] flex items-center justify-center gap-1">
                                            <FiMapPin size={14} />
                                            {freelancer.city}
                                        </p>
                                    )}
                                    <div className="flex items-center justify-center gap-4 mt-3">
                                        <div className="flex items-center gap-1 text-yellow-500">
                                            <FiStar className="fill-current" />
                                            <span className="font-semibold text-[#1A1208]">{freelancer.rating || 'Nouveau'}</span>
                                            <span className="text-xs text-[#6B5E4F]">({freelancer.ratingCount || 0})</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-[#3D5A3E]">
                                            <FiDollarSign size={14} />
                                            <span className="font-semibold">{formatPrice(freelancer.hourlyRate)}/h</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Compétences */}
                                {freelancer.skills && freelancer.skills.length > 0 && (
                                    <div className="px-6 pb-3 flex flex-wrap gap-1.5 justify-center">
                                        {freelancer.skills.slice(0, 4).map((skill, idx) => (
                                            <span key={idx} className="px-2 py-0.5 bg-[#E8EDE6] text-[#3D5A3E] rounded-full text-xs">
                                                {skill}
                                            </span>
                                        ))}
                                        {freelancer.skills.length > 4 && (
                                            <span className="px-2 py-0.5 text-xs text-[#6B5E4F]">
                                                +{freelancer.skills.length - 4}
                                            </span>
                                        )}
                                    </div>
                                )}

                                {/* Stats */}
                                <div className="px-6 pb-4 flex justify-around text-xs text-[#6B5E4F] border-t border-[#E8E2D9] pt-3">
                                    <span className="flex items-center gap-1">
                                        <FiBriefcase size={12} />
                                        {(services[freelancer._id] || []).length} services
                                    </span>

                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {freelancers.map((freelancer) => (
                            <Link
                                key={freelancer._id}
                                to={`/freelancers/${freelancer._id}`}
                                className="group bg-white rounded-2xl border border-[#E8E2D9] p-5 hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row gap-5 items-start sm:items-center"
                            >
                                <img 
                                    src={freelancer.avatar || `https://ui-avatars.com/api/?background=3D5A3E&color=fff&bold=true&name=${freelancer.name || 'U'}`}
                                    alt={freelancer.name}
                                    className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <h3 className="font-heading font-semibold text-[#1A1208] text-lg group-hover:text-[#3D5A3E] transition-colors">
                                            {freelancer.name}
                                        </h3>
                                        {freelancer.isVerified && (
                                            <FiCheckCircle className="text-[#3D5A3E]" size={16} />
                                        )}
                                        <div className="flex items-center gap-1 text-yellow-500">
                                            <FiStar className="fill-current" />
                                            <span className="font-semibold text-[#1A1208]">{freelancer.rating || 'Nouveau'}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-[#6B5E4F] mt-1">
                                        {freelancer.city && (
                                            <span className="flex items-center gap-1">
                                                <FiMapPin size={14} />
                                                {freelancer.city}
                                            </span>
                                        )}
                                        <span className="flex items-center gap-1">
                                            <FiDollarSign size={14} />
                                            {formatPrice(freelancer.hourlyRate)}/h
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <FiBriefcase size={14} />
                                            {(services[freelancer._id] || []).length} services
                                        </span>
                                    </div>
                                    {freelancer.bio && (
                                        <p className="text-sm text-[#6B5E4F] mt-2 line-clamp-2">{freelancer.bio}</p>
                                    )}
                                    {freelancer.skills && freelancer.skills.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mt-2">
                                            {freelancer.skills.slice(0, 5).map((skill, idx) => (
                                                <span key={idx} className="px-2 py-0.5 bg-[#E8EDE6] text-[#3D5A3E] rounded-full text-xs">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <span className="px-3 py-1 bg-[#E8EDE6] text-[#3D5A3E] rounded-full text-xs font-medium whitespace-nowrap">
                                        Voir profil
                                    </span>
                                </div>
                            </Link>
                        ))}
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

export default Freelancers;