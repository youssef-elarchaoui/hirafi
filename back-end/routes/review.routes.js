// routes/review.routes.js

const express = require('express');
const router = express.Router();
const {
    createReview,
    getServiceReviews,
    getFreelancerReviews,
    getMyReviews,
    respondToReview,
    reportReview,
    markHelpful,
    deleteReview
} = require('../controllers/reviewController');
const { protect } = require('../middleware/auth.middleware');

// Routes publiques
router.get('/service/:serviceId', getServiceReviews);
router.get('/freelancer/:freelancerId', getFreelancerReviews);

// Routes protégées
router.post('/', protect, createReview);
router.get('/my-reviews', protect, getMyReviews);
router.put('/:id/respond', protect, respondToReview);
router.put('/:id/report', protect, reportReview);
router.put('/:id/helpful', protect, markHelpful);
router.delete('/:id', protect, deleteReview);

module.exports = router;