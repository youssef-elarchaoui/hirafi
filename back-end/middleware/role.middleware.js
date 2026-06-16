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

module.exports = { admin, freelancer, client };