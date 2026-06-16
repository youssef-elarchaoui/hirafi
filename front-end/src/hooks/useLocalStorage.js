import { useState, useEffect, useCallback } from 'react';

/**
 * Hook personnalisé pour gérer le localStorage
 * 
 * @param {string} key - Clé dans localStorage
 * @param {any} initialValue - Valeur initiale
 * @returns {Array} - [storedValue, setValue, removeValue]
 */
const useLocalStorage = (key, initialValue) => {
    // État pour stocker la valeur
    const [storedValue, setStoredValue] = useState(() => {
        if (typeof window === 'undefined') {
            return initialValue;
        }
        
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(`Erreur lecture localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    // Fonction pour mettre à jour la valeur
    const setValue = useCallback((value) => {
        try {
            // Permettre à value d'être une fonction (comme useState)
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            
            setStoredValue(valueToStore);
            
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (error) {
            console.error(`Erreur écriture localStorage key "${key}":`, error);
        }
    }, [key, storedValue]);

    // Fonction pour supprimer la valeur
    const removeValue = useCallback(() => {
        try {
            setStoredValue(initialValue);
            
            if (typeof window !== 'undefined') {
                window.localStorage.removeItem(key);
            }
        } catch (error) {
            console.error(`Erreur suppression localStorage key "${key}":`, error);
        }
    }, [key, initialValue]);

    // Synchroniser avec les changements d'autres onglets
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === key && e.newValue !== null) {
                try {
                    setStoredValue(JSON.parse(e.newValue));
                } catch {
                    setStoredValue(e.newValue);
                }
            }
        };
        
        window.addEventListener('storage', handleStorageChange);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [key]);

    return [storedValue, setValue, removeValue];
};

/**
 * Hook pour sauvegarder les préférences utilisateur
 */
export const useUserPreferences = () => {
    const [theme, setTheme, removeTheme] = useLocalStorage('theme', 'light');
    const [language, setLanguage, removeLanguage] = useLocalStorage('language', 'fr');
    const [sidebarCollapsed, setSidebarCollapsed, removeSidebarCollapsed] = useLocalStorage('sidebarCollapsed', false);
    
    return {
        theme,
        setTheme,
        removeTheme,
        language,
        setLanguage,
        removeLanguage,
        sidebarCollapsed,
        setSidebarCollapsed,
        removeSidebarCollapsed
    };
};

/**
 * Hook pour sauvegarder l'état du formulaire (auto-save)
 * @param {string} formKey - Clé unique pour le formulaire
 * @param {Object} initialData - Données initiales
 */
export const useFormDraft = (formKey, initialData = {}) => {
    const [draft, setDraft, clearDraft] = useLocalStorage(`draft_${formKey}`, initialData);
    
    const saveDraft = useCallback((data) => {
        setDraft(data);
    }, [setDraft]);
    
    const resetDraft = useCallback(() => {
        clearDraft();
        setDraft(initialData);
    }, [clearDraft, initialData, setDraft]);
    
    return {
        draft,
        saveDraft,
        resetDraft,
        hasDraft: Object.keys(draft).length > 0 && JSON.stringify(draft) !== JSON.stringify(initialData)
    };
};

/**
 * Hook pour sauvegarder l'historique de recherche
 * @param {string} searchKey - Clé unique pour la recherche
 * @param {number} maxItems - Nombre max d'éléments à garder
 */
export const useSearchHistory = (searchKey, maxItems = 10) => {
    const [history, setHistory, clearHistory] = useLocalStorage(`search_${searchKey}`, []);
    
    const addToHistory = useCallback((term) => {
        if (!term || term.trim() === '') return;
        
        setHistory(prev => {
            const newHistory = [term, ...prev.filter(t => t !== term)];
            return newHistory.slice(0, maxItems);
        });
    }, [setHistory, maxItems]);
    
    const removeFromHistory = useCallback((term) => {
        setHistory(prev => prev.filter(t => t !== term));
    }, [setHistory]);
    
    return {
        history,
        addToHistory,
        removeFromHistory,
        clearHistory
    };
};

export default useLocalStorage;