// src/api/uploadApi.js
import axios from './axiosConfig';

export const uploadApi = {
    uploadImage: (file) => {
        const formData = new FormData();
        formData.append('image', file);
        return axios.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    uploadMultipleImages: (files) => {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('images', file);
        });
        return axios.post('/upload/multiple', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }
};