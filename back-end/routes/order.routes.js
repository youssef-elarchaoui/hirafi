// routes/order.routes.js

const express = require('express');
const router = express.Router();
const {
    createOrder,
    getMyOrders,
    getReceivedOrders,
    getOrderById,
    updateOrderStatus,
    deliverOrder,
    cancelOrder,
    completeOrder,
    getAllOrders
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth.middleware');

// Routes protégées (toutes nécessitent authentification)
router.post('/', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/received', protect, getReceivedOrders);
router.get('/admin/all', protect, getAllOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, updateOrderStatus);
router.post('/:id/deliver', protect, deliverOrder);
router.put('/:id/cancel', protect, cancelOrder);
router.put('/:id/complete', completeOrder);

module.exports = router;