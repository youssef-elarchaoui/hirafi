import { useTheme } from '../../context/ThemeContext';
import { FiSun, FiMoon } from 'react-icons/fi';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-btn hover:bg-primary-light transition-colors"
            aria-label="Changer de thème"
        >
            {theme === 'dark' ? (
                <FiSun className="text-accent" size={20} />
            ) : (
                <FiMoon className="text-text-secondary" size={20} />
            )}
        </button>
    );
};

export default ThemeToggle;