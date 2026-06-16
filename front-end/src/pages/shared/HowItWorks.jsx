// src/pages/shared/HowItWorks.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  FiUserPlus, FiSearch, FiMessageCircle, FiCheckCircle,
  FiDollarSign, FiStar, FiShield, FiClock, FiAward,
  FiTrendingUp, FiUsers, FiBriefcase, FiZap,
  FiArrowRight, FiPlay, FiPause, FiMail, FiSend
} from 'react-icons/fi';

const HowItWorks = () => {
    const { user } = useAuth();
    const [activeVideo, setActiveVideo] = useState(false);

    // Étapes pour les clients
    const clientSteps = [
        {
            number: '01',
            title: 'Créez votre compte',
            description: 'Inscrivez-vous gratuitement en quelques clics. Choisissez le rôle "Client" pour commencer.',
            icon: FiUserPlus,
            color: 'from-blue-500 to-cyan-500',
            bg: 'bg-blue-50',
            text: 'text-blue-600'
        },
        {
            number: '02',
            title: 'Trouvez l\'artisan parfait',
            description: 'Parcourez les profils des artisans, filtrez par compétences, ville et tarifs. Comparez les notes et avis.',
            icon: FiSearch,
            color: 'from-purple-500 to-pink-500',
            bg: 'bg-purple-50',
            text: 'text-purple-600'
        },
        {
            number: '03',
            title: 'Discutez et validez',
            description: 'Contactez l\'artisan, discutez des détails du projet et validez ensemble les livrables.',
            icon: FiMessageCircle,
            color: 'from-green-500 to-emerald-500',
            bg: 'bg-green-50',
            text: 'text-green-600'
        },
        {
            number: '04',
            title: 'Paiement sécurisé',
            description: 'Les fonds sont bloqués en toute sécurité. Ils ne sont libérés qu\'après votre validation finale.',
            icon: FiDollarSign,
            color: 'from-yellow-500 to-orange-500',
            bg: 'bg-yellow-50',
            text: 'text-yellow-600'
        },
        {
            number: '05',
            title: 'Suivez l\'avancement',
            description: 'Suivez l\'état d\'avancement de votre commande en temps réel via la messagerie.',
            icon: FiClock,
            color: 'from-red-500 to-rose-500',
            bg: 'bg-red-50',
            text: 'text-red-600'
        },
        {
            number: '06',
            title: 'Recevez et notez',
            description: 'Validez la réception et laissez un avis pour aider la communauté.',
            icon: FiStar,
            color: 'from-indigo-500 to-purple-500',
            bg: 'bg-indigo-50',
            text: 'text-indigo-600'
        }
    ];

    // Étapes pour les freelancers
    const freelancerSteps = [
        {
            number: '01',
            title: 'Créez votre compte',
            description: 'Inscrivez-vous en tant qu\'artisan. Complétez votre profil avec vos compétences et votre portfolio.',
            icon: FiUserPlus,
            color: 'from-blue-500 to-cyan-500',
            bg: 'bg-blue-50',
            text: 'text-blue-600'
        },
        {
            number: '02',
            title: 'Créez vos services',
            description: 'Proposez vos services avec une description détaillée, des prix et des délais.',
            icon: FiBriefcase,
            color: 'from-purple-500 to-pink-500',
            bg: 'bg-purple-50',
            text: 'text-purple-600'
        },
        {
            number: '03',
            title: 'Recevez des commandes',
            description: 'Les clients vous contactent et passent commande de vos services.',
            icon: FiTrendingUp,
            color: 'from-green-500 to-emerald-500',
            bg: 'bg-green-50',
            text: 'text-green-600'
        },
        {
            number: '04',
            title: 'Réalisez le travail',
            description: 'Livrez un travail de qualité dans les délais convenus avec le client.',
            icon: FiCheckCircle,
            color: 'from-yellow-500 to-orange-500',
            bg: 'bg-yellow-50',
            text: 'text-yellow-600'
        },
        {
            number: '05',
            title: 'Recevez le paiement',
            description: 'Une fois le travail validé, recevez votre paiement en toute sécurité.',
            icon: FiDollarSign,
            color: 'from-red-500 to-rose-500',
            bg: 'bg-red-50',
            text: 'text-red-600'
        },
        {
            number: '06',
            title: 'Bâtissez votre réputation',
            description: 'Les avis clients vous aident à gagner en crédibilité et à attirer plus de projets.',
            icon: FiAward,
            color: 'from-indigo-500 to-purple-500',
            bg: 'bg-indigo-50',
            text: 'text-indigo-600'
        }
    ];

    // Avantages
    const benefits = [
        {
            icon: FiShield,
            title: 'Paiement sécurisé',
            description: 'Les fonds sont bloqués jusqu\'à validation. Paiement 100% sécurisé.',
            color: 'text-emerald-500',
            bg: 'bg-emerald-50'
        },
        {
            icon: FiUsers,
            title: 'Communauté bienveillante',
            description: 'Rejoignez une communauté d\'entraide et de partage de talents.',
            color: 'text-blue-500',
            bg: 'bg-blue-50'
        },
        {
            icon: FiAward,
            title: 'Qualité garantie',
            description: 'Tous les artisans sont vérifiés et évalués par leurs clients.',
            color: 'text-purple-500',
            bg: 'bg-purple-50'
        },
        {
            icon: FiZap,
            title: 'Rapidité et efficacité',
            description: 'Trouvez l\'artisan idéal en quelques minutes seulement.',
            color: 'text-orange-500',
            bg: 'bg-orange-50'
        }
    ];

    // Témoignages
    const testimonials = [
        {
            name: 'Fatima Zahra',
            role: 'Artisane Tisserande',
            city: 'Fès',
            quote: 'Hirafi m\'a permis de partager mon savoir-faire ancestral avec des clients du monde entier. Une révolution pour l\'artisanat marocain !',
            rating: 5,
            image: '🧵'
        },
        {
            name: 'Mohamed Amine',
            role: 'Développeur Web',
            city: 'Casablanca',
            quote: 'Grâce à Hirafi, j\'ai transformé ma passion en métier. La communauté est bienveillante et les opportunités sont infinies.',
            rating: 5,
            image: '💻'
        },
        {
            name: 'Nadia Benali',
            role: 'Calligraphe',
            city: 'Marrakech',
            quote: 'Chaque projet est unique, comme une pièce de zellige. Hirafi respecte l\'âme de l\'artisanat marocain.',
            rating: 5,
            image: '✍️'
        }
    ];

    // FAQ
    const faqs = [
        {
            q: 'Comment trouver un artisan sur Hirafi ?',
            a: 'Utilisez notre moteur de recherche et filtrez par catégorie, compétences, ville ou tarif. Consultez les profils, les avis et contactez directement les artisans qui vous intéressent.'
        },
        {
            q: 'Comment fonctionne le paiement ?',
            a: 'Le paiement est sécurisé. Les fonds sont bloqués et ne sont libérés qu\'après validation du travail par le client. Vous pouvez payer par carte bancaire ou via nos partenaires.'
        },
        {
            q: 'Que faire en cas de litige ?',
            a: 'Notre équipe intervient rapidement pour trouver une solution amiable. Nous mettons tout en œuvre pour garantir une expérience positive pour toutes les parties.'
        },
        {
            q: 'Comment devenir artisan sur Hirafi ?',
            a: 'Inscrivez-vous gratuitement, complétez votre profil (compétences, portfolio, tarifs) et commencez à proposer vos services. Notre équipe vérifie votre profil pour garantir la qualité.'
        },
        {
            q: 'Quels sont les frais de commission ?',
            a: 'Hirafi prélève une commission de 10% sur chaque commande pour assurer le bon fonctionnement de la plateforme et garantir un service de qualité.'
        },
        {
            q: 'Puis-je annuler une commande ?',
            a: 'Oui, vous pouvez annuler une commande tant qu\'elle n\'est pas commencée. Une fois le travail entamé, l\'annulation est possible avec l\'accord de l\'artisan.'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FAF8F5] via-white to-[#FAF8F5]">
            
            {/* ========== SECTION HERO ========== */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-[#3D5A3E]/5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#C47D4E]/5 rounded-full blur-3xl"></div>
                </div>
                
                <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 relative z-10">
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 bg-[#E8EDE6] px-4 py-2 rounded-full mb-6">
                            <span className="w-2 h-2 bg-[#3D5A3E] rounded-full animate-pulse"></span>
                            <span className="text-sm text-[#3D5A3E] font-medium">Guide simple</span>
                        </div>
                        
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-[#1A1208] mb-6">
                            Comment ça marche ?
                        </h1>
                        
                        <p className="text-lg text-[#5C5244] max-w-2xl mx-auto leading-relaxed">
                            Découvrez comment Hirafi connecte les talents marocains avec des clients exigeants
                        </p>

                        {/* Stats rapides */}
                        <div className="flex justify-center gap-8 mt-8 pt-6 border-t border-[#E8EDE6]">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-[#3D5A3E]">500+</div>
                                <div className="text-xs text-[#5C5244]">Artisans</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-[#3D5A3E]">1.2k+</div>
                                <div className="text-xs text-[#5C5244]">Services</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-[#3D5A3E]">98%</div>
                                <div className="text-xs text-[#5C5244]">Satisfaction</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========== SECTION CHOISIR VOTRE RÔLE ========== */}
            <section className="py-20 bg-white/50">
                <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#1A1208] mb-4">
                            Vous êtes ?
                        </h2>
                        <p className="text-[#5C5244] max-w-2xl mx-auto">
                            Hirafi s'adapte à votre besoin, que vous soyez client ou artisan
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Carte Client */}
                        <div className="bg-white rounded-2xl border border-[#E8E2D9] p-8 hover:shadow-xl transition-all hover:-translate-y-1">
                            <div className="text-5xl mb-4">💼</div>
                            <h3 className="text-2xl font-heading font-bold text-[#1A1208] mb-3">
                                Client
                            </h3>
                            <p className="text-[#6B5E4F] mb-6">
                                Vous cherchez un artisan talentueux pour réaliser vos projets ?
                            </p>
                            <Link 
                                to={user ? "/services" : "/register?role=client"}
                                className="inline-flex items-center gap-2 text-[#3D5A3E] font-semibold hover:gap-3 transition-all"
                            >
                                {user ? "Explorer les services" : "Créer un compte client"}
                                <FiArrowRight size={16} />
                            </Link>
                        </div>

                        {/* Carte Artisan */}
                        <div className="bg-white rounded-2xl border border-[#E8E2D9] p-8 hover:shadow-xl transition-all hover:-translate-y-1">
                            <div className="text-5xl mb-4">🛠️</div>
                            <h3 className="text-2xl font-heading font-bold text-[#1A1208] mb-3">
                                Artisan
                            </h3>
                            <p className="text-[#6B5E4F] mb-6">
                                Vous avez un talent et souhaitez le monétiser ?
                            </p>
                            <Link 
                                to={user ? "/freelancer/dashboard" : "/register?role=freelancer"}
                                className="inline-flex items-center gap-2 text-[#3D5A3E] font-semibold hover:gap-3 transition-all"
                            >
                                {user ? "Accéder à mon espace" : "Devenir artisan"}
                                <FiArrowRight size={16} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========== ÉTAPES POUR LES CLIENTS ========== */}
            <section className="py-20">
                <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <span className="inline-block px-3 py-1 bg-[#E8EDE6] rounded-full text-xs text-[#3D5A3E] font-semibold mb-3">
                            Guide client
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#1A1208] mb-4">
                            Pour les clients
                        </h2>
                        <p className="text-[#5C5244] max-w-2xl mx-auto">
                            Trouvez l'artisan idéal en 6 étapes simples
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {clientSteps.map((step) => (
                            <div key={step.number} className="group bg-white rounded-2xl p-6 border border-[#E8E2D9] hover:shadow-lg transition-all hover:-translate-y-1 relative overflow-hidden">
                                <div className={`absolute top-0 right-0 w-32 h-32 ${step.bg} rounded-full -mr-16 -mt-16 opacity-50`}></div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className={`text-2xl font-bold ${step.text}`}>{step.number}</span>
                                        <div className={`p-2 rounded-xl ${step.bg}`}>
                                            <step.icon className={step.text} size={20} />
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-heading font-bold text-[#1A1208] mb-2">
                                        {step.title}
                                    </h3>
                                    <p className="text-[#6B5E4F] text-sm leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ========== ÉTAPES POUR LES FREELANCERS ========== */}
            <section className="py-20 bg-[#E8EDE6]/30">
                <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <span className="inline-block px-3 py-1 bg-white rounded-full text-xs text-[#3D5A3E] font-semibold mb-3">
                            Guide artisan
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#1A1208] mb-4">
                            Pour les artisans
                        </h2>
                        <p className="text-[#5C5244] max-w-2xl mx-auto">
                            Développez votre activité en 6 étapes simples
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {freelancerSteps.map((step) => (
                            <div key={step.number} className="group bg-white rounded-2xl p-6 border border-[#E8E2D9] hover:shadow-lg transition-all hover:-translate-y-1 relative overflow-hidden">
                                <div className={`absolute top-0 right-0 w-32 h-32 ${step.bg} rounded-full -mr-16 -mt-16 opacity-50`}></div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className={`text-2xl font-bold ${step.text}`}>{step.number}</span>
                                        <div className={`p-2 rounded-xl ${step.bg}`}>
                                            <step.icon className={step.text} size={20} />
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-heading font-bold text-[#1A1208] mb-2">
                                        {step.title}
                                    </h3>
                                    <p className="text-[#6B5E4F] text-sm leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ========== AVANTAGES ========== */}
            <section className="py-20">
                <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <span className="inline-block px-3 py-1 bg-[#E8EDE6] rounded-full text-xs text-[#3D5A3E] font-semibold mb-3">
                            Pourquoi Hirafi
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#1A1208] mb-4">
                            Les avantages de la plateforme
                        </h2>
                        <p className="text-[#5C5244] max-w-2xl mx-auto">
                            Une expérience unique pour les clients et les artisans
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {benefits.map((benefit, idx) => (
                            <div key={idx} className="bg-white rounded-2xl p-6 text-center hover:shadow-xl transition-all group">
                                <div className={`w-16 h-16 mx-auto mb-4 rounded-xl ${benefit.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                    <benefit.icon className={benefit.color} size={28} />
                                </div>
                                <h3 className="text-lg font-heading font-bold text-[#1A1208] mb-2">
                                    {benefit.title}
                                </h3>
                                <p className="text-[#6B5E4F] text-sm">
                                    {benefit.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ========== TÉMOIGNAGES ========== */}
            <section className="py-20 bg-[#3D5A3E] text-white">
                <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs text-white font-semibold mb-3">
                            Témoignages
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-4">
                            Ils parlent de Hirafi
                        </h2>
                        <p className="text-white/80 max-w-2xl mx-auto">
                            Des retours authentiques de notre communauté
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {testimonials.map((testimonial, idx) => (
                            <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                                <div className="text-4xl mb-4">{testimonial.image}</div>
                                <div className="flex gap-1 text-yellow-400 mb-3">
                                    {[...Array(5)].map((_, i) => (
                                        <FiStar key={i} className="fill-current" size={14} />
                                    ))}
                                </div>
                                <p className="text-white/90 text-sm italic leading-relaxed mb-4">
                                    "{testimonial.quote}"
                                </p>
                                <div>
                                    <h4 className="font-semibold">{testimonial.name}</h4>
                                    <p className="text-white/70 text-sm">{testimonial.role} · {testimonial.city}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ========== FAQ ========== */}
            <section className="py-20">
                <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <span className="inline-block px-3 py-1 bg-[#E8EDE6] rounded-full text-xs text-[#3D5A3E] font-semibold mb-3">
                            Questions fréquentes
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#1A1208] mb-4">
                            FAQ
                        </h2>
                        <p className="text-[#5C5244] max-w-2xl mx-auto">
                            Tout ce que vous devez savoir sur Hirafi
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {faqs.map((faq, idx) => (
                            <div key={idx} className="bg-white rounded-2xl p-6 border border-[#E8E2D9] hover:shadow-md transition-all group">
                                <h3 className="text-lg font-heading font-bold text-[#1A1208] mb-2 flex items-start gap-3">
                                    <span className="text-[#3D5A3E] text-2xl">?</span>
                                    {faq.q}
                                </h3>
                                <p className="text-[#6B5E4F] text-sm leading-relaxed ml-8">
                                    {faq.a}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ========== CTA FINAL ========== */}
            <section className="py-20 bg-gradient-to-r from-[#3D5A3E] to-[#2D452E]">
                <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative overflow-hidden rounded-3xl p-12 text-center">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                        
                        <div className="relative z-10">
                            <div className="text-6xl mb-4">🚀</div>
                            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-4">
                                Prêt à rejoindre l'aventure ?
                            </h2>
                            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
                                Rejoignez notre communauté de talents exceptionnels
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    to="/register"
                                    className="bg-white text-[#3D5A3E] hover:bg-gray-100 px-8 py-3 rounded-xl font-semibold transition-all hover:scale-105"
                                >
                                    Commencer maintenant
                                </Link>
                                <Link
                                    to="/services"
                                    className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-3 rounded-xl font-semibold transition-all"
                                >
                                    Explorer les services
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HowItWorks;