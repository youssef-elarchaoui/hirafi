// server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: ['http://localhost:5173', 'http://localhost:3000'], credentials: true }
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/services', require('./routes/service.routes'));
app.use('/api/orders', require('./routes/order.routes'));
app.use('/api/reviews', require('./routes/review.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/payments', require('./routes/payment.routes'));
app.use('/api/chat', require('./routes/chat.routes'));
app.use('/api/notifications', require('./routes/notification.routes'));
app.use('/api/dashboard', require('./routes/dashboard.routes'));

// Test route
app.get('/', (req, res) => {
    res.json({ success: true, message: 'API Hirafi fonctionne!' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: `Route ${req.originalUrl} non trouvée` });
});

// ========== WEBSOCKET ==========
const onlineUsers = new Map();

io.on('connection', (socket) => {
    console.log('🟢 Client connecté:', socket.id);

    socket.on('authenticate', (userId) => {
        onlineUsers.set(userId, socket.id);
        console.log(`✅ Utilisateur ${userId} en ligne`);
        socket.broadcast.emit('user_online', { userId });
    });

    socket.on('join_room', (roomId) => {
        socket.join(roomId);
    });

    socket.on('leave_room', (roomId) => {
        socket.leave(roomId);
    });

    socket.on('private_message', async (data) => {
        const { senderId, receiverId, message, orderId, tempId } = data;
        
        const Message = require('./models/Message');
        const Notification = require('./models/Notification');
        
        try {
            const newMessage = await Message.create({ senderId, receiverId, orderId, content: message });
            
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
                referenceId: newMessage._id,
                referenceType: 'message',
                icon: '💬'
            });
            
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('new_notification', {
                    title: 'Nouveau message',
                    message: `${populatedMessage.senderId.name} vous a envoyé un message`
                });
            }
        } catch (error) {
            socket.emit('message_error', { tempId, error: error.message });
        }
    });

    socket.on('typing', (data) => {
        const { receiverId, senderId, isTyping } = data;
        const receiverSocketId = onlineUsers.get(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('user_typing', { userId: senderId, isTyping });
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

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB connecté'))
    .catch(err => console.log('❌ MongoDB erreur:', err.message));

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Serveur sur http://localhost:${PORT}`);
});