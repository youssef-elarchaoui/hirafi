const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { admin } = require('../middleware/auth.middleware');
const {
    getWallet,
    deposit,
    withdraw,
    payOrder,
    refundOrder,
    getWithdrawalRequests,
    approveWithdrawal,
    rejectWithdrawal,
    getAllTransactions
} = require('../controllers/paymentController');

// Routes protégées (authentification requise)
router.get('/wallet', protect, getWallet);
router.post('/deposit', protect, deposit);
router.post('/withdraw', protect, withdraw);
router.post('/pay-order/:orderId', protect, payOrder);

// Routes Admin
router.get('/admin/withdrawals', protect, admin, getWithdrawalRequests);
router.put('/admin/withdrawals/:id/approve', protect, admin, approveWithdrawal);
router.put('/admin/withdrawals/:id/reject', protect, admin, rejectWithdrawal);
router.get('/admin/transactions', protect, admin, getAllTransactions);
router.post('/admin/refund/:orderId', protect, admin, refundOrder);

module.exports = router;