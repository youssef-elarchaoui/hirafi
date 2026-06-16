// models/Order.js

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    // رقم الطلب (unique)
    orderNumber: {
        type: String,
        unique: true
    },
    
    // الخدمة المطلوبة
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    
    // العميل (اللي طلب)
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    // المستقل (صاحب الخدمة)
    freelancerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    // تفاصيل الطلب
    requirements: {
        type: String,
        required: [true, 'Les exigences sont requises'],
        trim: true
    },
    
    // السعر المتفق عليه
    price: {
        type: Number,
        required: true,
        min: 0
    },
    
    // حالة الطلب
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'delivered', 'completed', 'cancelled', 'disputed'],
        default: 'pending'
    },
    
    // ملفات التسليم
    deliveryFile: {
        type: String,
        default: ''
    },
    
    deliveryMessage: {
        type: String,
        default: ''
    },
    
    deliveredAt: {
        type: Date
    },
    
    completedAt: {
        type: Date
    },
    
    cancelledAt: {
        type: Date
    },
    
    cancellationReason: {
        type: String,
        default: ''
    },
    
    // ملاحظات الأدمن
    adminNotes: {
        type: String,
        default: ''
    },
    
    // رسوم المنصة
    platformFee: {
        type: Number,
        default: 0
    },
    
    // المبلغ الذي يستلمه المستقل
    freelancerEarnings: {
        type: Number,
        default: 0
    }
    
}, {
    timestamps: true
});

// ========== VERSION CORRIGÉE (sans async/await) ==========
// Générer le numéro de commande unique avant la sauvegarde
orderSchema.pre('save', async function () {
    if (!this.orderNumber) {
        const count = await this.constructor.countDocuments();

        const year = new Date().getFullYear();

        this.orderNumber = `HIR-${year}${String(count + 1).padStart(6, '0')}`;
    }
});

module.exports = mongoose.model('Order', orderSchema);