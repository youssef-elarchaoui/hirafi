const Message = require('../models/Message');
const Notification = require('../models/Notification');

const onlineUsers = new Map();

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('🟢 Client connecté:', socket.id);

        socket.on('authenticate', (userId) => {
            onlineUsers.set(userId, socket.id);
            socket.broadcast.emit('user_online', { userId });
        });

        socket.on('private_message', async (data) => {
            const { senderId, receiverId, message, orderId, tempId } = data;
            
            try {
                const newMessage = await Message.create({
                    senderId, receiverId, orderId, content: message
                });
                
                const populatedMessage = await Message.findById(newMessage._id)
                    .populate('senderId', 'name avatar')
                    .populate('receiverId', 'name avatar');
                
                const receiverSocketId = onlineUsers.get(receiverId);
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit('new_message', populatedMessage);
                }
                
                socket.emit('message_sent', { ...populatedMessage.toObject(), tempId });
                
                await Notification.create({
                    userId: receiverId,
                    type: 'new_message',
                    title: 'Nouveau message',
                    message: `${populatedMessage.senderId.name} vous a envoyé un message`,
                    link: `/chat/${senderId}`,
                    icon: '💬'
                });
                
            } catch (error) {
                socket.emit('message_error', { tempId, error: error.message });
            }
        });

        socket.on('disconnect', () => {
            for (const [userId, socketId] of onlineUsers.entries()) {
                if (socketId === socket.id) {
                    onlineUsers.delete(userId);
                    socket.broadcast.emit('user_offline', { userId });
                    break;
                }
            }
        });
    });
};