// routes/dashboard.routes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware'); // ✅ Vérifiez le nom du fichier

const {
    getFreelancerDashboard,
    getClientDashboard,
    getAdminDashboard
} = require('../controllers/dashboardController');

// Toutes les routes sont protégées
router.use(protect);

router.get('/freelancer', getFreelancerDashboard);
router.get('/client', getClientDashboard);
router.get('/admin', getAdminDashboard);

module.exports = router;