// controllers/uploadController.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuration multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/services/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
        cb(null, true);
    } else {
        cb(new Error('Seules les images sont autorisées'));
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: fileFilter
});

// @desc    Upload d'une image
// @route   POST /api/upload
// @access  Private
const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Aucun fichier uploadé' });
        }
        
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const imageUrl = `${baseUrl}/uploads/services/${req.file.filename}`;
        
        res.json({
            success: true,
            url: imageUrl,
            message: 'Image uploadée avec succès'
        });
    } catch (error) {
        console.error('Erreur upload:', error);
        res.status(500).json({ success: false, message: 'Erreur lors de l\'upload' });
    }
};

// @desc    Upload multiple images
// @route   POST /api/upload/multiple
// @access  Private
const uploadMultipleImages = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, message: 'Aucun fichier uploadé' });
        }
        
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const imageUrls = req.files.map(file => `${baseUrl}/uploads/services/${file.filename}`);
        
        res.json({
            success: true,
            urls: imageUrls,
            message: `${imageUrls.length} image(s) uploadée(s) avec succès`
        });
    } catch (error) {
        console.error('Erreur upload multiple:', error);
        res.status(500).json({ success: false, message: 'Erreur lors de l\'upload' });
    }
};

module.exports = { uploadImage, uploadMultipleImages, upload };