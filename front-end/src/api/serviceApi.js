// src/api/serviceApi.js
import axios from './axiosConfig';

export const serviceApi = {
    getAllServices: (params) => axios.get('/services', { params }),
    getServiceById: (id) => axios.get(`/services/${id}`),
    createService: (data) => axios.post('/services', data),
    updateService: (id, data) => axios.put(`/services/${id}`, data),
    deleteService: (id) => axios.delete(`/services/${id}`),
    getMyServices: () => axios.get('/services/me/services'),
    getFreelancerServices: (freelancerId) => axios.get(`/services/freelancer/${freelancerId}`)
};