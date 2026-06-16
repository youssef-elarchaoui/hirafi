// routes/user.routes.js - Ajoutez ces routes
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const {
    getMyStats,
    getFreelancers,
    getFreelancerById
} = require('../controllers/userController');

// Routes publiques (pour les freelancers)
router.get('/freelancers', getFreelancers);
router.get('/freelancers/:id', getFreelancerById);

// Routes protégées
router.use(protect);
router.get('/me/stats', getMyStats);

module.exports = router;