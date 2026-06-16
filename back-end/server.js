// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const userRoutes = require('./routes/user.routes');

dotenv.config();

const app = express();
const server = http.createServer(app);

// Configuration Socket.io avec CORS
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173', 'http://localhost:3000'],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE']
    },
    transports: ['websocket', 'polling'], // Ajouter polling comme fallback
    allowEIO3: true
});

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true
}));
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
app.use('/api/users', userRoutes);

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
        // Envoyer la liste des utilisateurs en ligne
        io.emit('online_users', Array.from(onlineUsers.keys()));
    });

    socket.on('join_room', (roomId) => {
        socket.join(roomId);
        console.log(`📦 Socket ${socket.id} a rejoint la room ${roomId}`);
    });

    socket.on('leave_room', (roomId) => {
        socket.leave(roomId);
        console.log(`📦 Socket ${socket.id} a quitté la room ${roomId}`);
    });

    socket.on('private_message', async (data) => {
        const { senderId, receiverId, message, orderId, tempId } = data;
        
        try {
            const Message = require('./models/Message');
            const Notification = require('./models/Notification');
            
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
            }
            
            socket.emit('message_sent', { ...populatedMessage.toObject(), tempId });
            
            // Créer une notification
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
            
            // Envoyer notification en temps réel
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('new_notification', {
                    title: 'Nouveau message',
                    message: `${populatedMessage.senderId.name} vous a envoyé un message`
                });
            }
        } catch (error) {
            console.error('Erreur message:', error);
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
        console.log('🔴 Client déconnecté:', socket.id);
        for (const [userId, socketId] of onlineUsers.entries()) {
            if (socketId === socket.id) {
                onlineUsers.delete(userId);
                socket.broadcast.emit('user_offline', { userId });
                io.emit('online_users', Array.from(onlineUsers.keys()));
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
    console.log(`🔌 Socket.io sur ws://localhost:${PORT}`);
});

// Exporter io pour l'utiliser dans d'autres fichiers
module.exports = { io, server };