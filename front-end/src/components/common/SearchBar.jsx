import { useState } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

const SearchBar = ({ onSearch, placeholder = 'Rechercher...', initialValue = '' }) => {
    const [value, setValue] = useState(initialValue);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(value);
    };

    const handleClear = () => {
        setValue('');
        onSearch('');
    };

    return (
        <form onSubmit={handleSubmit} className="relative">
            <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={placeholder}
                className="input-field pl-10 pr-10"
            />
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
            {value && (
                <button
                    type="button"
                    onClick={handleClear}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text"
                >
                    <FiX size={18} />
                </button>
            )}
        </form>
    );
};

export default SearchBar;