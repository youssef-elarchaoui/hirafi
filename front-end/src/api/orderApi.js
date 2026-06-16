// src/api/orderApi.js
import axios from './axiosConfig';

export const orderApi = {
    // Créer une commande
    createOrder: (data) => axios.post('/orders', data),
    
    // Mes commandes (client)
    getMyOrders: () => axios.get('/orders/my-orders'),
    
    // Commandes reçues (freelancer)
    getReceivedOrders: () => axios.get('/orders/received'),
    
    // Commande par ID
    getOrderById: (id) => axios.get(`/orders/${id}`),
    
    // Mettre à jour statut
    updateStatus: (id, status) => axios.put(`/orders/${id}/status`, { status }),
    
    // Livrer commande (freelancer)
    deliverOrder: (id, data) => axios.post(`/orders/${id}/deliver`, data),
    
    // Annuler commande (client)
    cancelOrder: (id, reason) => axios.put(`/orders/${id}/cancel`, { cancellationReason: reason }),
    
    // Compléter commande (client)
    completeOrder: (id) => axios.put(`/orders/${id}/complete`)
};