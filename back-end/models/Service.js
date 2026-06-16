// models/Service.js

const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Le titre est requis'],
        trim: true,
        maxlength: [100, 'Le titre ne peut pas dépasser 100 caractères']
    },
    description: {
        type: String,
        required: [true, 'La description est requise'],
        trim: true,
        maxlength: [5000, 'La description ne peut pas dépasser 5000 caractères']
    },
    
    category: {
        type: String,
        required: [true, 'La catégorie est requise'],
        enum: ['graphic-design', 'web-development', 'marketing', 'writing', 'video', 'music', 'business', 'lifestyle']
    },
    subcategory: {
        type: String,
        default: ''
    },
    price: {
        type: Number,
        required: [true, 'Le prix est requis'],
        min: [1, 'Le prix doit être au moins 1 DH'],
        max: [100000, 'Le prix ne peut pas dépasser 100000 DH']
    },
    deliveryDays: {
        type: Number,
        required: [true, 'Le délai de livraison est requis'],
        min: [1, 'Le délai doit être au moins 1 jour'],
        max: [90, 'Le délai ne peut pas dépasser 90 jours']
    },
    
    tags: [{
        type: String,
        trim: true
    }],
    
    images: [{
        type: String,
        default: []
    }],
    
    packages: {
        basic: {
            name: String,
            price: Number,
            description: String
        },
        standard: {
            name: String,
            price: Number,
            description: String
        },
        premium: {
            name: String,
            price: Number,
            description: String
        }
    },
    
    requirements: {
        type: String,
        default: ''
    },
    
    freelancerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    views: {
        type: Number,
        default: 0
    },
    orders: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        default: 0
    },
    ratingCount: {
        type: Number,
        default: 0
    },
    
    // حالة الخدمة
    status: {
        type: String,
        enum: ['active', 'paused', 'deleted'],
        default: 'active'
    },
    
    featured: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

serviceSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Service', serviceSchema);