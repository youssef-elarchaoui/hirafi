const mongoose = require('mongoose');
const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    },
    content: {
        type: String,
        required: [true, 'Le message ne peut pas être vide'],
        trim: true,
        maxlength: [2000, 'Le message ne peut pas dépasser 2000 caractères']
    },
    attachment: {
        type: {
            type: String,
            enum: ['image', 'file', 'none'],
            default: 'none'
        },
        url: { type: String, default: '' },
        name: { type: String, default: '' }
    },
    isRead: {
        type: Boolean,
        default: false
    },
    readAt: { type: Date },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isSystem: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Index pour les recherches rapides
messageSchema.index({ senderId: 1, receiverId: 1 });
messageSchema.index({ orderId: 1 });
messageSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Message', messageSchema);