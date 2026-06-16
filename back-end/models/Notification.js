const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: [
            'order_created', 'order_accepted', 'order_delivered', 'order_completed', 'order_cancelled',
            'new_message', 'new_review', 'review_response',
            'payment_received', 'withdrawal_approved', 'withdrawal_rejected',
            'service_approved', 'service_rejected',
            'account_disabled', 'account_enabled'
        ],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    link: {
        type: String,
        default: ''
    },
    referenceId: {
        type: mongoose.Schema.Types.ObjectId
    },
    referenceType: {
        type: String,
        enum: ['order', 'service', 'message', 'review', 'transaction']
    },
    isRead: {
        type: Boolean,
        default: false
    },
    readAt: { type: Date },
    icon: { type: String, default: '🔔' },
    color: { type: String, default: '#0D8F81' }
}, { timestamps: true });

// Index
notificationSchema.index({ userId: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);