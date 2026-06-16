import { useState } from 'react';
import { FiFilter, FiChevronDown, FiX } from 'react-icons/fi';

const Filters = ({ filters, onFilterChange, onReset, categories }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleChange = (key, value) => {
        onFilterChange({ ...filters, [key]: value });
    };

    const activeFiltersCount = Object.values(filters).filter(v => v && v !== '' && v !== 'all').length;

    return (
        <div className="relative">
            {/* Filter Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="btn btn-secondary flex items-center gap-2"
            >
                <FiFilter size={16} />
                Filtres
                {activeFiltersCount > 0 && (
                    <span className="bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {activeFiltersCount}
                    </span>
                )}
                <FiChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Filter Panel */}
            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-bg dark:bg-bg-dark border border-border dark:border-border-dark rounded-card shadow-lg z-40 p-4 animate-fade-in">
                    <div className="space-y-4">
                        {/* Category */}
                        {categories && (
                            <div>
                                <label className="input-label">Catégorie</label>
                                <select
                                    value={filters.category || ''}
                                    onChange={(e) => handleChange('category', e.target.value)}
                                    className="input-field mt-1"
                                >
                                    <option value="">Toutes</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Price Range */}
                        <div>
                            <label className="input-label">Prix (DH)</label>
                            <div className="flex gap-2 mt-1">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={filters.minPrice || ''}
                                    onChange={(e) => handleChange('minPrice', e.target.value)}
                                    className="input-field"
                                />
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={filters.maxPrice || ''}
                                    onChange={(e) => handleChange('maxPrice', e.target.value)}
                                    className="input-field"
                                />
                            </div>
                        </div>

                        {/* Rating */}
                        <div>
                            <label className="input-label">Note minimale</label>
                            <select
                                value={filters.rating || ''}
                                onChange={(e) => handleChange('rating', e.target.value)}
                                className="input-field mt-1"
                            >
                                <option value="">Toutes</option>
                                <option value="4">4 étoiles +</option>
                                <option value="3">3 étoiles +</option>
                                <option value="2">2 étoiles +</option>
                                <option value="1">1 étoile +</option>
                            </select>
                        </div>

                        {/* Delivery Days */}
                        <div>
                            <label className="input-label">Délai de livraison</label>
                            <select
                                value={filters.deliveryDays || ''}
                                onChange={(e) => handleChange('deliveryDays', e.target.value)}
                                className="input-field mt-1"
                            >
                                <option value="">Tous</option>
                                <option value="3">Moins de 3 jours</option>
                                <option value="7">Moins de 7 jours</option>
                                <option value="14">Moins de 14 jours</option>
                                <option value="30">Moins de 30 jours</option>
                            </select>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-2 border-t border-border dark:border-border-dark">
                            <button
                                onClick={() => onReset()}
                                className="btn btn-ghost text-sm flex-1"
                            >
                                Réinitialiser
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="btn btn-primary text-sm flex-1"
                            >
                                Appliquer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Filters;