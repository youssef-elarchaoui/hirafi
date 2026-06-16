import axios from './axiosConfig';

export const notificationApi = {
    // Obtenir mes notifications
    getNotifications: (page = 1, limit = 20, unreadOnly = false) => 
        axios.get('/notifications', { params: { page, limit, unreadOnly } }),
    
    // Marquer une notification comme lue
    markAsRead: (id) => axios.put(`/notifications/${id}/read`),
    
    // Marquer toutes les notifications comme lues
    markAllAsRead: () => axios.put('/notifications/read-all'),
    
    // Supprimer une notification
    deleteNotification: (id) => axios.delete(`/notifications/${id}`)
};