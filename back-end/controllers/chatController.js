const Message = require('../models/Message');
const User = require('../models/User');
const Order = require('../models/Order');

// @desc    Obtenir les conversations
// @route   GET /api/chat/conversations
const getConversations = async (req, res) => {
    try {
        const userId = req.user._id;
        
        const messages = await Message.find({
            $or: [{ senderId: userId }, { receiverId: userId }],
            isDeleted: false
        }).sort('-createdAt');
        
        const interlocutorIds = new Set();
        messages.forEach(msg => {
            if (msg.senderId.toString() !== userId.toString()) {
                interlocutorIds.add(msg.senderId.toString());
            }
            if (msg.receiverId.toString() !== userId.toString()) {
                interlocutorIds.add(msg.receiverId.toString());
            }
        });
        
        const conversations = [];
        for (const id of interlocutorIds) {
            const user = await User.findById(id).select('name email avatar role');
            if (user) {
                const lastMessage = await Message.findOne({
                    $or: [
                        { senderId: userId, receiverId: id },
                        { senderId: id, receiverId: userId }
                    ],
                    isDeleted: false
                }).sort('-createdAt');
                
                const unreadCount = await Message.countDocuments({
                    senderId: id,
                    receiverId: userId,
                    isRead: false,
                    isDeleted: false
                });
                
                conversations.push({
                    user,
                    lastMessage,
                    unreadCount,
                    updatedAt: lastMessage?.createdAt || user.createdAt
                });
            }
        }
        
        conversations.sort((a, b) => b.updatedAt - a.updatedAt);
        
        res.json({ success: true, conversations });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Obtenir les messages avec un utilisateur
// @route   GET /api/chat/messages/:userId
const getMessages = async (req, res) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user._id;
        const { page = 1, limit = 50 } = req.query;
        
        const skip = (page - 1) * limit;
        
        const messages = await Message.find({
            $or: [
                { senderId: currentUserId, receiverId: userId },
                { senderId: userId, receiverId: currentUserId }
            ],
            isDeleted: false
        })
            .populate('senderId', 'name avatar role')
            .populate('receiverId', 'name avatar role')
            .sort('-createdAt')
            .skip(skip)
            .limit(Number(limit));
        
        // Marquer comme lus
        await Message.updateMany(
            { senderId: userId, receiverId: currentUserId, isRead: false },
            { isRead: true, readAt: new Date() }
        );
        
        res.json({ success: true, messages: messages.reverse(), hasMore: messages.length === limit });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Obtenir les messages d'une commande
// @route   GET /api/chat/orders/:orderId/messages
const getOrderMessages = async (req, res) => {
    try {
        const { orderId } = req.params;
        const currentUserId = req.user._id;
        
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Commande non trouvée' });
        }
        
        if (order.clientId.toString() !== currentUserId.toString() &&
            order.freelancerId.toString() !== currentUserId.toString()) {
            return res.status(403).json({ success: false, message: 'Non autorisé' });
        }
        
        const messages = await Message.find({ orderId, isDeleted: false })
            .populate('senderId', 'name avatar role')
            .sort('createdAt');
        
        res.json({ success: true, messages });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Supprimer un message
// @route   DELETE /api/chat/messages/:id
const deleteMessage = async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);
        if (!message) {
            return res.status(404).json({ success: false, message: 'Message non trouvé' });
        }
        
        if (message.senderId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Non autorisé' });
        }
        
        message.isDeleted = true;
        await message.save();
        
        res.json({ success: true, message: 'Message supprimé' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getConversations, getMessages, getOrderMessages, deleteMessage };