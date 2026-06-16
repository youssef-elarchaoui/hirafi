// src/pages/shared/Contact.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiMail, FiPhone, FiMapPin, FiSend, FiCheckCircle,
  FiMessageSquare, FiClock, FiGlobe, FiUsers
} from 'react-icons/fi';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            // Simuler l'envoi
            await new Promise(resolve => setTimeout(resolve, 1500));
            setSubmitted(true);
            setFormData({ name: '', email: '', subject: '', message: '' });
            setTimeout(() => setSubmitted(false), 5000);
        } catch (error) {
            console.error('Erreur:', error);
        } finally {
            setLoading(false);
        }
    };

    const contactInfo = [
        {
            icon: FiMail,
            title: 'Email',
            info: 'contact@hirafi.ma',
            link: 'mailto:contact@hirafi.ma'
        },
        {
            icon: FiPhone,
            title: 'Téléphone',
            info: '+212 5 20 00 00 00',
            link: 'tel:+212520000000'
        },
        {
            icon: FiMapPin,
            title: 'Adresse',
            info: 'Casablanca, Maroc',
            link: null
        },
        {
            icon: FiClock,
            title: 'Horaires',
            info: 'Lun - Ven, 9h - 18h',
            link: null
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FAF8F5] via-white to-[#FAF8F5]">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#3D5A3E] to-[#2D452E] text-white py-12">
                <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3 mb-3">
                        <FiMessageSquare className="text-4xl" />
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold">
                            Contactez-nous
                        </h1>
                    </div>
                    <p className="text-white/80 text-lg max-w-2xl">
                        Une question ? Un projet ? Nous sommes là pour vous aider
                    </p>
                </div>
            </div>

            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contact Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-2xl border border-[#E8E2D9] p-6">
                            <h2 className="text-xl font-heading font-bold text-[#1A1208] mb-4">
                                Informations
                            </h2>
                            <div className="space-y-4">
                                {contactInfo.map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-3">
                                        <div className="p-2 bg-[#E8EDE6] rounded-xl">
                                            <item.icon className="text-[#3D5A3E]" size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-[#1A1208]">{item.title}</p>
                                            {item.link ? (
                                                <a href={item.link} className="text-sm text-[#6B5E4F] hover:text-[#3D5A3E] transition-colors">
                                                    {item.info}
                                                </a>
                                            ) : (
                                                <p className="text-sm text-[#6B5E4F]">{item.info}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-[#3D5A3E] to-[#2D452E] rounded-2xl p-6 text-white">
                            <div className="text-3xl mb-3">🤝</div>
                            <h3 className="font-heading font-bold text-lg mb-2">
                                Rejoignez-nous
                            </h3>
                            <p className="text-white/80 text-sm mb-4">
                                Devenez membre de notre communauté
                            </p>
                            <div className="flex gap-3">
                                <Link
                                    to="/register?role=client"
                                    className="flex-1 text-center bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                                >
                                    Client
                                </Link>
                                <Link
                                    to="/register?role=freelancer"
                                    className="flex-1 text-center bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                                >
                                    Artisan
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl border border-[#E8E2D9] p-6 md:p-8">
                            <h2 className="text-xl font-heading font-bold text-[#1A1208] mb-2">
                                Envoyez-nous un message
                            </h2>
                            <p className="text-[#6B5E4F] text-sm mb-6">
                                Nous vous répondrons dans les plus brefs délais
                            </p>

                            {submitted && (
                                <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg animate-fade-in">
                                    <div className="flex items-center gap-3">
                                        <FiCheckCircle className="text-green-500" size={20} />
                                        <div>
                                            <p className="text-green-700 font-medium">Message envoyé !</p>
                                            <p className="text-green-600 text-sm">Nous vous répondrons rapidement</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-[#1A1208] text-sm font-semibold mb-2">
                                            Nom complet *
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl focus:outline-none focus:border-[#3D5A3E] transition-all"
                                            placeholder="Votre nom"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[#1A1208] text-sm font-semibold mb-2">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl focus:outline-none focus:border-[#3D5A3E] transition-all"
                                            placeholder="exemple@email.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[#1A1208] text-sm font-semibold mb-2">
                                        Sujet *
                                    </label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl focus:outline-none focus:border-[#3D5A3E] transition-all"
                                        placeholder="Sujet de votre message"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[#1A1208] text-sm font-semibold mb-2">
                                        Message *
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows="5"
                                        className="w-full px-4 py-2 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl focus:outline-none focus:border-[#3D5A3E] transition-all resize-none"
                                        placeholder="Décrivez votre demande..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#3D5A3E] hover:bg-[#2D452E] text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Envoi en cours...
                                        </>
                                    ) : (
                                        <>
                                            <FiSend size={18} />
                                            Envoyer le message
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                    <div className="bg-white rounded-2xl border border-[#E8E2D9] p-4 text-center">
                        <div className="text-2xl font-bold text-[#3D5A3E]">500+</div>
                        <div className="text-sm text-[#6B5E4F]">Artisans actifs</div>
                    </div>
                    <div className="bg-white rounded-2xl border border-[#E8E2D9] p-4 text-center">
                        <div className="text-2xl font-bold text-[#3D5A3E]">1.2k+</div>
                        <div className="text-sm text-[#6B5E4F]">Services proposés</div>
                    </div>
                    <div className="bg-white rounded-2xl border border-[#E8E2D9] p-4 text-center">
                        <div className="text-2xl font-bold text-[#3D5A3E]">98%</div>
                        <div className="text-sm text-[#6B5E4F]">Satisfaction client</div>
                    </div>
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

export default Contact;