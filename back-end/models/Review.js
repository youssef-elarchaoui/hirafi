// models/Review.js

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
        unique: true  // كل طلب يمكن تقييمه مرة واحدة فقط
    },
    
    // الخدمة التي تم تقييمها
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    
    // العميل الذي كتب التقييم
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    // المستقل الذي تم تقييمه
    freelancerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    // التقييم (نجوم)
    rating: {
        type: Number,
        required: [true, 'La note est requise'],
        min: [1, 'La note doit être entre 1 et 5'],
        max: [5, 'La note doit être entre 1 et 5']
    },
    
    // التعليق
    comment: {
        type: String,
        required: [true, 'Le commentaire est requis'],
        trim: true,
        minlength: [5, 'Le commentaire doit contenir au moins 5 caractères'],
        maxlength: [1000, 'Le commentaire ne peut pas dépasser 1000 caractères']
    },
    
    // رد المستقل على التقييم
    freelancerResponse: {
        type: String,
        default: '',
        maxlength: [500, 'La réponse ne peut pas dépasser 500 caractères']
    },
    
    // تاريخ رد المستقل
    responseDate: {
        type: Date
    },
    
    // هل التقييم مفيد؟ (إعجابات)
    helpful: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    
    // حالة التقييم
    status: {
        type: String,
        enum: ['active', 'reported', 'hidden'],
        default: 'active'
    }
    
}, {
    timestamps: true
});

// Middleware: mettre à jour la note moyenne du service
reviewSchema.post('save', async function() {
    const Service = mongoose.model('Service');
    const Review = mongoose.model('Review');
    
    const reviews = await Review.find({ serviceId: this.serviceId, status: 'active' });
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;
    
    await Service.findByIdAndUpdate(this.serviceId, {
        rating: averageRating.toFixed(1),
        ratingCount: reviews.length
    });
});

// Middleware: mettre à jour la note moyenne du freelancer
reviewSchema.post('save', async function() {
    const User = mongoose.model('User');
    const Review = mongoose.model('Review');
    
    const reviews = await Review.find({ freelancerId: this.freelancerId, status: 'active' });
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;
    
    await User.findByIdAndUpdate(this.freelancerId, {
        rating: averageRating.toFixed(1),
        ratingCount: reviews.length
    });
});

module.exports = mongoose.model('Review', reviewSchema);