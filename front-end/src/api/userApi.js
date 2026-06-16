// src/api/userApi.js
import axios from './axiosConfig';

export const userApi = {
    // Obtenir tous les utilisateurs (admin)
    getAllUsers: (params) => axios.get('/admin/users', { params }),
    
    // Obtenir un utilisateur par ID
    getUserById: (id) => axios.get(`/admin/users/${id}`),
    
    // Mettre à jour un utilisateur
    updateUser: (id, data) => axios.put(`/admin/users/${id}`, data),
};