// controllers/notificationController.js

const Notification = require('../models/Notification');

// @desc    Obtenir mes notifications
// @route   GET /api/notifications
const getNotifications = async (req, res) => {
    try {
        const { page = 1, limit = 20, unreadOnly = false } = req.query;
        
        const filter = { userId: req.user._id };
        if (unreadOnly === 'true') filter.isRead = false;
        
        const skip = (page - 1) * limit;
        const total = await Notification.countDocuments(filter);
        
        const notifications = await Notification.find(filter)
            .sort('-createdAt')
            .skip(skip)
            .limit(Number(limit));
        
        const unreadCount = await Notification.countDocuments({ userId: req.user._id, isRead: false });
        
        res.json({ success: true, notifications, unreadCount, pagination: { total, page: Number(page), pages: Math.ceil(total / limit) } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Marquer une notification comme lue
// @route   PUT /api/notifications/:id/read
const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification non trouvée' });
        }
        
        if (notification.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Non autorisé' });
        }
        
        notification.isRead = true;
        notification.readAt = new Date();
        await notification.save();
        
        res.json({ success: true, message: 'Notification marquée comme lue' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Marquer toutes comme lues
// @route   PUT /api/notifications/read-all
const markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { userId: req.user._id, isRead: false },
            { isRead: true, readAt: new Date() }
        );
        res.json({ success: true, message: 'Toutes les notifications sont lues' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Supprimer une notification
// @route   DELETE /api/notifications/:id
const deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification non trouvée' });
        }
        
        if (notification.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Non autorisé' });
        }
        
        await notification.deleteOne();
        res.json({ success: true, message: 'Notification supprimée' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getNotifications, markAsRead, markAllAsRead, deleteNotification };