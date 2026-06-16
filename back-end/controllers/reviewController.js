// controllers/reviewController.js

const mongoose = require('mongoose');  // <-- تأكد من وجود هذا السطر
const Review = require('../models/Review');
const Order = require('../models/Order');
const Service = require('../models/Service');
const User = require('../models/User');

// @desc    Créer un nouveau review (après commande complétée)
// @route   POST /api/reviews
// @access  Private (Client only)
const createReview = async (req, res) => {
    try {
        // Vérifier si l'utilisateur est client
        if (req.user.role !== 'client') {
            return res.status(403).json({
                success: false,
                message: 'Seuls les clients peuvent laisser un avis'
            });
        }

        const { orderId, rating, comment } = req.body;

        if (!orderId || !rating || !comment) {
            return res.status(400).json({
                success: false,
                message: 'Veuillez fournir la commande, la note et le commentaire'
            });
        }

        // Vérifier si la commande existe
        const order = await Order.findById(orderId)
            .populate('serviceId', 'title freelancerId')
            .populate('clientId', 'name');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Commande non trouvée'
            });
        }

        // Vérifier que le client est bien le propriétaire
        if (order.clientId._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Vous ne pouvez pas évaluer une commande qui ne vous appartient pas'
            });
        }

        // Vérifier que la commande est complétée
        if (order.status !== 'completed') {
            return res.status(400).json({
                success: false,
                message: 'Vous ne pouvez évaluer qu\'une commande complétée'
            });
        }

        // Vérifier si un review existe déjà pour cette commande
        const existingReview = await Review.findOne({ orderId });
        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: 'Vous avez déjà laissé un avis pour cette commande'
            });
        }

        // Créer le review
        const review = await Review.create({
            orderId,
            serviceId: order.serviceId._id,
            clientId: req.user._id,
            freelancerId: order.freelancerId,
            rating,
            comment,
            status: 'active'
        });

        await review.populate('clientId', 'name avatar');

        res.status(201).json({
            success: true,
            message: 'Avis publié avec succès',
            review
        });

    } catch (error) {
        console.error('Erreur createReview:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la création de l\'avis',
            error: error.message
        });
    }
};

// @desc    Obtenir les reviews d'un service
// @route   GET /api/reviews/service/:serviceId
// @access  Public
const getServiceReviews = async (req, res) => {
    try {
        const { page = 1, limit = 10, sort = '-createdAt' } = req.query;
        
        const filter = { 
            serviceId: req.params.serviceId,
            status: 'active'
        };

        const skip = (page - 1) * limit;
        const total = await Review.countDocuments(filter);

        const reviews = await Review.find(filter)
            .populate('clientId', 'name avatar')
            .sort(sort)
            .skip(skip)
            .limit(Number(limit));

        // Calculer les statistiques - Version corrigée sans aggregate
        const allReviews = await Review.find({ 
            serviceId: req.params.serviceId, 
            status: 'active' 
        });
        
        let totalRating = 0;
        let rating5 = 0, rating4 = 0, rating3 = 0, rating2 = 0, rating1 = 0;
        
        allReviews.forEach(review => {
            totalRating += review.rating;
            if (review.rating === 5) rating5++;
            else if (review.rating === 4) rating4++;
            else if (review.rating === 3) rating3++;
            else if (review.rating === 2) rating2++;
            else if (review.rating === 1) rating1++;
        });
        
        const averageRating = allReviews.length > 0 ? totalRating / allReviews.length : 0;

        const stats = {
            averageRating: parseFloat(averageRating.toFixed(1)),
            totalReviews: allReviews.length,
            rating5,
            rating4,
            rating3,
            rating2,
            rating1
        };

        res.status(200).json({
            success: true,
            reviews,
            stats,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Erreur getServiceReviews:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des avis',
            error: error.message
        });
    }
};

