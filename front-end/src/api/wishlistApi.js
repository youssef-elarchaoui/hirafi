// src/api/wishlistApi.js
import axios from './axiosConfig';

export const wishlistApi = {
    // Obtenir ma liste de souhaits
    getMyWishlist: () => axios.get('/wishlist'),
    
    // Ajouter un service à la liste de souhaits
    addToWishlist: (serviceId) => axios.post('/wishlist', { serviceId }),
    
    // Supprimer un service de la liste de souhaits
    removeFromWishlist: (id) => axios.delete(`/wishlist/${id}`),
    
    // Vérifier si un service est dans la liste de souhaits
    checkInWishlist: (serviceId) => axios.get(`/wishlist/check/${serviceId}`)
};