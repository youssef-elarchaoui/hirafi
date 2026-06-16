// src/api/authApi.js
import API from './axiosConfig';

// تسجيل الدخول
export const loginAPI = async (credentials) => {
    const response = await API.post('/auth/login', credentials);
    return response.data; 
};

// جلب بيانات الحساب الحالي (Profil)
export const getMyProfileAPI = async () => {
    const response = await API.get('/auth/me');
    return response.data; 
};

export const registerAPI = async (userData) => {
    const response = await API.post('/auth/register', userData);
    return response.data; // غاترجع { token, user } كالمعتاد
};