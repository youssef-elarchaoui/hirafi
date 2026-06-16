const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Le nom est requis'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'L\'email est requis'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Le mot de passe est requis'],
        minlength: [6, 'Le mot de passe doit avoir au moins 6 caractères'],
        select: false
    },
    role: {
        type: String,
        enum: ['client', 'freelancer', 'admin'],
        default: 'client'
    },
    phone: {
        type: String,
        default: ''
    },
    city: {
        type: String,
        default: ''
    },
    avatar: {
        type: String,
        default: 'https://ui-avatars.com/api/?background=0D8F81&color=fff&bold=true'
    },
    bio: {
        type: String,
        default: ''
    },
    skills: [{
        type: String,
        trim: true
    }],
    hourlyRate: {
        type: Number,
        default: 0
    },
    balance: {
        type: Number,
        default: 0
    },
    totalOrders: {
        type: Number,
        default: 0
    },
    totalEarnings: {
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
    isActive: {
        type: Boolean,
        default: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    lastLogin: {
        type: Date
    }
}, {
    timestamps: true
});

// ========== VERSION CORRIGÉE DU MIDDLEWARE ==========
// استخدمنا function عادية بدل async/await
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// ========== VERSION CORRIGÉE DE COMPARE PASSWORD ==========
// استخدمنا function عادية مع callback
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Version simplifiée pour utiliser avec async/await
// userSchema.methods.comparePasswordAsync = async function(candidatePassword) {
//     return await bcrypt.compare(candidatePassword, this.password);
// };

// Vérifier si freelancer
userSchema.methods.isFreelancer = function() {
    return this.role === 'freelancer';
};

// Vérifier si client
userSchema.methods.isClient = function() {
    return this.role === 'client';
};

// Vérifier si admin
userSchema.methods.isAdmin = function() {
    return this.role === 'admin';
};

// Ajouter au solde
userSchema.methods.addToBalance = async function(amount) {
    this.balance += amount;
    await this.save();
    return this.balance;
};

// Déduire du solde
userSchema.methods.deductFromBalance = async function(amount) {
    if (this.balance < amount) {
        throw new Error('Solde insuffisant');
    }
    this.balance -= amount;
    await this.save();
    return this.balance;
};

module.exports = mongoose.model('User', userSchema);