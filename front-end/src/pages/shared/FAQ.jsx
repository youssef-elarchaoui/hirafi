// src/pages/shared/FAQ.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronDown, FiChevronUp, FiSearch, FiMessageSquare, FiMail, FiHelpCircle } from 'react-icons/fi';

const FAQ = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [openFaq, setOpenFaq] = useState(null);

    const faqCategories = [
        {
            id: 'general',
            title: 'Général',
            icon: '🏠',
            faqs: [
                {
                    id: 'g1',
                    question: 'Qu\'est-ce que Hirafi ?',
                    answer: 'Hirafi est une plateforme marocaine qui connecte les artisans et freelances talentueux avec des clients qui cherchent l\'authenticité et la qualité. Nous facilitons la mise en relation entre les professionnels et les clients pour des projets variés.'
                },
                {
                    id: 'g2',
                    question: 'Comment fonctionne Hirafi ?',
                    answer: 'Hirafi fonctionne comme un marché en ligne où les artisans proposent leurs services et les clients peuvent les trouver, les contacter et commander directement via la plateforme. Le paiement est sécurisé et les fonds ne sont libérés qu\'après validation du travail.'
                },
                {
                    id: 'g3',
                    question: 'Est-ce que Hirafi est gratuit ?',
                    answer: 'L\'inscription sur Hirafi est gratuite pour les clients et les artisans. Nous prélevons une commission de 10% sur chaque commande pour assurer le bon fonctionnement de la plateforme et garantir un service de qualité.'
                }
            ]
        },
        {
            id: 'client',
            title: 'Pour les clients',
            icon: '💼',
            faqs: [
                {
                    id: 'c1',
                    question: 'Comment trouver un artisan ?',
                    answer: 'Utilisez notre moteur de recherche et filtrez par catégorie, compétences, ville ou tarif. Consultez les profils, les avis et contactez directement les artisans qui vous intéressent.'
                },
                {
                    id: 'c2',
                    question: 'Comment payer en toute sécurité ?',
                    answer: 'Le paiement est sécurisé via notre plateforme. Les fonds sont bloqués et ne sont libérés qu\'après validation du travail par le client. Vous pouvez payer par carte bancaire ou via nos partenaires.'
                },
                {
                    id: 'c3',
                    question: 'Que faire en cas de litige ?',
                    answer: 'Notre équipe intervient rapidement pour trouver une solution amiable. Nous mettons tout en œuvre pour garantir une expérience positive pour toutes les parties.'
                }
            ]
        },
        {
            id: 'freelancer',
            title: 'Pour les artisans',
            icon: '🛠️',
            faqs: [
                {
                    id: 'f1',
                    question: 'Comment devenir artisan sur Hirafi ?',
                    answer: 'Inscrivez-vous gratuitement, complétez votre profil (compétences, portfolio, tarifs) et commencez à proposer vos services. Notre équipe vérifie votre profil pour garantir la qualité.'
                },
                {
                    id: 'f2',
                    question: 'Quels sont les frais de commission ?',
                    answer: 'Hirafi prélève une commission de 10% sur chaque commande pour assurer le bon fonctionnement de la plateforme et garantir un service de qualité.'
                },
                {
                    id: 'f3',
                    question: 'Comment recevoir mes paiements ?',
                    answer: 'Les paiements sont effectués via la plateforme. Une fois la commande terminée et validée par le client, les fonds sont libérés sur votre compte Hirafi. Vous pouvez ensuite les retirer via nos partenaires bancaires.'
                }
            ]
        },
        {
            id: 'technical',
            title: 'Technique',
            icon: '💻',
            faqs: [
                {
                    id: 't1',
                    question: 'L\'application est-elle disponible sur mobile ?',
                    answer: 'Oui, Hirafi est accessible sur mobile via notre application native disponible sur iOS et Android, ainsi que via notre site web responsive.'
                },
                {
                    id: 't2',
                    question: 'Comment modifier mon mot de passe ?',
                    answer: 'Connectez-vous à votre compte, allez dans "Paramètres" puis "Sécurité" pour changer votre mot de passe en toute sécurité.'
                },
                {
                    id: 't3',
                    question: 'Comment supprimer mon compte ?',
                    answer: 'Contactez notre support pour supprimer votre compte. Nous vous accompagnerons dans cette démarche en toute transparence.'
                }
            ]
        }
    ];

    const toggleFaq = (id) => {
        setOpenFaq(openFaq === id ? null : id);
    };

    const filteredFaqs = faqCategories.map(category => ({
        ...category,
        faqs: category.faqs.filter(faq =>
            faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
        )
    })).filter(category => category.faqs.length > 0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FAF8F5] via-white to-[#FAF8F5]">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#3D5A3E] to-[#2D452E] text-white py-12">
                <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3 mb-3">
                        <FiHelpCircle className="text-4xl" />
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold">
                            FAQ
                        </h1>
                    </div>
                    <p className="text-white/80 text-lg max-w-2xl">
                        Trouvez rapidement des réponses à vos questions
                    </p>
                </div>
            </div>

            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search */}
                <div className="relative max-w-2xl mx-auto mb-10">
                    <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#9B9082]" size={20} />
                    <input
                        type="text"
                        placeholder="Rechercher une question..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-[#E8E2D9] rounded-xl focus:outline-none focus:border-[#3D5A3E] focus:ring-2 focus:ring-[#3D5A3E]/10 transition-all"
                    />
                </div>

                {/* Categories */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                    {faqCategories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => {
                                const element = document.getElementById(`category-${category.id}`);
                                if (element) element.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="bg-white rounded-2xl border border-[#E8E2D9] p-4 text-center hover:shadow-lg transition-all hover:-translate-y-1"
                        >
                            <div className="text-3xl mb-2">{category.icon}</div>
                            <h3 className="font-heading font-semibold text-[#1A1208] text-sm">{category.title}</h3>
                            <p className="text-xs text-[#6B5E4F]">{category.faqs.length} questions</p>
                        </button>
                    ))}
                </div>

                {/* FAQ Items */}
                <div className="space-y-8">
                    {filteredFaqs.map((category) => (
                        <div key={category.id} id={`category-${category.id}`}>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-2xl">{category.icon}</span>
                                <h2 className="text-2xl font-heading font-bold text-[#1A1208]">
                                    {category.title}
                                </h2>
                            </div>
                            <div className="space-y-3">
                                {category.faqs.map((faq) => (
                                    <div key={faq.id} className="bg-white rounded-2xl border border-[#E8E2D9] overflow-hidden hover:shadow-md transition-all">
                                        <button
                                            onClick={() => toggleFaq(faq.id)}
                                            className="w-full flex justify-between items-center p-5 text-left hover:bg-[#FAF8F5] transition-all"
                                        >
                                            <span className="font-medium text-[#1A1208] text-sm sm:text-base">
                                                {faq.question}
                                            </span>
                                            <span className="ml-4 flex-shrink-0">
                                                {openFaq === faq.id ? (
                                                    <FiChevronUp className="text-[#3D5A3E]" size={20} />
                                                ) : (
                                                    <FiChevronDown className="text-[#6B5E4F]" size={20} />
                                                )}
                                            </span>
                                        </button>
                                        {openFaq === faq.id && (
                                            <div className="p-5 pt-0 border-t border-[#E8E2D9] animate-fade-in">
                                                <p className="text-[#6B5E4F] text-sm leading-relaxed">
                                                    {faq.answer}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Contact CTA */}
                <div className="mt-12 bg-gradient-to-r from-[#3D5A3E] to-[#2D452E] rounded-2xl p-8 text-center text-white">
                    <div className="text-4xl mb-4">💬</div>
                    <h2 className="text-2xl font-heading font-bold mb-2">
                        Vous n'avez pas trouvé votre réponse ?
                    </h2>
                    <p className="text-white/80 mb-6">
                        Contactez notre équipe support, nous sommes là pour vous aider
                    </p>
                    <Link
                        to="/contact"
                        className="inline-flex items-center gap-2 bg-white text-[#3D5A3E] hover:bg-gray-100 px-6 py-3 rounded-xl font-semibold transition-all"
                    >
                        <FiMail size={18} />
                        Contacter le support
                    </Link>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fadeIn 0.2s ease-out;
                }
            `}</style>
        </div>
    );
};

export default FAQ;