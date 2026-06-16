// src/pages/shared/Register.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerAPI } from '../../api/authApi';
import { useAuth } from '../../hooks/useAuth';
import { 
  FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, 
  FiShield, FiCheckCircle, FiAlertCircle, FiUserPlus,
  FiBriefcase, FiUsers, FiStar, FiTool, FiShoppingBag,
  FiMapPin, FiPhone, FiAward, FiClock,
  FiGlobe
} from 'react-icons/fi';

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('client');
    const [phone, setPhone] = useState('');
    const [city, setCity] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    // Vérification de la force du mot de passe
    const [passwordStrength, setPasswordStrength] = useState({
        score: 0,
        message: '',
        color: ''
    });

    useEffect(() => {
        if (password) {
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
        } else {
            setPasswordStrength({ score: 0, message: '', color: '' });
        }
    }, [password]);

    // Vérification de la confirmation du mot de passe
    const passwordsMatch = password === confirmPassword && password !== '';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        
        // Validation du nom
        if (name.length < 3) {
            setError('Le nom doit contenir au moins 3 caractères');
            return;
        }

        // Validation de l'email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Veuillez entrer une adresse email valide');
            return;
        }

        // Vérifier que les mots de passe correspondent
        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }

        // Vérifier la longueur du mot de passe
        if (password.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères');
            return;
        }

        // Vérifier les conditions générales
        if (!agreeTerms) {
            setError('Vous devez accepter les conditions générales');
            return;
        }

        setLoading(true);

        try {
            // Préparer les données d'inscription
            const registerData = {
                name,
                email,
                password,
                role,
                phone: phone || '',
                city: city || ''
            };
            
            const data = await registerAPI(registerData);
            
            // Stocker le token et l'utilisateur
            login(data.token, data.user);
            setSuccess('Compte créé avec succès ! Redirection en cours...');
            
            // Redirection après 1.5 secondes
            setTimeout(() => {
                if (role === 'freelancer') {
                    navigate('/freelancer/dashboard');
                } else {
                    navigate('/client/dashboard');
                }
            }, 1500);
            
        } catch (err) {
            setError(err.response?.data?.message || 'Une erreur est survenue lors de la création du compte');
        } finally {
            setLoading(false);
        }
    };

    // Villes marocaines
    const moroccanCities = [
        'Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 
        'Agadir', 'Meknès', 'Oujda', 'Tétouan', 'El Jadida'
    ];

    // Statistiques de la plateforme
    const stats = [
        { icon: FiUsers, value: '500+', label: 'Artisans actifs' },
        { icon: FiBriefcase, value: '1.2k+', label: 'Services proposés' },
        { icon: FiStar, value: '4.9/5', label: 'Satisfaction client' }
    ];

    // Avantages selon le rôle
    const roleBenefits = {
        client: [
            { icon: FiUsers, text: 'Accès à tous les artisans qualifiés' },
            { icon: FiShield, text: 'Paiement sécurisé' },
            { icon: FiClock, text: 'Support client 24/7' },
            { icon: FiAward, text: 'Garantie satisfait ou remboursé' }
        ],
        freelancer: [
            { icon: FiTool, text: 'Gagnez de l\'argent avec vos talents' },
            { icon: FiAward, text: '0% de commission sur vos projets' },
            { icon: FiGlobe, text: 'Visibilité nationale' },
            { icon: FiShield, text: 'Paiements sécurisés et ponctuels' }
        ]
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FAF8F5] via-white to-[#FAF8F5] flex items-center justify-center p-4 sm:p-6 font-body relative overflow-hidden">
            
            {/* Background Decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#3D5A3E]/5 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#C47D4E]/5 rounded-full blur-3xl"></div>
            </div>

            <div className="w-full max-w-6xl relative z-10">
                <div className="grid lg:grid-cols-2 gap-0 lg:gap-8 xl:gap-12">
                    
                    {/* Left Panel - Branding & Benefits */}
                    <div className="hidden lg:block space-y-8 animate-fade-in-left">
                        {/* Logo */}
                        <div className="relative">
                            <div className="absolute -top-4 -left-4 w-20 h-20 bg-[#3D5A3E]/10 rounded-full blur-2xl"></div>
                            <div className="relative">
                                <h1 className="text-5xl font-display font-black text-[#3D5A3E] tracking-tight">
                                    Hirafi
                                </h1>
                                <div className="w-20 h-1 bg-[#C47D4E] mt-2 rounded-full"></div>
                            </div>
                            <p className="text-[#6B5E4F] text-lg mt-4 leading-relaxed">
                                Rejoignez la plus grande communauté d'artisans au Maroc
                            </p>
                        </div>
                        
                        {/* Role Benefits */}
                        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-[#E8E2D9] shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 rounded-full bg-[#3D5A3E]/10 flex items-center justify-center">
                                    {role === 'client' ? <FiShoppingBag className="text-[#3D5A3E]" size={16} /> : <FiTool className="text-[#3D5A3E]" size={16} />}
                                </div>
                                <h3 className="font-heading font-bold text-[#1A1208]">
                                    {role === 'client' ? '✨ Avantages Client' : '⚡ Avantages Artisan'}
                                </h3>
                            </div>
                            <ul className="space-y-3">
                                {roleBenefits[role].map((benefit, idx) => (
                                    <li key={idx} className="flex items-center gap-3 text-sm text-[#5C5244]">
                                        <benefit.icon className="text-[#3D5A3E]" size={16} />
                                        <span>{benefit.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Stats */}
                        <div className="pt-4 border-t border-[#E8E2D9]">
                            <p className="text-[#5C5244] text-sm mb-4 font-semibold">📊 Hirafi en chiffres</p>
                            <div className="grid grid-cols-3 gap-4">
                                {stats.map((stat, idx) => (
                                    <div key={idx} className="text-center group">
                                        <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-[#E8EDE6] flex items-center justify-center group-hover:bg-[#3D5A3E] transition-all">
                                            <stat.icon className="text-[#3D5A3E] group-hover:text-white" size={18} />
                                        </div>
                                        <div className="text-lg font-bold text-[#3D5A3E]">{stat.value}</div>
                                        <div className="text-xs text-[#9B9082]">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Trust message */}
                        <div className="flex items-center gap-2 text-xs text-[#9B9082]">
                            <FiShield size={14} />
                            <span>Plateforme sécurisée • Données protégées</span>
                        </div>
                    </div>

                    {/* Right Panel - Registration Form */}
                    <div className="bg-white rounded-2xl shadow-xl border border-[#E8E2D9] p-6 sm:p-8 w-full max-w-md mx-auto lg:mx-0 lg:ml-auto animate-fade-in-up">
                        
                        {/* Header */}
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#E8EDE6] mb-4">
                                <FiUserPlus className="text-[#3D5A3E]" size={28} />
                            </div>
                            <h2 className="text-2xl font-heading font-bold text-[#1A1208]">
                                Créer un compte
                            </h2>
                            <p className="text-[#6B5E4F] text-sm mt-1">
                                Déjà inscrit ?{' '}
                                <Link to="/login" className="text-[#3D5A3E] font-semibold hover:underline">
                                    Se connecter
                                </Link>
                            </p>
                        </div>

                        {/* Success Message */}
                        {success && (
                            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg animate-slide-in">
                                <div className="flex items-center gap-3">
                                    <FiCheckCircle className="text-green-500" size={20} />
                                    <div>
                                        <p className="text-green-700 text-sm font-medium">{success}</p>
                                        <p className="text-green-600 text-xs mt-1">Redirection en cours...</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg animate-shake">
                                <div className="flex items-center gap-3">
                                    <FiAlertCircle className="text-red-500" size={20} />
                                    <div>
                                        <p className="text-red-700 text-sm font-medium">Erreur</p>
                                        <p className="text-red-600 text-xs mt-1">{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Role Selection */}
                        <div className="mb-6">
                            <label className="block text-[#1A1208] text-sm font-semibold mb-3">
                                Je suis...
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setRole('client')}
                                    className={`p-3 rounded-xl border-2 font-semibold text-sm transition-all duration-200 ${
                                        role === 'client' 
                                        ? 'border-[#3D5A3E] bg-[#E8EDE6] text-[#3D5A3E]' 
                                        : 'border-[#E8E2D9] text-[#6B5E4F] hover:border-[#C47D4E]'
                                    }`}
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <FiShoppingBag size={16} />
                                        Client
                                    </div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole('freelancer')}
                                    className={`p-3 rounded-xl border-2 font-semibold text-sm transition-all duration-200 ${
                                        role === 'freelancer' 
                                        ? 'border-[#3D5A3E] bg-[#E8EDE6] text-[#3D5A3E]' 
                                        : 'border-[#E8E2D9] text-[#6B5E4F] hover:border-[#C47D4E]'
                                    }`}
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <FiTool size={16} />
                                        Artisan
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Nom complet */}
                            <div>
                                <label className="block text-[#1A1208] text-sm font-semibold mb-2 flex items-center gap-2">
                                    <FiUser size={16} className="text-[#3D5A3E]" />
                                    Nom complet
                                </label>
                                <input 
                                    type="text" 
                                    value={name} 
                                    onChange={e => setName(e.target.value)} 
                                    required 
                                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl focus:outline-none focus:border-[#3D5A3E] focus:ring-2 focus:ring-[#3D5A3E]/10 transition-all"
                                    placeholder="Votre nom"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-[#1A1208] text-sm font-semibold mb-2 flex items-center gap-2">
                                    <FiMail size={16} className="text-[#3D5A3E]" />
                                    Email
                                </label>
                                <input 
                                    type="email" 
                                    value={email} 
                                    onChange={e => setEmail(e.target.value)} 
                                    required 
                                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl focus:outline-none focus:border-[#3D5A3E] focus:ring-2 focus:ring-[#3D5A3E]/10 transition-all"
                                    placeholder="exemple@email.com"
                                />
                            </div>

                            {/* Téléphone (optionnel) */}
                            <div>
                                <label className="block text-[#1A1208] text-sm font-semibold mb-2 flex items-center gap-2">
                                    <FiPhone size={16} className="text-[#3D5A3E]" />
                                    Téléphone (optionnel)
                                </label>
                                <input 
                                    type="tel" 
                                    value={phone} 
                                    onChange={e => setPhone(e.target.value)} 
                                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl focus:outline-none focus:border-[#3D5A3E] focus:ring-2 focus:ring-[#3D5A3E]/10 transition-all"
                                    placeholder="+212 6XXXXXXXX"
                                />
                            </div>

                            {/* Ville (optionnel) */}
                            <div>
                                <label className="block text-[#1A1208] text-sm font-semibold mb-2 flex items-center gap-2">
                                    <FiMapPin size={16} className="text-[#3D5A3E]" />
                                    Ville (optionnel)
                                </label>
                                <select
                                    value={city}
                                    onChange={e => setCity(e.target.value)}
                                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl focus:outline-none focus:border-[#3D5A3E] focus:ring-2 focus:ring-[#3D5A3E]/10 transition-all text-[#1A1208]"
                                >
                                    <option value="">Sélectionnez votre ville</option>
                                    {moroccanCities.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Mot de passe */}
                            <div>
                                <label className="block text-[#1A1208] text-sm font-semibold mb-2 flex items-center gap-2">
                                    <FiLock size={16} className="text-[#3D5A3E]" />
                                    Mot de passe
                                </label>
                                <div className="relative">
                                    <input 
                                        type={showPassword ? "text" : "password"}
                                        value={password} 
                                        onChange={e => setPassword(e.target.value)} 
                                        required 
                                        className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl focus:outline-none focus:border-[#3D5A3E] focus:ring-2 focus:ring-[#3D5A3E]/10 transition-all pr-12"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#9B9082] hover:text-[#3D5A3E] transition-colors"
                                    >
                                        {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                    </button>
                                </div>
                                {passwordStrength.message && (
                                    <p className={`text-xs mt-1 ${passwordStrength.color}`}>
                                        Force du mot de passe : {passwordStrength.message}
                                    </p>
                                )}
                            </div>

                            {/* Confirmer mot de passe */}
                            <div>
                                <label className="block text-[#1A1208] text-sm font-semibold mb-2 flex items-center gap-2">
                                    <FiLock size={16} className="text-[#3D5A3E]" />
                                    Confirmer le mot de passe
                                </label>
                                <div className="relative">
                                    <input 
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword} 
                                        onChange={e => setConfirmPassword(e.target.value)} 
                                        required 
                                        className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl focus:outline-none focus:border-[#3D5A3E] focus:ring-2 focus:ring-[#3D5A3E]/10 transition-all pr-12"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#9B9082] hover:text-[#3D5A3E] transition-colors"
                                    >
                                        {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                    </button>
                                </div>
                                {confirmPassword && (
                                    <p className={`text-xs mt-1 ${passwordsMatch ? 'text-green-500' : 'text-red-500'}`}>
                                        {passwordsMatch ? '✓ Les mots de passe correspondent' : '✗ Les mots de passe ne correspondent pas'}
                                    </p>
                                )}
                            </div>

                            {/* Conditions générales */}
                            <div className="flex items-center gap-2">
                                <input 
                                    type="checkbox" 
                                    id="terms"
                                    checked={agreeTerms}
                                    onChange={(e) => setAgreeTerms(e.target.checked)}
                                    className="w-4 h-4 rounded border-[#E8E2D9] text-[#3D5A3E] focus:ring-[#3D5A3E] focus:ring-offset-0"
                                />
                                <label htmlFor="terms" className="text-sm text-[#6B5E4F]">
                                    J'accepte les{' '}
                                    <Link to="/terms" className="text-[#3D5A3E] hover:underline">
                                        conditions générales
                                    </Link>
                                </label>
                            </div>

                            {/* Submit Button */}
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-[#3D5A3E] to-[#2D452E] hover:from-[#2D452E] hover:to-[#1F301F] text-white py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl mt-6"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Création en cours...
                                    </>
                                ) : (
                                    <>
                                        Créer mon compte
                                        <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Footer */}
                        <div className="mt-6 pt-4 border-t border-[#E8E2D9] text-center">
                            <Link to="/" className="inline-flex items-center gap-1 text-xs text-[#9B9082] hover:text-[#3D5A3E] transition-colors">
                                ← Retour à l'accueil
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fadeInLeft {
                    from { opacity: 0; transform: translateX(-30px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideIn {
                    from { opacity: 0; transform: translateX(-20px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
                .animate-fade-in-left { animation: fadeInLeft 0.6s ease-out; }
                .animate-fade-in-up { animation: fadeInUp 0.6s ease-out; }
                .animate-slide-in { animation: slideIn 0.3s ease-out; }
                .animate-shake { animation: shake 0.3s ease-out; }
            `}</style>
        </div>
    );
}

export default Register;