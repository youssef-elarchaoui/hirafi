// routes/uploadRoutes.js
const express = require('express');
const router = express.Router();
const { uploadImage, uploadMultipleImages, upload } = require('../controllers/uploadController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, upload.single('image'), uploadImage);
router.post('/multiple', protect, upload.array('images', 10), uploadMultipleImages);

module.exports = router;