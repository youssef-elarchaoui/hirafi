import axios from './axiosConfig';

export const chatApi = {
    // Obtenir toutes les conversations
    getConversations: () => axios.get('/chat/conversations'),
    
    // Obtenir les messages avec un utilisateur
    getMessages: (userId, page = 1, limit = 50) => 
        axios.get(`/chat/messages/${userId}`, { params: { page, limit } }),
    
    // Obtenir les messages d'une commande
    getOrderMessages: (orderId) => axios.get(`/chat/orders/${orderId}/messages`),
    
    // Supprimer un message
    deleteMessage: (messageId) => axios.delete(`/chat/messages/${messageId}`)
};