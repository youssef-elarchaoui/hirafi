// src/pages/client/ClientSettings.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { userApi } from '../../api/userApi';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  FiLock, FiBell, FiGlobe, FiMoon, FiSun, 
  FiShield, FiSave, FiEye, FiEyeOff, FiLogOut,
  FiDollarSign, FiUser, FiMail,
  FiSmartphone, FiMapPin, FiCheckCircle
} from 'react-icons/fi'; // ✅ Supprimé FiLanguage

const ClientSettings = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('security');
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);
    
    // Sécurité
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState({ score: 0, message: '', color: '' });
    
    // Notifications
    const [notifications, setNotifications] = useState(() => {
        const saved = localStorage.getItem('clientNotifications');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                return {
                    orderUpdates: true,
                    messages: true,
                    promotions: false,
                    newsletter: true
                };
            }
        }
        return {
            orderUpdates: true,
            messages: true,
            promotions: false,
            newsletter: true
        };
    });
    
    // Préférences
    const [preferences, setPreferences] = useState(() => {
        const saved = localStorage.getItem('clientPreferences');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                return { language: 'fr', currency: 'MAD', theme: 'light' };
            }
        }
        return { language: 'fr', currency: 'MAD', theme: 'light' };
    });

    // Sauvegarder les préférences
    useEffect(() => {
        localStorage.setItem('clientPreferences', JSON.stringify(preferences));
        localStorage.setItem('clientNotifications', JSON.stringify(notifications));
        
        // Appliquer le thème
        if (preferences.theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [preferences, notifications]);

    const checkPasswordStrength = (password) => {
        let score = 0;
        let message = '';
        let color = '';

        if (password.length >= 8) score++;
        if (password.match(/[a-z]/)) score++;
        if (password.match(/[A-Z]/)) score++;
        if (password.match(/[0-9]/)) score++;
        if (password.match(/[^a-zA-Z0-9]/)) score++;

        if (score <= 2) { message = 'Faible'; color = 'text-red-500'; }
        else if (score <= 4) { message = 'Moyen'; color = 'text-yellow-500'; }
        else { message = 'Fort'; color = 'text-green-500'; }

        setPasswordStrength({ score, message, color });
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setNewPassword(value);
        if (value) checkPasswordStrength(value);
        else setPasswordStrength({ score: 0, message: '', color: '' });
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        
        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error('Veuillez remplir tous les champs');
            return;
        }

        if (newPassword.length < 6) {
            toast.error('Le mot de passe doit contenir au moins 6 caractères');
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error('Les mots de passe ne correspondent pas');
            return;
        }

        setLoading(true);
        const changeToast = toast.loading('Changement du mot de passe...');

        try {
            const response = await userApi.changePassword({
                currentPassword,
                newPassword
            });
            if (response.data.success) {
                toast.success('✓ Mot de passe changé avec succès !', {
                    id: changeToast,
                    duration: 3000,
                    icon: '🔒',
                });
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setPasswordStrength({ score: 0, message: '', color: '' });
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Erreur lors du changement', {
                id: changeToast,
                duration: 4000,
                icon: '❌',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleNotificationChange = (key) => {
        setNotifications(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
        toast.success('Préférence mise à jour');
    };

    const handlePreferenceChange = (key, value) => {
        setPreferences(prev => ({
            ...prev,
            [key]: value
        }));
        toast.success('Préférence mise à jour');
    };

    const handleLogout = () => {
        if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
            logout();
            window.location.href = '/login';
        }
    };

    const tabs = [
        { id: 'security', label: 'Sécurité', icon: FiLock },
        { id: 'notifications', label: 'Notifications', icon: FiBell },
        { id: 'preferences', label: 'Préférences', icon: FiGlobe }
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-heading font-bold text-[#1A1208]">
                    Paramètres
                </h1>
                <p className="text-[#6B5E4F] text-sm mt-1">
                    Gérez vos préférences et paramètres de sécurité
                </p>
            </div>

            {/* Success message */}
            {saved && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg animate-fade-in">
                    <div className="flex items-center gap-2">
                        <FiCheckCircle className="text-green-500" size={20} />
                        <p className="text-green-700">Paramètres enregistrés avec succès</p>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-2xl border border-[#E8E2D9] overflow-hidden">
                {/* Tabs */}
                <div className="flex border-b border-[#E8E2D9] overflow-x-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all whitespace-nowrap ${
                                activeTab === tab.id
                                    ? 'border-b-2 border-[#3D5A3E] text-[#3D5A3E]'
                                    : 'text-[#6B5E4F] hover:text-[#3D5A3E]'
                            }`}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="p-6">
                    
                    {/* ========== ONGLET SÉCURITÉ ========== */}
                    {activeTab === 'security' && (
                        <form onSubmit={handleChangePassword} className="space-y-6">
                            <div>
                                <h3 className="text-lg font-heading font-semibold text-[#1A1208] mb-4 flex items-center gap-2">
                                    <FiShield className="text-[#3D5A3E]" />
                                    Sécurité du compte
                                </h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-[#6B5E4F] text-sm font-medium mb-2">
                                            <FiUser className="inline mr-2" />
                                            Nom
                                        </label>
                                        <input
                                            type="text"
                                            value={user?.name || ''}
                                            disabled
                                            className="w-full px-4 py-2 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl opacity-70 cursor-not-allowed"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[#6B5E4F] text-sm font-medium mb-2">
                                            <FiMail className="inline mr-2" />
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={user?.email || ''}
                                            disabled
                                            className="w-full px-4 py-2 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl opacity-70 cursor-not-allowed"
                                        />
                                    </div>
                                </div>

                                <div className="border-t border-[#E8E2D9] pt-4 mt-4">
                                    <p className="text-sm text-[#6B5E4F] mb-4">Changer le mot de passe</p>
                                    
                                    <div className="mb-4">
                                        <label className="block text-[#6B5E4F] text-sm font-medium mb-2">
                                            Mot de passe actuel *
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showCurrentPassword ? 'text' : 'password'}
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                className="w-full px-4 py-2 pr-12 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl focus:outline-none focus:border-[#3D5A3E] transition-all"
                                                placeholder="••••••••"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#9B9082] hover:text-[#3D5A3E]"
                                            >
                                                {showCurrentPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mb-2">
                                        <label className="block text-[#6B5E4F] text-sm font-medium mb-2">
                                            Nouveau mot de passe *
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showNewPassword ? 'text' : 'password'}
                                                value={newPassword}
                                                onChange={handlePasswordChange}
                                                className="w-full px-4 py-2 pr-12 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl focus:outline-none focus:border-[#3D5A3E] transition-all"
                                                placeholder="••••••••"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#9B9082] hover:text-[#3D5A3E]"
                                            >
                                                {showNewPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                            </button>
                                        </div>
                                        {passwordStrength.message && (
                                            <div className="mt-1 flex items-center gap-2">
                                                <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                    <div 
                                                        className={`h-full rounded-full transition-all`}
                                                        style={{ 
                                                            width: `${(passwordStrength.score / 5) * 100}%`,
                                                            backgroundColor: passwordStrength.color === 'text-red-500' ? '#EF4444' : 
                                                                           passwordStrength.color === 'text-yellow-500' ? '#F59E0B' : '#10B981'
                                                        }}
                                                    />
                                                </div>
                                                <span className={`text-xs font-medium ${passwordStrength.color}`}>
                                                    {passwordStrength.message}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-6">
                                        <label className="block text-[#6B5E4F] text-sm font-medium mb-2">
                                            Confirmer le mot de passe *
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="w-full px-4 py-2 pr-12 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl focus:outline-none focus:border-[#3D5A3E] transition-all"
                                                placeholder="••••••••"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#9B9082] hover:text-[#3D5A3E]"
                                            >
                                                {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                            </button>
                                        </div>
                                        {confirmPassword && newPassword && (
                                            <p className={`text-xs mt-1 ${newPassword === confirmPassword ? 'text-green-500' : 'text-red-500'}`}>
                                                {newPassword === confirmPassword ? '✓ Les mots de passe correspondent' : '✗ Les mots de passe ne correspondent pas'}
                                            </p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex items-center gap-2 px-6 py-2 bg-[#3D5A3E] hover:bg-[#2D452E] text-white rounded-xl font-semibold transition-all disabled:opacity-50"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Changement...
                                            </>
                                        ) : (
                                            <>
                                                <FiSave size={16} />
                                                Changer le mot de passe
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Session */}
                            <div className="pt-6 border-t border-[#E8E2D9]">
                                <h3 className="text-lg font-heading font-semibold text-[#1A1208] mb-4 flex items-center gap-2">
                                    <FiLogOut className="text-red-500" />
                                    Session
                                </h3>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 px-6 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl font-semibold transition-all"
                                >
                                    <FiLogOut size={16} />
                                    Se déconnecter
                                </button>
                            </div>
                        </form>
                    )}

                    {/* ========== ONGLET NOTIFICATIONS ========== */}
                    {activeTab === 'notifications' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-heading font-semibold text-[#1A1208] mb-4 flex items-center gap-2">
                                <FiBell className="text-[#3D5A3E]" />
                                Préférences de notification
                            </h3>
                            
                            <div className="space-y-4">
                                {[
                                    { key: 'orderUpdates', label: 'Mises à jour des commandes', desc: 'Recevoir les notifications sur le statut de vos commandes' },
                                    { key: 'messages', label: 'Messages', desc: 'Recevoir les notifications des nouveaux messages' },
                                    { key: 'promotions', label: 'Promotions et offres', desc: 'Recevoir les offres promotionnelles' },
                                    { key: 'newsletter', label: 'Newsletter', desc: 'Recevoir la newsletter hebdomadaire' }
                                ].map((item) => (
                                    <div key={item.key} className="flex items-center justify-between p-4 bg-[#FAF8F5] rounded-xl hover:bg-[#E8EDE6] transition-all">
                                        <div>
                                            <p className="font-medium text-[#1A1208]">{item.label}</p>
                                            <p className="text-sm text-[#6B5E4F]">{item.desc}</p>
                                        </div>
                                        <button
                                            onClick={() => handleNotificationChange(item.key)}
                                            className={`relative w-12 h-6 rounded-full transition-all ${
                                                notifications[item.key] ? 'bg-[#3D5A3E]' : 'bg-[#E8E2D9]'
                                            }`}
                                        >
                                            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all ${
                                                notifications[item.key] ? 'right-0.5' : 'left-0.5'
                                            }`} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ========== ONGLET PRÉFÉRENCES ========== */}
                    {activeTab === 'preferences' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-heading font-semibold text-[#1A1208] mb-4 flex items-center gap-2">
                                <FiGlobe className="text-[#3D5A3E]" />
                                Préférences générales
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Langue */}
                                <div>
                                    <label className="block text-[#6B5E4F] text-sm font-medium mb-2">
                                        🌐 Langue
                                    </label>
                                    <select
                                        value={preferences.language}
                                        onChange={(e) => handlePreferenceChange('language', e.target.value)}
                                        className="w-full px-4 py-2 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl focus:outline-none focus:border-[#3D5A3E] transition-all"
                                    >
                                        <option value="fr">Français</option>
                                        <option value="ar">العربية</option>
                                        <option value="en">English</option>
                                        <option value="es">Español</option>
                                    </select>
                                </div>

                                {/* Devise */}
                                <div>
                                    <label className="block text-[#6B5E4F] text-sm font-medium mb-2">
                                        <FiDollarSign className="inline mr-2" />
                                        Devise
                                    </label>
                                    <select
                                        value={preferences.currency}
                                        onChange={(e) => handlePreferenceChange('currency', e.target.value)}
                                        className="w-full px-4 py-2 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl focus:outline-none focus:border-[#3D5A3E] transition-all"
                                    >
                                        <option value="MAD">MAD - Dirham Marocain</option>
                                        <option value="EUR">EUR - Euro</option>
                                        <option value="USD">USD - Dollar US</option>
                                    </select>
                                </div>

                                {/* Thème */}
                                <div className="md:col-span-2">
                                    <label className="block text-[#6B5E4F] text-sm font-medium mb-2">
                                        Thème
                                    </label>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => handlePreferenceChange('theme', 'light')}
                                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all ${
                                                preferences.theme === 'light'
                                                    ? 'border-[#3D5A3E] bg-[#E8EDE6] text-[#3D5A3E]'
                                                    : 'border-[#E8E2D9] hover:border-[#3D5A3E]'
                                            }`}
                                        >
                                            <FiSun size={18} />
                                            <span>Clair</span>
                                        </button>
                                        <button
                                            onClick={() => handlePreferenceChange('theme', 'dark')}
                                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all ${
                                                preferences.theme === 'dark'
                                                    ? 'border-[#3D5A3E] bg-[#E8EDE6] text-[#3D5A3E]'
                                                    : 'border-[#E8E2D9] hover:border-[#3D5A3E]'
                                            }`}
                                        >
                                            <FiMoon size={18} />
                                            <span>Sombre</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fadeIn 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

export default ClientSettings;