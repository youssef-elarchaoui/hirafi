// src/pages/shared/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiArrowLeft, FiSearch, FiAlertTriangle } from 'react-icons/fi';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FAF8F5] via-white to-[#FAF8F5] flex items-center justify-center p-4">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#3D5A3E]/5 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#C47D4E]/5 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 max-w-2xl mx-auto text-center">
                {/* Animated 404 */}
                <div className="relative mb-8">
                    <div className="text-9xl sm:text-[12rem] font-heading font-black text-[#3D5A3E]/10 select-none">
                        404
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white rounded-full p-4 shadow-lg">
                            <FiAlertTriangle className="text-[#C47D4E]" size={48} />
                        </div>
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-3xl sm:text-4xl font-heading font-bold text-[#1A1208] mb-4">
                    Oups ! Page non trouvée
                </h1>
                
                {/* Description */}
                <p className="text-[#6B5E4F] text-lg mb-8 max-w-md mx-auto">
                    La page que vous recherchez n'existe pas ou a été déplacée.
                    Vérifiez l'URL ou retournez à l'accueil.
                </p>

                {/* Search suggestion */}
                <div className="bg-white rounded-2xl border border-[#E8E2D9] p-6 mb-8 max-w-md mx-auto">
                    <div className="flex items-center gap-3 mb-4">
                        <FiSearch className="text-[#3D5A3E]" size={20} />
                        <span className="text-[#1A1208] font-medium">Suggestions :</span>
                    </div>
                    <ul className="text-left space-y-2 text-[#6B5E4F] text-sm">
                        <li>• Vérifiez que l'URL est correcte</li>
                        <li>• Retournez à la page d'accueil</li>
                        <li>• Utilisez la barre de navigation pour trouver ce que vous cherchez</li>
                    </ul>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link 
                        to="/" 
                        className="inline-flex items-center justify-center gap-2 bg-[#3D5A3E] hover:bg-[#2D452E] text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 group"
                    >
                        <FiHome size={18} className="group-hover:-translate-y-0.5 transition-transform" />
                        Retour à l'accueil
                    </Link>
                    <button 
                        onClick={() => window.history.back()} 
                        className="inline-flex items-center justify-center gap-2 border-2 border-[#3D5A3E] text-[#3D5A3E] hover:bg-[#E8EDE6] px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                    >
                        <FiArrowLeft size={18} />
                        Page précédente
                    </button>
                </div>

                {/* Help text */}
                <div className="mt-8 text-center">
                    <p className="text-xs text-[#9B9082]">
                        Besoin d'aide ? <Link to="/contact" className="text-[#3D5A3E] hover:underline">Contactez-nous</Link>
                    </p>
                </div>
            </div>

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
            `}</style>
        </div>
    );
};

export default NotFound;