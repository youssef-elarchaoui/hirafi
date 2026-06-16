const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    // Vérifier si le token existe dans le header Authorization
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // Vérifier si le token est fourni
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Accès non autorisé. Veuillez vous connecter.'
        });
    }

    try {
        // Vérifier et décoder le token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Récupérer l'utilisateur
        const user = await User.findById(decoded.id).select('-password');
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Utilisateur non trouvé. Token invalide.'
            });
        }

        // Vérifier si le compte est actif
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Votre compte a été désactivé. Veuillez contacter l\'administrateur.'
            });
        }

        // Ajouter l'utilisateur à l'objet request
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

// Middleware pour vérifier si l'utilisateur est admin
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

// Middleware pour vérifier si l'utilisateur est freelancer
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

// Middleware pour vérifier si l'utilisateur est client
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