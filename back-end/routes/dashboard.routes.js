// routes/dashboard.routes.js

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { admin, freelancer, client } = require('../middleware/auth.middleware');
const { getFreelancerDashboard, getClientDashboard, getAdminDashboard } = require('../controllers/dashboardController');

// Routes protégées selon rôle
router.get('/freelancer', protect, freelancer, getFreelancerDashboard);
router.get('/client', protect, client, getClientDashboard);
router.get('/admin', protect, admin, getAdminDashboard);

module.exports = router;