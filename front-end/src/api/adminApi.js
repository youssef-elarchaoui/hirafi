import axios from './axiosConfig';

export const adminApi = {
    // ========== STATISTIQUES ==========
    getStats: () => axios.get('/admin/stats'),
    getDashboardStats: () => axios.get('/admin/dashboard/stats'),
    exportData: (type) => axios.get(`/admin/export/${type}`),
    
    // ========== GESTION DES UTILISATEURS ==========
    getUsers: (params) => axios.get('/admin/users', { params }),
    getUserById: (id) => axios.get(`/admin/users/${id}`),
    updateUser: (id, data) => axios.put(`/admin/users/${id}`, data),
    disableUser: (id) => axios.put(`/admin/users/${id}/disable`),
    enableUser: (id) => axios.put(`/admin/users/${id}/enable`),
    deleteUser: (id) => axios.delete(`/admin/users/${id}`),
    
    // ========== GESTION DES SERVICES ==========
    getAllServices: (params) => axios.get('/admin/services', { params }),
    updateService: (id, data) => axios.put(`/admin/services/${id}`, data),
    deleteService: (id) => axios.delete(`/admin/services/${id}`),
    
    // ========== GESTION DES COMMANDES ==========
    getAllOrders: (params) => axios.get('/admin/orders', { params }),
    updateOrderStatus: (id, status, adminNotes) => 
        axios.put(`/admin/orders/${id}/status`, { status, adminNotes }),
    
    // ========== GESTION DES REVIEWS ==========
    getReportedReviews: () => axios.get('/admin/reviews/reported'),
    approveReview: (id) => axios.put(`/admin/reviews/${id}/approve`),
    hideReview: (id) => axios.put(`/admin/reviews/${id}/hide`),
    
    // ========== GESTION DES CATÉGORIES ==========
    getCategories: () => axios.get('/admin/categories')
};