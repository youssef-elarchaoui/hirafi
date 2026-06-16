const User = require('../models/User');
const jwt = require('jsonwebtoken');

// توليد التوكن JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '30d'
    });
};

// @desc    تسجيل مستخدم جديد (Register)
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
    try {
        const { 
            name, 
            email, 
            password, 
            role, 
            phone, 
            city, 
            skills, 
            hourlyRate 
        } = req.body;

        // التحقق من وجود البريد الإلكتروني
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Veuillez fournir un email et un mot de passe'
            });
        }

        // التحقق من طول كلمة المرور
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Le mot de passe doit contenir au moins 6 caractères'
            });
        }

        // التحقق من وجود المستخدم
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'Cet email est déjà utilisé'
            });
        }

        // التحقق من صحة الدور
        const allowedRoles = ['client', 'freelancer','admin'];
        const userRole = role && allowedRoles.includes(role) ? role : 'client';

        // إنشاء المستخدم
        const user = await User.create({
            name: name || 'Utilisateur',
            email,
            password,
            role: userRole,
            phone: phone || '',
            city: city || '',
            skills: skills || [],
            hourlyRate: hourlyRate || 0
        });

        // إرسال الرد
        res.status(201).json({
            success: true,
            message: 'Inscription réussie ! Bienvenue sur Hirafi.',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                city: user.city,
                avatar: user.avatar,
                skills: user.skills,
                hourlyRate: user.hourlyRate,
                balance: user.balance,
                isVerified: user.isVerified
            },
            token: generateToken(user._id)
        });

    } catch (error) {
        console.error('Erreur register:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'inscription',
            error: error.message
        });
    }
};

// @desc    تسجيل الدخول (Login)
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // التحقق من وجود البيانات
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Veuillez fournir un email et un mot de passe'
            });
        }

        // البحث عن المستخدم مع كلمة المرور
        const user = await User.findOne({ email }).select('+password');

        // التحقق من وجود المستخدم
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Email ou mot de passe incorrect'
            });
        }

        // مقارنة كلمة المرور (استخدام الطريقة المتزامنة)
        const isPasswordCorrect = await user.comparePassword(password);
        
        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: 'Email ou mot de passe incorrect'
            });
        }

        // التحقق من أن الحساب نشط
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Votre compte a été désactivé. Veuillez contacter l\'administrateur.'
            });
        }

        // تحديث آخر تسجيل دخول
        user.lastLogin = new Date();
        await user.save();

        // إرسال الرد
        res.status(200).json({
            success: true,
            message: 'Connexion réussie !',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                city: user.city,
                avatar: user.avatar,
                bio: user.bio,
                skills: user.skills,
                hourlyRate: user.hourlyRate,
                balance: user.balance,
                rating: user.rating,
                totalOrders: user.totalOrders,
                totalEarnings: user.totalEarnings,
                isVerified: user.isVerified
            },
            token: generateToken(user._id)
        });

    } catch (error) {
        console.error('Erreur login:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la connexion',
            error: error.message
        });
    }
};

// @desc    الحصول على الملف الشخصي (Get Profile)
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }

        res.status(200).json({
            success: true,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                city: user.city,
                avatar: user.avatar,
                bio: user.bio,
                skills: user.skills,
                hourlyRate: user.hourlyRate,
                balance: user.balance,
                rating: user.rating,
                ratingCount: user.ratingCount,
                totalOrders: user.totalOrders,
                totalEarnings: user.totalEarnings,
                isActive: user.isActive,
                isVerified: user.isVerified,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error('Erreur getMe:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération du profil'
        });
    }
};

// @desc    تحديث الملف الشخصي (Update Profile)
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
    try {
        const { name, phone, city, bio, skills, hourlyRate } = req.body;
        
        const user = await User.findById(req.user._id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }

        // تحديث الحقول
        if (name) user.name = name;
        if (phone) user.phone = phone;
        if (city) user.city = city;
        if (bio) user.bio = bio;
        if (skills) user.skills = skills;
        if (hourlyRate && user.role === 'freelancer') user.hourlyRate = hourlyRate;
        
        await user.save();
        
        res.status(200).json({
            success: true,
            message: 'Profil mis à jour avec succès',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                city: user.city,
                avatar: user.avatar,
                bio: user.bio,
                skills: user.skills,
                hourlyRate: user.hourlyRate,
                balance: user.balance
            }
        });
    } catch (error) {
        console.error('Erreur updateProfile:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la mise à jour du profil'
        });
    }
};

// @desc    تغيير كلمة المرور (Change Password)
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Veuillez fournir le mot de passe actuel et le nouveau mot de passe'
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Le nouveau mot de passe doit contenir au moins 6 caractères'
            });
        }

        // البحث عن المستخدم مع كلمة المرور
        const user = await User.findById(req.user._id).select('+password');

        // التحقق من كلمة المرور الحالية
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Mot de passe actuel incorrect'
            });
        }

        // تحديث كلمة المرور
        user.password = newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Mot de passe changé avec succès'
        });
    } catch (error) {
        console.error('Erreur changePassword:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors du changement de mot de passe'
        });
    }
};

module.exports = {
    register,
    login,
    getMe,
    updateProfile,
    changePassword
};