// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Accès non autorisé. Veuillez vous connecter.'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await User.findById(decoded.id).select('-password');
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Utilisateur non trouvé. Token invalide.'
            });
        }

        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Votre compte a été désactivé. Veuillez contacter l\'administrateur.'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Token invalide.'
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expiré. Veuillez vous reconnecter.'
            });
        }
        
        return res.status(401).json({
            success: false,
            message: 'Non autorisé.'
        });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: 'Accès refusé. Droits administrateur requis.'
        });
    }
};

const freelancer = (req, res, next) => {
    if (req.user && req.user.role === 'freelancer') {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: 'Accès refusé. Compte freelancer requis.'
        });
    }
};

const client = (req, res, next) => {
    if (req.user && req.user.role === 'client') {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: 'Accès refusé. Compte client requis.'
        });
    }
};

module.exports = { protect, admin, freelancer, client };