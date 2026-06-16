const express = require('express');
const router = express.Router();
const {
    createService,
    getServices,
    getServiceById,
    updateService,
    deleteService,
    getFreelancerServices,
    getMyServices
} = require('../controllers/serviceController');
const { protect } = require('../middleware/auth.middleware');

// Routes publiques
router.get('/', getServices);
router.get('/freelancer/:freelancerId', getFreelancerServices);
router.get('/:id', getServiceById);

// Routes protégées
router.post('/', protect, createService);
router.get('/me/services', protect, getMyServices);
router.put('/:id', protect, updateService);
router.delete('/:id', protect, deleteService);

module.exports = router;