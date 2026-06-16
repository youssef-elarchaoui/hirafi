// src/pages/admin/AdminReviews.jsx
import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import toast from 'react-hot-toast';
import { 
  FiStar, FiRefreshCw, FiEye, FiX, FiCheck,
  FiUser, FiMessageSquare, FiCalendar, FiAlertTriangle
} from 'react-icons/fi';

const AdminReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        setLoading(true);
        setRefreshing(true);
        try {
            const response = await adminApi.getReportedReviews();
            console.log('⭐ Avis signalés reçus:', response.data);
            
            setReviews(response.data.reviews || []);
        } catch (error) {
            console.error('Erreur:', error);
            toast.error('Impossible de charger les avis signalés');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const approveReview = async (reviewId) => {
        try {
            const response = await adminApi.approveReview(reviewId);
            if (response.data.success) {
                toast.success('Avis approuvé');
                fetchReviews();
            }
        } catch (error) {
            toast.error('Erreur lors de l\'approbation');
        }
    };

    const hideReview = async (reviewId) => {
        try {
            const response = await adminApi.hideReview(reviewId);
            if (response.data.success) {
                toast.success('Avis masqué');
                fetchReviews();
            }
        } catch (error) {
            toast.error('Erreur lors du masquage');
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="relative w-12 h-12">
                    <div className="absolute inset-0 border-3 border-[#E8EDE6] rounded-full"></div>
                    <div className="absolute inset-0 border-3 border-[#3D5A3E] border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-heading font-bold text-[#1A1208] flex items-center gap-2">
                        <FiAlertTriangle className="text-red-500" />
                        Avis signalés
                    </h1>
                    <p className="text-[#6B5E4F] text-sm mt-1">
                        {reviews.length} avis en attente de modération
                    </p>
                </div>
                <button 
                    onClick={fetchReviews}
                    disabled={refreshing}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E8E2D9] rounded-xl text-[#6B5E4F] hover:text-[#3D5A3E] transition-all"
                >
                    <FiRefreshCw className={refreshing ? 'animate-spin' : ''} size={16} />
                    Actualiser
                </button>
            </div>

            {/* Reviews List */}
            {reviews.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-[#E8E2D9]">
                    <div className="text-6xl mb-4">✅</div>
                    <h3 className="text-xl font-heading font-semibold text-[#1A1208] mb-2">
                        Aucun avis signalé
                    </h3>
                    <p className="text-[#6B5E4F]">
                        Tous les avis sont approuvés
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {reviews.map((review) => (
                        <div key={review._id} className="bg-white rounded-2xl border border-[#E8E2D9] p-6 hover:shadow-md transition-all">
                            <div className="flex flex-col md:flex-row justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="flex items-center gap-1 text-yellow-500">
                                            {[...Array(5)].map((_, i) => (
                                                <FiStar key={i} className={i < review.rating ? 'fill-current' : ''} size={16} />
                                            ))}
                                        </div>
                                        <span className="text-sm font-semibold text-[#1A1208]">{review.rating}/5</span>
                                    </div>
                                    <p className="text-[#6B5E4F] text-sm mb-3 italic">
                                        "{review.comment}"
                                    </p>
                                    <div className="flex flex-wrap gap-4 text-xs text-[#6B5E4F]">
                                        <span className="flex items-center gap-1">
                                            <FiUser size={12} />
                                            {review.clientId?.name || 'Client'}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <FiMessageSquare size={12} />
                                            {review.freelancerId?.name || 'Artisan'}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <FiCalendar size={12} />
                                            {formatDate(review.createdAt)}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <FiAlertTriangle className="text-red-500" size={12} />
                                            Signalé
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => approveReview(review._id)}
                                        className="flex items-center gap-1 px-4 py-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg text-sm font-medium transition-all"
                                    >
                                        <FiCheck size={16} />
                                        Approuver
                                    </button>
                                    <button
                                        onClick={() => hideReview(review._id)}
                                        className="flex items-center gap-1 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-medium transition-all"
                                    >
                                        <FiX size={16} />
                                        Masquer
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminReviews;