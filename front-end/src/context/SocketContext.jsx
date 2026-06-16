// import React, { createContext, useContext, useEffect, useState } from 'react';
// import io from 'socket.io-client';
// import { useAuth } from './AuthContext';

// const SocketContext = createContext(null);

// export const useSocket = () => {
//     const context = useContext(SocketContext);
//     if (!context) {
//         throw new Error('useSocket must be used within SocketProvider');
//     }
//     return context;
// };

// export const SocketProvider = ({ children }) => {
//     const [socket, setSocket] = useState(null);
//     const [isConnected, setIsConnected] = useState(false);
//     const { user, isAuthenticated } = useAuth();

//     useEffect(() => {
//         if (!isAuthenticated || !user) return;

//         const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
//         const newSocket = io(SOCKET_URL, {
//             transports: ['websocket'],
//             withCredentials: true
//         });

//         newSocket.on('connect', () => {
//             console.log('🟢 Socket connecté');
//             setIsConnected(true);
//             newSocket.emit('authenticate', user._id);
//         });

//         newSocket.on('disconnect', () => {
//             console.log('🔴 Socket déconnecté');
//             setIsConnected(false);
//         });

//         setSocket(newSocket);

//         return () => {
//             newSocket.close();
//         };
//     }, [isAuthenticated, user]);

//     const sendMessage = (receiverId, message, orderId = null) => {
//         if (socket && isConnected) {
//             socket.emit('private_message', {
//                 senderId: user?._id,
//                 receiverId,
//                 message,
//                 orderId,
//                 tempId: Date.now().toString()
//             });
//         }
//     };

//     const joinRoom = (roomId) => {
//         if (socket && isConnected) {
//             socket.emit('join_room', roomId);
//         }
//     };

//     const leaveRoom = (roomId) => {
//         if (socket && isConnected) {
//             socket.emit('leave_room', roomId);
//         }
//     };

//     const sendTyping = (receiverId, isTyping) => {
//         if (socket && isConnected) {
//             socket.emit('typing', {
//                 receiverId,
//                 senderId: user?._id,
//                 isTyping
//             });
//         }
//     };

//     const onEvent = (event, callback) => {
//         if (socket) {
//             socket.on(event, callback);
//             return () => socket.off(event, callback);
//         }
//         return () => {};
//     };

//     const value = {
//         socket,
//         isConnected,
//         sendMessage,
//         joinRoom,
//         leaveRoom,
//         sendTyping,
//         onEvent
//     };

//     return React.createElement(SocketContext.Provider, { value }, children);
// };

// export default SocketContext;