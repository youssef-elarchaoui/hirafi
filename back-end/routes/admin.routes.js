// routes/admin.routes.js

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { admin } = require('../middleware/auth.middleware');
const {
    // Stats
    getStats,
    // Users
    getAllUsers,
    getUserById,
    updateUser,
    disableUser,
    enableUser,
    deleteUser,
    // Services
    getAllServices,
    updateService,
    deleteService,
    // Orders
    getAllOrders,
    updateOrderStatus,
    // Reviews
    getReportedReviews,
    approveReview,
    hideReview,
    // Categories
    getCategories
} = require('../controllers/adminController');

// Toutes les routes admin nécessitent authentification + rôle admin
router.use(protect, admin);

// ========== STATISTIQUES ==========
router.get('/stats', getStats);

// ========== GESTION DES UTILISATEURS ==========
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.put('/users/:id/disable', disableUser);
router.put('/users/:id/enable', enableUser);
router.delete('/users/:id', deleteUser);

// ========== GESTION DES SERVICES ==========
router.get('/services', getAllServices);
router.put('/services/:id', updateService);
router.delete('/services/:id', deleteService);

// ========== GESTION DES COMMANDES ==========
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

// ========== GESTION DES REVIEWS ==========
router.get('/reviews/reported', getReportedReviews);
router.put('/reviews/:id/approve', approveReview);
router.put('/reviews/:id/hide', hideReview);

// ========== GESTION DES CATÉGORIES ==========
router.get('/categories', getCategories);

module.exports = router;