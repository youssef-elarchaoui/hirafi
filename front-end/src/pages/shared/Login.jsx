// src/pages/shared/Login.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginAPI } from '../../api/authApi';
import { useAuth } from '../../hooks/useAuth';
import { 
  FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, 
  FiShield, FiUsers, FiBriefcase, FiStar, FiCheckCircle,
  FiAlertCircle, FiLogIn, FiHome
} from 'react-icons/fi';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    
    const { login, user } = useAuth();
    const navigate = useNavigate();

    // Redirection si déjà connecté
    useEffect(() => {
        if (user) {
            const timer = setTimeout(() => {
                if (user.role === 'admin') navigate('/admin/dashboard');
                else if (user.role === 'freelancer') navigate('/freelancer/dashboard');
                else navigate('/client/dashboard');
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [user, navigate]);

    // Charger email sauvegardé
    useEffect(() => {
        const savedEmail = localStorage.getItem('rememberedEmail');
        if (savedEmail) {
            setEmail(savedEmail);
            setRememberMe(true);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        try {
            const data = await loginAPI({ email, password });
            
            // Sauvegarder email si "Se souvenir de moi" est coché
            if (rememberMe) {
                localStorage.setItem('rememberedEmail', email);
            } else {
                localStorage.removeItem('rememberedEmail');
            }
            
            login(data.token, data.user);
            setSuccess('Connexion réussie ! Redirection en cours...');
        } catch (err) {
            setError(err.response?.data?.message || 'Email ou mot de passe incorrect');
        } finally {
            setIsLoading(false);
        }
    };

    // Statistiques de la plateforme
    const stats = [
        { icon: FiUsers, value: '500+', label: 'Artisans actifs' },
        { icon: FiBriefcase, value: '1.2k+', label: 'Services proposés' },
        { icon: FiStar, value: '4.9/5', label: 'Satisfaction client' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FAF8F5] via-white to-[#FAF8F5] flex items-center justify-center p-4 sm:p-6 font-body relative overflow-hidden">
            
            {/* Background Decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#3D5A3E]/5 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#C47D4E]/5 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[1200px] max-h-[800px] border border-[#3D5A3E]/5 rounded-full"></div>
            </div>

            <div className="w-full max-w-6xl relative z-10">
                <div className="grid md:grid-cols-2 gap-0 md:gap-8 lg:gap-12 items-center">
                    
                    {/* Brand/Craft Panel - Modern Design */}
                    <div className="hidden md:block space-y-8 animate-fade-in-left">
                        {/* Logo et titre */}
                        <div className="relative">
                            <div className="absolute -top-4 -left-4 w-20 h-20 bg-[#3D5A3E]/10 rounded-full blur-2xl"></div>
                            <div className="relative">
                                <h1 className="text-5xl lg:text-6xl font-display font-black text-[#3D5A3E] tracking-tight">
                                    Hirafi
                                </h1>
                                <div className="w-20 h-1 bg-[#C47D4E] mt-2 rounded-full"></div>
                            </div>
                            <p className="text-[#6B5E4F] text-lg mt-4 leading-relaxed max-w-sm">
                                Là où l'artisanat rencontre l'innovation et la confiance
                            </p>
                        </div>
                        
                        {/* Citation */}
                        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-[#E8E2D9] shadow-sm">
                            <div className="flex items-start gap-3">
                                <div className="w-1 h-12 bg-[#C47D4E] rounded-full"></div>
                                <div>
                                    <p className="text-[#3D5A3E] text-xl italic leading-relaxed font-medium">
                                        "Le savoir-faire authentique au service de l'excellence"
                                    </p>
                                    <p className="text-[#9B9082] text-sm mt-2">— Proverbe marocain</p>
                                </div>
                            </div>
                        </div>

                        {/* Craft icons decoration */}
                        <div className="flex gap-3">
                            {['🎨', '💻', '📈', '✍️', '🎥', '💡'].map((icon, idx) => (
                                <div key={idx} className="w-12 h-12 bg-white border border-[#E8E2D9] rounded-xl flex items-center justify-center text-2xl hover:bg-[#E8EDE6] hover:scale-110 transition-all duration-300 cursor-pointer">
                                    {icon}
                                </div>
                            ))}
                        </div>

                        {/* Stats */}
                        <div className="pt-6 border-t border-[#E8E2D9]">
                            <p className="text-[#5C5244] text-sm mb-4 font-semibold">📊 La plateforme en chiffres</p>
                            <div className="grid grid-cols-3 gap-4">
                                {stats.map((stat, idx) => (
                                    <div key={idx} className="text-center group">
                                        <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-[#E8EDE6] flex items-center justify-center group-hover:bg-[#3D5A3E] group-hover:text-white transition-all">
                                            <stat.icon className="text-[#3D5A3E] group-hover:text-white" size={18} />
                                        </div>
                                        <div className="text-lg font-bold text-[#3D5A3E]">{stat.value}</div>
                                        <div className="text-xs text-[#9B9082]">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Trust badge */}
                        <div className="flex items-center gap-2 text-xs text-[#9B9082]">
                            <FiShield size={14} />
                            <span>Plateforme sécurisée • Paiement 100% protégé</span>
                        </div>
                    </div>

                    {/* Login Form Panel - Modern Design */}
                    <div className="bg-white rounded-2xl shadow-xl border border-[#E8E2D9] p-6 sm:p-8 md:p-10 w-full max-w-md mx-auto md:mx-0 md:ml-auto animate-fade-in-up">
                        
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#E8EDE6] mb-4">
                                <FiLogIn className="text-[#3D5A3E]" size={28} />
                            </div>
                            <h2 className="text-2xl font-heading font-bold text-[#1A1208]">
                                Bon retour
                            </h2>
                            <p className="text-[#6B5E4F] text-sm mt-1">
                                Connectez-vous pour accéder à votre espace
                            </p>
                        </div>

                        {/* Success Toast */}
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

                        {/* Error Toast */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg animate-shake">
                                <div className="flex items-center gap-3">
                                    <FiAlertCircle className="text-red-500" size={20} />
                                    <div>
                                        <p className="text-red-700 text-sm font-medium">Erreur de connexion</p>
                                        <p className="text-red-600 text-xs mt-1">{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* User Info Display (pour debug) */}
                        {user && (
                            <div className="mb-6 p-4 bg-[#EBEFE8] rounded-lg border border-[#3D5A3E]/20">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[#3D5A3E] flex items-center justify-center text-white font-bold">
                                        {user.name?.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-[#1A1208] text-sm font-semibold">Bonjour {user.name}</p>
                                        <p className="text-[#3D5A3E] text-xs">Rôle : {user.role === 'freelancer' ? 'Artisan' : user.role === 'admin' ? 'Administrateur' : 'Client'}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-[#1A1208] text-sm font-semibold mb-2 flex items-center gap-2">
                                    <FiMail size={16} className="text-[#3D5A3E]" />
                                    Adresse e-mail
                                </label>
                                <input 
                                    type="email" 
                                    value={email} 
                                    onChange={e => setEmail(e.target.value)} 
                                    required 
                                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl focus:outline-none focus:border-[#3D5A3E] focus:ring-2 focus:ring-[#3D5A3E]/10 transition-all text-[#1A1208] placeholder:text-[#9B9082]"
                                    placeholder="exemple@email.com"
                                />
                            </div>
                            
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
                                        className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl focus:outline-none focus:border-[#3D5A3E] focus:ring-2 focus:ring-[#3D5A3E]/10 transition-all text-[#1A1208] placeholder:text-[#9B9082] pr-12"
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
                            </div>

                            {/* Remember me & Forgot password */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="w-4 h-4 rounded border-[#E8E2D9] text-[#3D5A3E] focus:ring-[#3D5A3E] focus:ring-offset-0"
                                    />
                                    <span className="text-sm text-[#6B5E4F]">Se souvenir de moi</span>
                                </label>
                                <Link to="/forgot-password" className="text-sm text-[#C47D4E] hover:text-[#D4A05A] transition-colors">
                                    Mot de passe oublié ?
                                </Link>
                            </div>

                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-[#3D5A3E] to-[#2D452E] hover:from-[#2D452E] hover:to-[#1F301F] text-white py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Connexion en cours...
                                    </>
                                ) : (
                                    <>
                                        Se connecter
                                        <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Footer links */}
                        <div className="mt-8 pt-6 border-t border-[#E8E2D9] text-center">
                            <p className="text-[#6B5E4F] text-sm">
                                Pas encore de compte ? 
                                <Link to="/register" className="ml-1 text-[#3D5A3E] font-semibold hover:underline">
                                    Créer un compte
                                </Link>
                            </p>
                            <Link to="/" className="inline-flex items-center gap-1 mt-3 text-xs text-[#9B9082] hover:text-[#3D5A3E] transition-colors">
                                <FiHome size={12} />
                                Retour à l'accueil
                            </Link>
                        </div>

                        {/* Trust message */}
                        <div className="mt-6 text-center">
                            <p className="text-xs text-[#9B9082] flex items-center justify-center gap-1">
                                <FiShield size={12} />
                                Vos données sont sécurisées
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fadeInLeft {
                    from {
                        opacity: 0;
                        transform: translateX(-30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateX(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
                .animate-fade-in-left {
                    animation: fadeInLeft 0.6s ease-out;
                }
                .animate-fade-in-up {
                    animation: fadeInUp 0.6s ease-out;
                }
                .animate-slide-in {
                    animation: slideIn 0.3s ease-out;
                }
                .animate-shake {
                    animation: shake 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}

export default Login;