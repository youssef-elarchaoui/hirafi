import axios from './axiosConfig';

export const reviewApi = {
    // Créer un avis
    createReview: (data) => axios.post('/reviews', data),
    
    // Avis d'un service
    getServiceReviews: (serviceId, params) => axios.get(`/reviews/service/${serviceId}`, { params }),
    
    // Avis d'un freelancer
    getFreelancerReviews: (freelancerId, params) => axios.get(`/reviews/freelancer/${freelancerId}`, { params }),
    
    // Mes avis reçus (freelancer)
    getMyReviews: () => axios.get('/reviews/my-reviews'),
    
    // Répondre à un avis
    respondToReview: (id, response) => axios.put(`/reviews/${id}/respond`, { response }),
    
    // Signaler un avis
    reportReview: (id) => axios.put(`/reviews/${id}/report`),
    
    // Marquer comme utile
    markHelpful: (id) => axios.put(`/reviews/${id}/helpful`)
};