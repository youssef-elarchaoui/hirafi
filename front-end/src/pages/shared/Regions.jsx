// src/pages/shared/Regions.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiSearch, FiUsers, FiBriefcase, FiTrendingUp, FiStar } from 'react-icons/fi';

const Regions = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRegion, setSelectedRegion] = useState(null);

    const regions = [
        {
            id: 'casablanca',
            name: 'Casablanca',
            description: 'Capitale économique du Maroc, Casablanca est le centre névralgique des affaires et de l\'innovation.',
            cities: ['Casablanca', 'Mohammedia', 'El Jadida'],
            icon: '🌆',
            color: 'from-blue-500 to-cyan-500',
            bg: 'bg-blue-50',
            stats: {
                artisans: 120,
                services: 350,
                orders: 890
            }
        },
        {
            id: 'rabat',
            name: 'Rabat',
            description: 'Capitale administrative du Maroc, Rabat allie modernité et tradition artisanale.',
            cities: ['Rabat', 'Salé', 'Témara'],
            icon: '🏛️',
            color: 'from-purple-500 to-pink-500',
            bg: 'bg-purple-50',
            stats: {
                artisans: 85,
                services: 220,
                orders: 560
            }
        },
        {
            id: 'marrakech',
            name: 'Marrakech',
            description: 'La ville rouge, cœur de l\'artisanat marocain, célèbre pour ses souks et son savoir-faire ancestral.',
            cities: ['Marrakech', 'Essaouira', 'Safi'],
            icon: '🏮',
            color: 'from-red-500 to-orange-500',
            bg: 'bg-red-50',
            stats: {
                artisans: 150,
                services: 420,
                orders: 1100
            }
        },
        {
            id: 'fes',
            name: 'Fès',
            description: 'Capitale spirituelle et culturelle, Fès est le berceau de l\'artisanat marocain traditionnel.',
            cities: ['Fès', 'Meknès', 'Sefrou'],
            icon: '🕌',
            color: 'from-emerald-500 to-teal-500',
            bg: 'bg-emerald-50',
            stats: {
                artisans: 95,
                services: 280,
                orders: 720
            }
        },
        {
            id: 'tanger',
            name: 'Tanger',
            description: 'Porte du Maroc, Tanger est une ville cosmopolite riche en créativité et en opportunités.',
            cities: ['Tanger', 'Tétouan', 'Chefchaouen'],
            icon: '⛵',
            color: 'from-indigo-500 to-purple-500',
            bg: 'bg-indigo-50',
            stats: {
                artisans: 65,
                services: 180,
                orders: 430
            }
        },
        {
            id: 'agadir',
            name: 'Agadir',
            description: 'Station balnéaire par excellence, Agadir offre un cadre idyllique pour les projets créatifs.',
            cities: ['Agadir', 'Inezgane', 'Tiznit'],
            icon: '🌊',
            color: 'from-teal-500 to-emerald-500',
            bg: 'bg-teal-50',
            stats: {
                artisans: 70,
                services: 190,
                orders: 480
            }
        }
    ];

    const filteredRegions = regions.filter(region =>
        region.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        region.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        region.cities.some(city => city.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FAF8F5] via-white to-[#FAF8F5]">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#3D5A3E] to-[#2D452E] text-white py-12">
                <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3 mb-3">
                        <FiMapPin className="text-4xl" />
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold">
                            Régions du Maroc
                        </h1>
                    </div>
                    <p className="text-white/80 text-lg max-w-2xl">
                        Découvrez les artisans par région
                    </p>
                </div>
            </div>

            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search */}
                <div className="relative max-w-md mb-8">
                    <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#9B9082]" size={20} />
                    <input
                        type="text"
                        placeholder="Rechercher une région ou une ville..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-[#E8E2D9] rounded-xl focus:outline-none focus:border-[#3D5A3E] focus:ring-2 focus:ring-[#3D5A3E]/10 transition-all"
                    />
                </div>

                {/* Regions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRegions.map((region) => (
                        <div
                            key={region.id}
                            className="bg-white rounded-2xl border border-[#E8E2D9] overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1"
                        >
                            <div className={`h-24 bg-gradient-to-r ${region.color} flex items-center justify-between px-6`}>
                                <span className="text-4xl">{region.icon}</span>
                                <span className="text-white font-bold text-lg">{region.name}</span>
                            </div>
                            <div className="p-5">
                                <p className="text-[#6B5E4F] text-sm leading-relaxed mb-4">
                                    {region.description}
                                </p>
                                <div className="flex flex-wrap gap-1.5 mb-4">
                                    {region.cities.map((city, idx) => (
                                        <span key={idx} className="px-2 py-0.5 bg-[#E8EDE6] text-[#3D5A3E] rounded-full text-xs">
                                            {city}
                                        </span>
                                    ))}
                                </div>
                                <div className="grid grid-cols-3 gap-2 text-center pt-3 border-t border-[#E8E2D9]">
                                    <div>
                                        <div className="text-sm font-bold text-[#3D5A3E]">{region.stats.artisans}</div>
                                        <div className="text-xs text-[#6B5E4F]">Artisans</div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-[#3D5A3E]">{region.stats.services}</div>
                                        <div className="text-xs text-[#6B5E4F]">Services</div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-[#3D5A3E]">{region.stats.orders}</div>
                                        <div className="text-xs text-[#6B5E4F]">Commandes</div>
                                    </div>
                                </div>
                                <Link
                                    to={`/freelancers?region=${region.id}`}
                                    className="mt-4 w-full inline-block text-center text-sm bg-[#E8EDE6] text-[#3D5A3E] hover:bg-[#3D5A3E] hover:text-white py-2 rounded-xl font-medium transition-all"
                                >
                                    Explorer les artisans
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredRegions.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-heading font-semibold text-[#1A1208] mb-2">
                            Aucune région trouvée
                        </h3>
                        <p className="text-[#6B5E4F]">
                            Essayez une autre recherche
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Regions;