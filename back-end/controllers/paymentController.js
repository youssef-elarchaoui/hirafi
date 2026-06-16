const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Order = require('../models/Order');

// ========== GESTION DU PORTEFEUILLE ==========

// @desc    Obtenir mon solde et historique des transactions
// @route   GET /api/payments/wallet
// @access  Private
const getWallet = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        
        // Récupérer les transactions (dernières 50)
        const transactions = await Transaction.find({ userId: req.user._id })
            .sort('-createdAt')
            .limit(50);
        
        // Statistiques
        const totalDeposits = await Transaction.aggregate([
            { $match: { userId: req.user._id, type: 'deposit', status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        
        const totalWithdrawals = await Transaction.aggregate([
            { $match: { userId: req.user._id, type: 'withdrawal', status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        
        const totalSpent = await Transaction.aggregate([
            { $match: { userId: req.user._id, type: 'payment', status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        
        const totalEarned = await Transaction.aggregate([
            { $match: { userId: req.user._id, type: 'commission', status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        
        res.status(200).json({
            success: true,
            wallet: {
                balance: user.balance,
                totalDeposits: totalDeposits[0]?.total || 0,
                totalWithdrawals: totalWithdrawals[0]?.total || 0,
                totalSpent: totalSpent[0]?.total || 0,
                totalEarned: totalEarned[0]?.total || 0
            },
            transactions
        });
        
    } catch (error) {
        console.error('Erreur getWallet:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération du portefeuille',
            error: error.message
        });
    }
};

// @desc    Recharger le portefeuille (simulation)
// @route   POST /api/payments/deposit
// @access  Private
const deposit = async (req, res) => {
    try {
        const { amount, paymentMethod } = req.body;
        
        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Montant invalide'
            });
        }
        
        if (amount < 10) {
            return res.status(400).json({
                success: false,
                message: 'Le montant minimum de recharge est de 10 DH'
            });
        }
        
        if (amount > 10000) {
            return res.status(400).json({
                success: false,
                message: 'Le montant maximum de recharge est de 10000 DH'
            });
        }
        
        const user = await User.findById(req.user._id);
        const balanceBefore = user.balance;
        
        // Ajouter le montant
        user.balance += amount;
        await user.save();
        
        // Créer la transaction
        const transaction = await Transaction.create({
            userId: req.user._id,
            type: 'deposit',
            amount,
            balanceBefore,
            balanceAfter: user.balance,
            status: 'completed',
            description: `Recharge de portefeuille de ${amount} DH`,
            paymentMethod: paymentMethod || 'card',
            completedAt: new Date()
        });
        
        res.status(200).json({
            success: true,
            message: `Recharge de ${amount} DH effectuée avec succès`,
            newBalance: user.balance,
            transaction
        });
        
    } catch (error) {
        console.error('Erreur deposit:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la recharge',
            error: error.message
        });
    }
};

// @desc    Demander un retrait
// @route   POST /api/payments/withdraw
// @access  Private (Freelancer only)
const withdraw = async (req, res) => {
    try {
        // Vérifier si l'utilisateur est freelancer
        if (req.user.role !== 'freelancer') {
            return res.status(403).json({
                success: false,
                message: 'Seuls les freelancers peuvent demander un retrait'
            });
        }
        
        const { amount, bankInfo } = req.body;
        
        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Montant invalide'
            });
        }
        
        if (amount < 100) {
            return res.status(400).json({
                success: false,
                message: 'Le montant minimum de retrait est de 100 DH'
            });
        }
        
        if (amount > 50000) {
            return res.status(400).json({
                success: false,
                message: 'Le montant maximum de retrait est de 50000 DH'
            });
        }
        
        const user = await User.findById(req.user._id);
        
        if (user.balance < amount) {
            return res.status(400).json({
                success: false,
                message: 'Solde insuffisant'
            });
        }
        
        const balanceBefore = user.balance;
        
        // Déduire le montant
        user.balance -= amount;
        await user.save();
        
        // Créer la transaction (en attente)
        const transaction = await Transaction.create({
            userId: req.user._id,
            type: 'withdrawal',
            amount,
            balanceBefore,
            balanceAfter: user.balance,
            status: 'pending',
            description: `Demande de retrait de ${amount} DH`,
            paymentMethod: 'bank_transfer',
            metadata: { bankInfo }
        });
        
        res.status(200).json({
            success: true,
            message: 'Demande de retrait envoyée. En attente de validation.',
            newBalance: user.balance,
            transaction
        });
        
    } catch (error) {
        console.error('Erreur withdraw:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la demande de retrait',
            error: error.message
        });
    }
};

// @desc    Payer une commande
// @route   POST /api/payments/pay-order/:orderId
// @access  Private (Client only)
const payOrder = async (req, res) => {
    try {
        // Vérifier si l'utilisateur est client
        if (req.user.role !== 'client') {
            return res.status(403).json({
                success: false,
                message: 'Seuls les clients peuvent payer une commande'
            });
        }
        
        const order = await Order.findById(req.params.orderId)
            .populate('serviceId', 'title price');
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Commande non trouvée'
            });
        }
        
        // Vérifier que le client est bien le propriétaire
        if (order.clientId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Vous ne pouvez pas payer cette commande'
            });
        }
        
        // Vérifier le statut
        if (order.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'Cette commande ne peut pas être payée'
            });
        }
        
        const user = await User.findById(req.user._id);
        
        if (user.balance < order.price) {
            return res.status(400).json({
                success: false,
                message: `Solde insuffisant. Vous avez ${user.balance} DH, besoin de ${order.price} DH`
            });
        }
        
        const balanceBefore = user.balance;
        
        // Déduire le montant du client
        user.balance -= order.price;
        await user.save();
        
        // Ajouter au freelancer (après commission)
        const freelancer = await User.findById(order.freelancerId);
        const platformFee = order.platformFee;
        const freelancerEarnings = order.freelancerEarnings;
        
        freelancer.balance += freelancerEarnings;
        await freelancer.save();
        
        // Mettre à jour la commande
        order.status = 'in-progress';
        await order.save();
        
        // Créer transaction client (paiement)
        await Transaction.create({
            userId: req.user._id,
            type: 'payment',
            amount: order.price,
            balanceBefore,
            balanceAfter: user.balance,
            status: 'completed',
            description: `Paiement pour la commande ${order.orderNumber}`,
            orderId: order._id,
            serviceId: order.serviceId._id,
            recipientId: order.freelancerId,
            completedAt: new Date()
        });
        
        // Créer transaction freelancer (commission)
        await Transaction.create({
            userId: order.freelancerId,
            type: 'commission',
            amount: freelancerEarnings,
            balanceBefore: freelancer.balance - freelancerEarnings,
            balanceAfter: freelancer.balance,
            status: 'completed',
            description: `Gains pour la commande ${order.orderNumber}`,
            orderId: order._id,
            serviceId: order.serviceId._id,
            completedAt: new Date()
        });
        
        res.status(200).json({
            success: true,
            message: 'Paiement effectué avec succès',
            newBalance: user.balance,
            freelancerEarnings
        });
        
    } catch (error) {
        console.error('Erreur payOrder:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors du paiement',
            error: error.message
        });
    }
};

