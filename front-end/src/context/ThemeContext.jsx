import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        // Récupérer le thème sauvegardé dans localStorage
        const savedTheme = localStorage.getItem('theme');
        return savedTheme || 'light';
    });

    const [isDark, setIsDark] = useState(theme === 'dark');

    useEffect(() => {
        // Sauvegarder le thème dans localStorage
        localStorage.setItem('theme', theme);
        setIsDark(theme === 'dark');

        // Appliquer le thème au document
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const setLightMode = () => setTheme('light');
    const setDarkMode = () => setTheme('dark');

    const value = {
        theme,
        isDark,
        toggleTheme,
        setLightMode,
        setDarkMode
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};