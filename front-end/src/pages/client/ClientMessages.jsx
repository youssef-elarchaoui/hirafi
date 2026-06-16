// src/pages/client/ClientMessages.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { chatApi } from '../../api/chatApi';
import { orderApi } from '../../api/orderApi';
import toast from 'react-hot-toast';
import  { Link } from 'react-router-dom';
import { 
  FiSend, FiSearch, FiUser, FiClock, FiMessageSquare,
  FiChevronLeft, FiChevronRight, FiPaperclip, FiSmile,
  FiCheck, FiMoreVertical, FiPhone,
  FiVideo, FiInfo, FiX, FiRefreshCw, FiArrowLeft
} from 'react-icons/fi';
import { useSocket } from '../../context/SocketContext';

const ClientMessages = () => {
    const { user } = useAuth();
    const { socket, isConnected, sendMessage, joinRoom, leaveRoom, sendTyping, onEvent } = useSocket();
    const [conversations, setConversations] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [typingUsers, setTypingUsers] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [orders, setOrders] = useState([]);
    
    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const messagesContainerRef = useRef(null);

    // DEBUG: Afficher l'état du socket
    useEffect(() => {
        console.log('=== SOCKET DEBUG ===');
        console.log('Socket existe?', !!socket);
        console.log('Socket connecté?', isConnected);
        console.log('Utilisateur ID:', user?._id);
        console.log('Socket ID:', socket?.id);
    }, [socket, isConnected, user]);

    // Écouter les événements Socket
    useEffect(() => {
        if (!socket) {
            console.log('⚠️ Socket non disponible');
            return;
        }

        console.log('📡 Écoute des événements Socket...');

        const handleNewMessage = (message) => {
            console.log('📩 Nouveau message reçu:', message);
            if (selectedUser && 
                ((message.senderId?._id === selectedUser._id || message.receiverId?._id === selectedUser._id))) {
                setMessages(prev => [...prev, message]);
                setTimeout(() => {
                    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
            fetchConversations();
        };

        const handleMessageSent = (message) => {
            console.log('✅ Message envoyé:', message);
        };

        const handleMessageError = ({ tempId, error }) => {
            toast.error('Erreur lors de l\'envoi du message');
        };

        const handleUserTyping = ({ userId, isTyping }) => {
            if (isTyping) {
                setTypingUsers(prev => [...new Set([...prev, userId])]);
            } else {
                setTypingUsers(prev => prev.filter(id => id !== userId));
            }
        };

        const handleUserOnline = ({ userId }) => {
            setOnlineUsers(prev => [...new Set([...prev, userId])]);
        };

        const handleUserOffline = ({ userId }) => {
            setOnlineUsers(prev => prev.filter(id => id !== userId));
        };

        socket.on('new_message', handleNewMessage);
        socket.on('message_sent', handleMessageSent);
        socket.on('message_error', handleMessageError);
        socket.on('user_typing', handleUserTyping);
        socket.on('user_online', handleUserOnline);
        socket.on('user_offline', handleUserOffline);

        return () => {
            socket.off('new_message', handleNewMessage);
            socket.off('message_sent', handleMessageSent);
            socket.off('message_error', handleMessageError);
            socket.off('user_typing', handleUserTyping);
            socket.off('user_online', handleUserOnline);
            socket.off('user_offline', handleUserOffline);
        };
    }, [socket, selectedUser]);

    // Charger les conversations
    useEffect(() => {
        fetchConversations();
        fetchOrders();
    }, []);

    // Charger les messages d'une conversation
    useEffect(() => {
        if (selectedUser) {
            fetchMessages(selectedUser._id);
            const roomId = [user?._id, selectedUser._id].sort().join('_');
            joinRoom(roomId);
        }
    }, [selectedUser]);

    // Scroll to bottom
    useEffect(() => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }, [messages]);

    const fetchConversations = async () => {
        try {
            const response = await chatApi.getConversations();
            setConversations(response.data.conversations || []);
            setLoading(false);
        } catch (error) {
            console.error('Erreur:', error);
            toast.error('Impossible de charger les conversations');
            setLoading(false);
        }
    };

    const fetchMessages = async (userId, reset = true) => {
        setLoadingMessages(true);
        try {
            const response = await chatApi.getMessages(userId, reset ? 1 : page, 50);
            const newMessages = response.data.messages || [];
            
            if (reset) {
                setMessages(newMessages);
                setPage(1);
                setHasMore(newMessages.length >= 50);
            } else {
                setMessages(prev => [...newMessages, ...prev]);
                setHasMore(newMessages.length >= 50);
            }
        } catch (error) {
            console.error('Erreur:', error);
            toast.error('Impossible de charger les messages');
        } finally {
            setLoadingMessages(false);
        }
    };

    const fetchOrders = async () => {
        try {
            const response = await orderApi.getMyOrders();
            setOrders(response.data.orders || []);
            console.log('Commandes chargées:', response.data.orders?.length || 0);
        } catch (error) {
            console.error('Erreur chargement commandes:', error);
        }
    };

    const sendMessageHandler = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedUser) return;
        
        if (!isConnected) {
            toast.error('Vous n\'êtes pas connecté au serveur de chat');
            return;
        }
        
        const tempId = Date.now().toString();
        const messageContent = newMessage.trim();
        
        const tempMessage = {
            _id: tempId,
            senderId: { _id: user._id, name: user.name, avatar: user.avatar },
            receiverId: { _id: selectedUser._id },
            content: messageContent,
            createdAt: new Date().toISOString(),
            status: 'sending'
        };
        setMessages(prev => [...prev, tempMessage]);
        setNewMessage('');
        
        sendMessage(selectedUser._id, messageContent, selectedOrderId);
        
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const handleTyping = (e) => {
        const value = e.target.value;
        setNewMessage(value);
        
        if (!isTyping && value.length > 0 && selectedUser) {
            setIsTyping(true);
            sendTyping(selectedUser._id, true);
        }
        
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            if (isTyping) {
                setIsTyping(false);
                sendTyping(selectedUser._id, false);
            }
        }, 1000);
    };

    const loadMoreMessages = () => {
        if (hasMore && !loadingMessages && selectedUser) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchMessages(selectedUser._id, false);
        }
    };

    const formatDate = (date) => {
        const now = new Date();
        const msgDate = new Date(date);
        const diff = now - msgDate;
        
        if (diff < 60000) return 'À l\'instant';
        if (diff < 3600000) return `${Math.floor(diff / 60000)} min`;
        if (diff < 86400000) return msgDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        if (diff < 604800000) return msgDate.toLocaleDateString('fr-FR', { weekday: 'long' });
        return msgDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    };

    const isUserOnline = (userId) => {
        return onlineUsers.includes(userId);
    };

    const getLastMessage = (conversation) => {
        return conversation.lastMessage?.content || 'Aucun message';
    };

    const filteredConversations = conversations.filter(conv => 
        conv.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conv.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectedUserName = selectedUser?.name || '';
    const selectedUserAvatar = selectedUser?.avatar || `https://ui-avatars.com/api/?background=3D5A3E&color=fff&bold=true&name=${selectedUserName}`;
    const isSelectedUserOnline = selectedUser && isUserOnline(selectedUser._id);

    const groupMessagesByDate = (messages) => {
        const groups = {};
        messages.forEach(msg => {
            const date = new Date(msg.createdAt).toLocaleDateString('fr-FR');
            if (!groups[date]) groups[date] = [];
            groups[date].push(msg);
        });
        return groups;
    };

    const messageGroups = groupMessagesByDate(messages);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <div className="relative w-12 h-12">
                    <div className="absolute inset-0 border-3 border-[#E8EDE6] rounded-full"></div>
                    <div className="absolute inset-0 border-3 border-[#3D5A3E] border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-200px)] min-h-[500px] bg-white rounded-2xl border border-[#E8E2D9] overflow-hidden flex relative">
            
            {!isConnected && (
                <div className="absolute top-0 left-0 right-0 z-20 bg-yellow-50 border-b border-yellow-200 px-4 py-2 text-center">
                    <span className="text-yellow-700 text-sm flex items-center justify-center gap-2">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                        Connexion au serveur de chat en cours...
                    </span>
                </div>
            )}
            
            {/* COLONNE GAUCHE - CONVERSATIONS */}
            <div className={`${selectedUser ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-80 lg:w-96 border-r border-[#E8E2D9] ${!isConnected ? 'pt-10' : ''}`}>
                <div className="p-4 border-b border-[#E8E2D9]">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="font-heading font-bold text-[#1A1208] flex items-center gap-2">
                            <FiMessageSquare size={18} className="text-[#3D5A3E]" />
                            Messages
                            <span className="text-xs font-normal text-[#6B5E4F]">({conversations.length})</span>
                        </h2>
                        <button 
                            onClick={fetchConversations}
                            className="p-1.5 rounded-lg hover:bg-[#E8EDE6] transition-colors"
                            title="Actualiser"
                        >
                            <FiRefreshCw size={16} className="text-[#6B5E4F]" />
                        </button>
                    </div>
                    <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9B9082]" size={16} />
                        <input
                            type="text"
                            placeholder="Rechercher une conversation..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl focus:outline-none focus:border-[#3D5A3E] transition-all text-sm"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {filteredConversations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center p-6">
                            <div className="text-5xl mb-4">💬</div>
                            <h3 className="font-heading font-semibold text-[#1A1208] mb-2">
                                Aucune conversation
                            </h3>
                            <p className="text-[#6B5E4F] text-sm">
                                {searchTerm ? 'Aucun résultat trouvé' : 'Commencez à discuter avec les artisans'}
                            </p>
                            <Link to="/services" className="mt-4 text-[#3D5A3E] hover:underline text-sm">
                                Explorer les services
                            </Link>
                        </div>
                    ) : (
                        filteredConversations.map((conv) => (
                            <button
                                key={conv.user._id}
                                onClick={() => {
                                    setSelectedUser(conv.user);
                                    setMessages([]);
                                }}
                                className={`w-full flex items-start gap-3 p-3 hover:bg-[#FAF8F5] transition-all border-b border-[#E8E2D9] ${
                                    selectedUser?._id === conv.user._id ? 'bg-[#E8EDE6]' : ''
                                }`}
                            >
                                <div className="relative flex-shrink-0">
                                    <img 
                                        src={conv.user?.avatar || `https://ui-avatars.com/api/?background=3D5A3E&color=fff&bold=true&name=${conv.user?.name || 'U'}`}
                                        alt={conv.user?.name}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    {isUserOnline(conv.user._id) && (
                                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                                    )}
                                </div>
                                <div className="flex-1 text-left min-w-0">
                                    <div className="flex justify-between items-start">
                                        <span className="font-medium text-[#1A1208] text-sm truncate">
                                            {conv.user?.name || 'Artisan'}
                                        </span>
                                        {conv.lastMessage?.createdAt && (
                                            <span className="text-xs text-[#9B9082] flex-shrink-0 ml-2">
                                                {formatDate(conv.lastMessage.createdAt)}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-[#6B5E4F] truncate max-w-[150px]">
                                            {getLastMessage(conv)}
                                        </span>
                                        {conv.unreadCount > 0 && (
                                            <span className="ml-2 px-1.5 py-0.5 bg-[#3D5A3E] text-white text-[10px] rounded-full flex-shrink-0">
                                                {conv.unreadCount}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* COLONNE DROITE - CHAT */}
            {selectedUser ? (
                <div className="flex-1 flex flex-col">
                    <div className={`flex items-center justify-between p-3 border-b border-[#E8E2D9] bg-[#FAF8F5] ${!isConnected ? 'pt-12' : ''}`}>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="md:hidden p-1 rounded-lg hover:bg-[#E8EDE6] transition-colors"
                            >
                                <FiArrowLeft size={20} />
                            </button>
                            <div className="relative">
                                <img 
                                    src={selectedUserAvatar}
                                    alt={selectedUserName}
                                    className="w-9 h-9 rounded-full object-cover"
                                />
                                {isSelectedUserOnline && (
                                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                                )}
                            </div>
                            <div>
                                <h3 className="font-medium text-[#1A1208] text-sm">
                                    {selectedUserName}
                                </h3>
                                <p className="text-xs text-[#6B5E4F]">
                                    {isSelectedUserOnline ? 'En ligne' : 'Hors ligne'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="p-1.5 rounded-lg hover:bg-[#E8EDE6] transition-colors">
                                <FiPhone size={18} className="text-[#6B5E4F]" />
                            </button>
                            <button className="p-1.5 rounded-lg hover:bg-[#E8EDE6] transition-colors">
                                <FiMoreVertical size={18} className="text-[#6B5E4F]" />
                            </button>
                        </div>
                    </div>

                    <div 
                        ref={messagesContainerRef}
                        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-white to-[#FAF8F5]"
                    >
                        {loadingMessages && messages.length === 0 ? (
                            <div className="flex justify-center items-center h-full">
                                <div className="relative w-8 h-8">
                                    <div className="absolute inset-0 border-3 border-[#E8EDE6] rounded-full"></div>
                                    <div className="absolute inset-0 border-3 border-[#3D5A3E] border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <div className="text-5xl mb-4">👋</div>
                                <h3 className="font-heading font-semibold text-[#1A1208] mb-2">
                                    Commencez la conversation
                                </h3>
                                <p className="text-[#6B5E4F] text-sm">
                                    Envoyez un message à {selectedUserName}
                                </p>
                            </div>
                        ) : (
                            <>
                                {hasMore && (
                                    <div className="text-center">
                                        <button
                                            onClick={loadMoreMessages}
                                            disabled={loadingMessages}
                                            className="text-xs text-[#3D5A3E] hover:underline disabled:opacity-50"
                                        >
                                            {loadingMessages ? 'Chargement...' : 'Voir plus de messages'}
                                        </button>
                                    </div>
                                )}
                                
                                {Object.entries(messageGroups).map(([date, msgs]) => (
                                    <div key={date}>
                                        <div className="text-center mb-3">
                                            <span className="text-xs bg-[#E8EDE6] px-3 py-1 rounded-full text-[#6B5E4F]">
                                                {date === new Date().toLocaleDateString('fr-FR') ? "Aujourd'hui" : date}
                                            </span>
                                        </div>
                                        {msgs.map((msg) => {
                                            const isOwn = msg.senderId?._id === user._id;
                                            return (
                                                <div key={msg._id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2`}>
                                                    <div className={`max-w-[70%] md:max-w-[60%] ${isOwn ? 'order-2' : 'order-1'}`}>
                                                        <div className={`rounded-2xl px-4 py-2 ${
                                                            isOwn 
                                                                ? 'bg-[#3D5A3E] text-white' 
                                                                : 'bg-white border border-[#E8E2D9] text-[#1A1208]'
                                                        }`}>
                                                            <p className="text-sm break-words">{msg.content}</p>
                                                        </div>
                                                        <div className={`flex items-center gap-1 mt-1 text-xs text-[#9B9082] ${isOwn ? 'justify-end' : 'justify-start'}`}>
                                                            <span>{formatDate(msg.createdAt)}</span>
                                                            {isOwn && (
                                                                <span className="ml-1">
                                                                    {msg.status === 'sending' ? (
                                                                        <span className="animate-pulse">⏳</span>
                                                                    ) : (
                                                                        <FiCheck size={12} />
                                                                    )}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}
                                {typingUsers.includes(selectedUser._id) && (
                                    <div className="flex items-center gap-2 text-xs text-[#6B5E4F]">
                                        <span className="animate-pulse">•••</span>
                                        <span>{selectedUserName} est en train d'écrire...</span>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </>
                        )}
                    </div>

                    <div className="p-3 border-t border-[#E8E2D9] bg-white">
                        <form onSubmit={sendMessageHandler} className="flex items-end gap-2">
                            <button
                                type="button"
                                className="p-2 rounded-lg hover:bg-[#E8EDE6] transition-colors text-[#6B5E4F]"
                            >
                                <FiPaperclip size={18} />
                            </button>
                            <textarea
                                value={newMessage}
                                onChange={handleTyping}
                                placeholder={`Message pour ${selectedUserName}...`}
                                rows="1"
                                className="flex-1 px-4 py-2 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl focus:outline-none focus:border-[#3D5A3E] transition-all resize-none text-sm max-h-32"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        sendMessageHandler(e);
                                    }
                                }}
                            />
                            <button
                                type="submit"
                                disabled={!newMessage.trim() || !isConnected}
                                className="p-2.5 bg-[#3D5A3E] hover:bg-[#2D452E] text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <FiSend size={18} />
                            </button>
                        </form>
                    </div>
                </div>
            ) : (
                <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-[#FAF8F5]">
                    <div className="text-7xl mb-6">💬</div>
                    <h2 className="text-2xl font-heading font-bold text-[#1A1208] mb-2">
                        Vos messages
                    </h2>
                    <p className="text-[#6B5E4F] max-w-sm text-center">
                        Sélectionnez une conversation pour commencer à discuter avec un artisan
                    </p>
                </div>
            )}
        </div>
    );
};

export default ClientMessages;