// @desc    Obtenir les reviews d'un freelancer
// @route   GET /api/reviews/freelancer/:freelancerId
// @access  Public
const getFreelancerReviews = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        
        const filter = { 
            freelancerId: req.params.freelancerId,
            status: 'active'
        };

        const skip = (page - 1) * limit;
        const total = await Review.countDocuments(filter);

        const reviews = await Review.find(filter)
            .populate('clientId', 'name avatar')
            .populate('serviceId', 'title')
            .sort('-createdAt')
            .skip(skip)
            .limit(Number(limit));

        res.status(200).json({
            success: true,
            reviews,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Erreur getFreelancerReviews:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des avis',
            error: error.message
        });
    }
};

// @desc    Obtenir mes reviews (en tant que freelancer)
// @route   GET /api/reviews/my-reviews
// @access  Private (Freelancer only)
const getMyReviews = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        
        const filter = { freelancerId: req.user._id };

        const skip = (page - 1) * limit;
        const total = await Review.countDocuments(filter);

        const reviews = await Review.find(filter)
            .populate('clientId', 'name avatar')
            .populate('serviceId', 'title')
            .sort('-createdAt')
            .skip(skip)
            .limit(Number(limit));

        res.status(200).json({
            success: true,
            reviews,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Erreur getMyReviews:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération de vos avis',
            error: error.message
        });
    }
};

// @desc    Répondre à un review (Freelancer)
// @route   PUT /api/reviews/:id/respond
// @access  Private (Freelancer only)
const respondToReview = async (req, res) => {
    try {
        const { response } = req.body;
        
        if (!response || response.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Veuillez fournir une réponse'
            });
        }

        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Avis non trouvé'
            });
        }

        // Vérifier que le freelancer est bien le propriétaire
        if (review.freelancerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Vous ne pouvez pas répondre à cet avis'
            });
        }

        review.freelancerResponse = response;
        review.responseDate = new Date();
        await review.save();

        res.status(200).json({
            success: true,
            message: 'Réponse ajoutée avec succès',
            review
        });

    } catch (error) {
        console.error('Erreur respondToReview:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'ajout de la réponse',
            error: error.message
        });
    }
};

// @desc    Signaler un avis
// @route   PUT /api/reviews/:id/report
// @access  Private
const reportReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Avis non trouvé'
            });
        }

        review.status = 'reported';
        await review.save();

        res.status(200).json({
            success: true,
            message: 'Avis signalé à l\'administrateur'
        });

    } catch (error) {
        console.error('Erreur reportReview:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors du signalement',
            error: error.message
        });
    }
};

// @desc    Marquer un avis comme utile
// @route   PUT /api/reviews/:id/helpful
// @access  Private
const markHelpful = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Avis non trouvé'
            });
        }

        // Vérifier si l'utilisateur a déjà marqué comme utile
        const alreadyHelpful = review.helpful.some(
            id => id.toString() === req.user._id.toString()
        );
        
        if (alreadyHelpful) {
            // Retirer le like
            review.helpful = review.helpful.filter(
                id => id.toString() !== req.user._id.toString()
            );
        } else {
            // Ajouter le like
            review.helpful.push(req.user._id);
        }

        await review.save();

        res.status(200).json({
            success: true,
            message: alreadyHelpful ? 'Like retiré' : 'Like ajouté',
            helpfulCount: review.helpful.length
        });

    } catch (error) {
        console.error('Erreur markHelpful:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la mise à jour',
            error: error.message
        });
    }
};

// @desc    Supprimer un avis (Admin only)
// @route   DELETE /api/reviews/:id
// @access  Private (Admin only)
const deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Avis non trouvé'
            });
        }

        await review.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Avis supprimé avec succès'
        });

    } catch (error) {
        console.error('Erreur deleteReview:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression',
            error: error.message
        });
    }
};

module.exports = {
    createReview,
    getServiceReviews,
    getFreelancerReviews,
    getMyReviews,
    respondToReview,
    reportReview,
    markHelpful,
    deleteReview
};