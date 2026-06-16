// server/models/Transaction.js

const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    transactionNumber: {
        type: String,
        unique: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['deposit', 'withdrawal', 'payment', 'refund', 'commission', 'bonus'],
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    balanceBefore: {
        type: Number,
        required: true
    },
    balanceAfter: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'cancelled'],
        default: 'pending'
    },
    description: {
        type: String,
        required: true
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    },
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service'
    },
    recipientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    paymentMethod: {
        type: String,
        enum: ['card', 'bank_transfer', 'wallet', 'cashplus', 'orange_money'],
        default: 'wallet'
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    completedAt: {
        type: Date
    }
}, {
    timestamps: true
});

// PAS DE MIDDLEWARE !!! On va générer le numéro dans le seed

module.exports = mongoose.model('Transaction', transactionSchema);