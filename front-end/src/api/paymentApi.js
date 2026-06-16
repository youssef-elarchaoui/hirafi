import axios from './axiosConfig';

export const paymentApi = {
    // Mon portefeuille (solde + historique)
    getWallet: () => axios.get('/payments/wallet'),
    
    // Recharger le portefeuille
    deposit: (amount, paymentMethod) => axios.post('/payments/deposit', { amount, paymentMethod }),
    
    // Demander un retrait (freelancer)
    withdraw: (amount, bankInfo) => axios.post('/payments/withdraw', { amount, bankInfo }),
    
    // Payer une commande
    payOrder: (orderId) => axios.post(`/payments/pay-order/${orderId}`),
    
    // ========== Routes Admin ==========
    // Demandes de retrait
    getWithdrawalRequests: () => axios.get('/payments/admin/withdrawals'),
    
    // Approuver un retrait
    approveWithdrawal: (id) => axios.put(`/payments/admin/withdrawals/${id}/approve`),
    
    // Rejeter un retrait
    rejectWithdrawal: (id) => axios.put(`/payments/admin/withdrawals/${id}/reject`),
    
    // Toutes les transactions
    getAllTransactions: (params) => axios.get('/payments/admin/transactions', { params })
};