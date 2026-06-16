// src/api/userApi.js
import axios from './axiosConfig';

export const userApi = {
    // Obtenir mon profil
    getMyProfile: () => axios.get('/auth/me'),
    
    // Mettre à jour mon profil
    updateProfile: (data) => axios.put('/auth/profile', data),
    
    // Changer mot de passe
    changePassword: (data) => axios.put('/auth/change-password', data),
    
    // Obtenir les stats du freelancer
    getMyStats: () => axios.get('/users/me/stats'),
    
    // Obtenir un utilisateur par ID
    getUserById: (id) => axios.get(`/users/${id}`),
    
    // Obtenir les freelancers (tous)
    getFreelancers: (params) => axios.get('/users/freelancers', { params }),
    
    // Obtenir un freelancer par ID
    getFreelancerById: (id) => axios.get(`/users/freelancers/${id}`)
};