// @desc    Rembourser une commande annulée
// @route   POST /api/payments/refund/:orderId
// @access  Private (Admin only)
const refundOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Commande non trouvée'
            });
        }
        
        if (order.status !== 'cancelled') {
            return res.status(400).json({
                success: false,
                message: 'Seules les commandes annulées peuvent être remboursées'
            });
        }
        
        const client = await User.findById(order.clientId);
        const freelancer = await User.findById(order.freelancerId);
        
        // Vérifier si le freelancer a déjà reçu l'argent
        if (freelancer.balance >= order.freelancerEarnings) {
            freelancer.balance -= order.freelancerEarnings;
            await freelancer.save();
        }
        
        // Rembourser le client
        const clientBalanceBefore = client.balance;
        client.balance += order.price;
        await client.save();
        
        // Créer transaction remboursement
        await Transaction.create({
            userId: order.clientId,
            type: 'refund',
            amount: order.price,
            balanceBefore: clientBalanceBefore,
            balanceAfter: client.balance,
            status: 'completed',
            description: `Remboursement pour la commande ${order.orderNumber}`,
            orderId: order._id,
            completedAt: new Date()
        });
        
        res.status(200).json({
            success: true,
            message: 'Remboursement effectué avec succès',
            refundAmount: order.price
        });
        
    } catch (error) {
        console.error('Erreur refundOrder:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors du remboursement',
            error: error.message
        });
    }
};

