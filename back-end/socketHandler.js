// socketHandler.js
const Message = require('../models/Message');
const Notification = require('../models/Notification');

const onlineUsers = new Map();

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('🟢 Client connecté:', socket.id);

        socket.on('authenticate', (userId) => {
            onlineUsers.set(userId, socket.id);
            console.log(`✅ Utilisateur ${userId} authentifié`);
            io.emit('online_users', Array.from(onlineUsers.keys()));
        });

        socket.on('private_message', async (data) => {
            const { senderId, receiverId, message, orderId, tempId } = data;
            console.log(`📨 Message de ${senderId} à ${receiverId}: ${message}`);
            
            try {
                const newMessage = await Message.create({
                    senderId, 
                    receiverId, 
                    orderId, 
                    content: message
                });
                
                const populatedMessage = await Message.findById(newMessage._id)
                    .populate('senderId', 'name avatar')
                    .populate('receiverId', 'name avatar');
                
                const receiverSocketId = onlineUsers.get(receiverId);
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit('new_message', populatedMessage);
                    console.log(`📤 Message envoyé à ${receiverId}`);
                }
                
                socket.emit('message_sent', { ...populatedMessage.toObject(), tempId });
                
            } catch (error) {
                console.error('❌ Erreur message:', error);
                socket.emit('message_error', { tempId, error: error.message });
            }
        });

        socket.on('disconnect', () => {
            for (const [userId, socketId] of onlineUsers.entries()) {
                if (socketId === socket.id) {
                    onlineUsers.delete(userId);
                    io.emit('online_users', Array.from(onlineUsers.keys()));
                    console.log(`🔴 Utilisateur ${userId} déconnecté`);
                    break;
                }
            }
        });
    });
};