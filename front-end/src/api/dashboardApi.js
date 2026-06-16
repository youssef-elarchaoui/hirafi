import axios from './axiosConfig';

export const dashboardApi = {
    // Dashboard Freelancer
    getFreelancerDashboard: () => axios.get('/dashboard/freelancer'),
    
    // Dashboard Client
    getClientDashboard: () => axios.get('/dashboard/client'),
    
    // Dashboard Admin (version simplifiée)
    getAdminDashboard: () => axios.get('/dashboard/admin')
};