// ========== ADMIN: GESTION DES RETRAITS ==========

// @desc    Obtenir toutes les demandes de retrait
// @route   GET /api/payments/admin/withdrawals
// @access  Private (Admin only)
const getWithdrawalRequests = async (req, res) => {
    try {
        const withdrawals = await Transaction.find({ 
            type: 'withdrawal', 
            status: 'pending' 
        })
            .populate('userId', 'name email phone')
            .sort('-createdAt');
        
        res.status(200).json({
            success: true,
            count: withdrawals.length,
            withdrawals
        });
        
    } catch (error) {
        console.error('Erreur getWithdrawalRequests:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des demandes'
        });
    }
};

// @desc    Valider une demande de retrait
// @route   PUT /api/payments/admin/withdrawals/:id/approve
// @access  Private (Admin only)
const approveWithdrawal = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        
        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Transaction non trouvée'
            });
        }
        
        if (transaction.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'Cette demande a déjà été traitée'
            });
        }
        
        transaction.status = 'completed';
        transaction.completedAt = new Date();
        await transaction.save();
        
        res.status(200).json({
            success: true,
            message: 'Retrait validé avec succès',
            transaction
        });
        
    } catch (error) {
        console.error('Erreur approveWithdrawal:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la validation'
        });
    }
};

// @desc    Rejeter une demande de retrait
// @route   PUT /api/payments/admin/withdrawals/:id/reject
// @access  Private (Admin only)
const rejectWithdrawal = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        
        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Transaction non trouvée'
            });
        }
        
        if (transaction.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'Cette demande a déjà été traitée'
            });
        }
        
        // Rembourser le montant à l'utilisateur
        const user = await User.findById(transaction.userId);
        user.balance += transaction.amount;
        await user.save();
        
        transaction.status = 'cancelled';
        transaction.completedAt = new Date();
        await transaction.save();
        
        res.status(200).json({
            success: true,
            message: 'Retrait rejeté et montant remboursé',
            transaction
        });
        
    } catch (error) {
        console.error('Erreur rejectWithdrawal:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors du rejet'
        });
    }
};

// @desc    Obtenir toutes les transactions (admin)
// @route   GET /api/payments/admin/transactions
// @access  Private (Admin only)
const getAllTransactions = async (req, res) => {
    try {
        const { type, status, page = 1, limit = 20 } = req.query;
        
        const filter = {};
        if (type) filter.type = type;
        if (status) filter.status = status;
        
        const skip = (page - 1) * limit;
        const total = await Transaction.countDocuments(filter);
        
        const transactions = await Transaction.find(filter)
            .populate('userId', 'name email')
            .populate('orderId', 'orderNumber')
            .sort('-createdAt')
            .skip(skip)
            .limit(Number(limit));
        
        res.status(200).json({
            success: true,
            transactions,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / limit)
            }
        });
        
    } catch (error) {
        console.error('Erreur getAllTransactions:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des transactions'
        });
    }
};

module.exports = {
    getWallet,
    deposit,
    withdraw,
    payOrder,
    refundOrder,
    getWithdrawalRequests,
    approveWithdrawal,
    rejectWithdrawal,
    getAllTransactions
};