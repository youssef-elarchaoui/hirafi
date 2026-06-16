import { useSocket as useSocketContext } from '../context/SocketContext';
import { useEffect, useCallback, useRef } from 'react';
import { useAuth } from './useAuth';

/**
 * Hook personnalisé pour WebSocket
 * Utilise le contexte SocketContext
 * 
 * @returns {Object} - { socket, isConnected, sendMessage, joinRoom, leaveRoom, sendTyping, onEvent }
 */
const useSocket = () => {
    const socketContext = useSocketContext();
    const { user } = useAuth();
    const eventListeners = useRef(new Map());

    if (!socketContext) {
        throw new Error('useSocket must be used within SocketProvider');
    }

    const { socket, isConnected, sendMessage, joinRoom, leaveRoom, sendTyping } = socketContext;

    /**
     * Écouter un événement spécifique
     * @param {string} event - Nom de l'événement
     * @param {Function} callback - Fonction à exécuter
     */
    const onEvent = useCallback((event, callback) => {
        if (!socket) return;

        // Stocker le callback pour le nettoyage
        if (!eventListeners.current.has(event)) {
            eventListeners.current.set(event, []);
        }
        eventListeners.current.get(event).push(callback);

        socket.on(event, callback);

        // Retourner une fonction de nettoyage
        return () => {
            socket.off(event, callback);
            const listeners = eventListeners.current.get(event);
            if (listeners) {
                const index = listeners.indexOf(callback);
                if (index > -1) listeners.splice(index, 1);
            }
        };
    }, [socket]);

    /**
     * Écouter un événement une seule fois
     * @param {string} event - Nom de l'événement
     * @param {Function} callback - Fonction à exécuter
     */
    const onceEvent = useCallback((event, callback) => {
        if (!socket) return;
        socket.once(event, callback);
    }, [socket]);

    /**
     * Émettre un événement
     * @param {string} event - Nom de l'événement
     * @param {any} data - Données à envoyer
     */
    const emitEvent = useCallback((event, data) => {
        if (socket && isConnected) {
            socket.emit(event, data);
        }
    }, [socket, isConnected]);

    /**
     * Envoyer un message privé simplifié
     * @param {string} receiverId - ID du destinataire
     * @param {string} message - Contenu du message
     * @param {string} orderId - ID de la commande (optionnel)
     */
    const sendPrivateMessage = useCallback((receiverId, message, orderId = null) => {
        if (!user) {
            console.error('Utilisateur non authentifié');
            return;
        }
        sendMessage(receiverId, message, orderId);
    }, [user, sendMessage]);

    /**
     * Rejoindre une conversation
     * @param {string} userId - ID de l'autre utilisateur
     */
    const joinConversation = useCallback((userId) => {
        if (!user) return;
        const roomId = [user._id, userId].sort().join('_');
        joinRoom(roomId);
        return roomId;
    }, [user, joinRoom]);

    /**
     * Quitter une conversation
     * @param {string} userId - ID de l'autre utilisateur
     */
    const leaveConversation = useCallback((userId) => {
        if (!user) return;
        const roomId = [user._id, userId].sort().join('_');
        leaveRoom(roomId);
    }, [user, leaveRoom]);

    /**
     * Indiquer que l'utilisateur est en train d'écrire
     * @param {string} receiverId - ID du destinataire
     * @param {boolean} isTyping - True si en train d'écrire
     */
    const setTyping = useCallback((receiverId, isTyping) => {
        if (!user) return;
        sendTyping(receiverId, isTyping);
    }, [user, sendTyping]);

    // Nettoyer tous les écouteurs lors du démontage
    useEffect(() => {
        return () => {
            eventListeners.current.forEach((callbacks, event) => {
                callbacks.forEach(callback => {
                    socket?.off(event, callback);
                });
            });
            eventListeners.current.clear();
        };
    }, [socket]);

    return {
        socket,
        isConnected,
        sendMessage: sendPrivateMessage,
        joinConversation,
        leaveConversation,
        sendTyping: setTyping,
        onEvent,
        onceEvent,
        emitEvent
    };
};

export default useSocket;