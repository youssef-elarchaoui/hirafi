// src/context/SocketProvider.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from '../hooks/useAuth';

const SocketContext = createContext(null);

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within SocketProvider');
    }
    return context;
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const { user, isAuthenticated, loading } = useAuth();

    useEffect(() => {
        console.log('🔄 SocketProvider - isAuthenticated:', isAuthenticated);
        console.log('🔄 SocketProvider - loading:', loading);
        console.log('🔄 SocketProvider - user:', user?._id);

        // ✅ Attendre que l'authentification soit terminée
        if (loading) {
            console.log('⏳ Auth en cours de chargement...');
            return;
        }

        if (!isAuthenticated || !user) {
            console.log('⏳ Utilisateur non authentifié, attente...');
            return;
        }

        const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
        console.log('🔄 Connexion Socket à:', SOCKET_URL);
        
        // ✅ Fermer l'ancien socket s'il existe
        if (socket) {
            socket.disconnect();
        }
        
        const newSocket = io(SOCKET_URL, {
            transports: ['websocket', 'polling'],
            withCredentials: true,
            reconnection: true,
            reconnectionAttempts: 10,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            timeout: 20000,
        });

        newSocket.on('connect', () => {
            console.log('🟢 Socket connecté avec ID:', newSocket.id);
            setIsConnected(true);
            newSocket.emit('authenticate', user._id);
        });

        newSocket.on('connect_error', (error) => {
            console.error('❌ Socket connect_error:', error.message);
            setIsConnected(false);
        });

        newSocket.on('disconnect', (reason) => {
            console.log('🔴 Socket déconnecté:', reason);
            setIsConnected(false);
        });

        newSocket.on('reconnect', (attemptNumber) => {
            console.log(`🔄 Socket reconnecté après ${attemptNumber} tentatives`);
            setIsConnected(true);
            if (user?._id) {
                newSocket.emit('authenticate', user._id);
            }
        });

        setSocket(newSocket);

        return () => {
            console.log('🧹 Nettoyage du socket');
            if (newSocket) {
                newSocket.disconnect();
                newSocket.close();
            }
        };
    }, [isAuthenticated, user, loading]);

    const sendMessage = (receiverId, message, orderId = null) => {
        if (socket && isConnected) {
            socket.emit('private_message', {
                senderId: user?._id,
                receiverId,
                message,
                orderId,
                tempId: Date.now().toString()
            });
        } else {
            console.warn('⚠️ Socket non connecté, message non envoyé');
        }
    };

    const joinRoom = (roomId) => {
        if (socket && isConnected) {
            socket.emit('join_room', roomId);
        }
    };

    const leaveRoom = (roomId) => {
        if (socket && isConnected) {
            socket.emit('leave_room', roomId);
        }
    };

    const sendTyping = (receiverId, isTyping) => {
        if (socket && isConnected) {
            socket.emit('typing', {
                receiverId,
                senderId: user?._id,
                isTyping
            });
        }
    };

    const onEvent = (event, callback) => {
        if (socket) {
            socket.on(event, callback);
            return () => socket.off(event, callback);
        }
        return () => {};
    };

    const value = {
        socket,
        isConnected,
        sendMessage,
        joinRoom,
        leaveRoom,
        sendTyping,
        onEvent
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketContext;