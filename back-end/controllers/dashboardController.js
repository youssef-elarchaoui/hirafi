// controllers/dashboardController.js

const Order = require('../models/Order');
const Service = require('../models/Service');
const Review = require('../models/Review');
const User = require('../models/User');

// @desc    Dashboard Freelancer
// @route   GET /api/dashboard/freelancer
// @access  Private (Freelancer only)
const getFreelancerDashboard = async (req, res) => {
    try {
        const userId = req.user._id;
        
        // Statistiques des commandes
        const orders = await Order.find({ freelancerId: userId });
        const totalOrders = orders.length;
        const completedOrders = orders.filter(o => o.status === 'completed').length;
        const pendingOrders = orders.filter(o => o.status === 'pending').length;
        const inProgressOrders = orders.filter(o => o.status === 'in-progress').length;
        
        // Revenus
        const totalEarnings = orders
            .filter(o => o.status === 'completed')
            .reduce((sum, o) => sum + (o.freelancerEarnings || 0), 0);
        
        const pendingEarnings = orders
            .filter(o => o.status === 'in-progress' || o.status === 'delivered')
            .reduce((sum, o) => sum + (o.freelancerEarnings || 0), 0);
        
        // Services
        const services = await Service.find({ freelancerId: userId });
        const activeServices = services.filter(s => s.status === 'active').length;
        const totalServiceViews = services.reduce((sum, s) => sum + (s.views || 0), 0);
        
        // Évaluations
        const reviews = await Review.find({ freelancerId: userId });
        const averageRating = reviews.length > 0 
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
            : 0;
        
        // Commandes récentes
        const recentOrders = await Order.find({ freelancerId: userId })
            .populate('clientId', 'name avatar')
            .populate('serviceId', 'title')
            .sort('-createdAt')
            .limit(5);
        
        // Évolution mensuelle des revenus
        const monthlyEarnings = [];
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
            const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
            
            const monthOrders = await Order.find({
                freelancerId: userId,
                status: 'completed',
                completedAt: { $gte: monthStart, $lte: monthEnd }
            });
            
            const total = monthOrders.reduce((sum, o) => sum + (o.freelancerEarnings || 0), 0);
            
            monthlyEarnings.push({
                month: monthStart.toLocaleString('default', { month: 'short' }),
                year: date.getFullYear(),
                earnings: total
            });
        }
        
        res.json({
            success: true,
            dashboard: {
                stats: {
                    totalOrders,
                    completedOrders,
                    pendingOrders,
                    inProgressOrders,
                    totalEarnings,
                    pendingEarnings,
                    activeServices,
                    totalServiceViews,
                    averageRating: parseFloat(averageRating.toFixed(1)),
                    totalReviews: reviews.length
                },
                recentOrders,
                monthlyEarnings,
                services: services.map(s => ({
                    _id: s._id,
                    title: s.title,
                    price: s.price,
                    status: s.status,
                    views: s.views,
                    orders: s.orders
                }))
            }
        });
    } catch (error) {
        console.error('Erreur getFreelancerDashboard:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Dashboard Client
// @route   GET /api/dashboard/client
// @access  Private (Client only)
const getClientDashboard = async (req, res) => {
    try {
        const userId = req.user._id;
        
        // Statistiques des commandes
        const orders = await Order.find({ clientId: userId });
        const totalOrders = orders.length;
        const completedOrders = orders.filter(o => o.status === 'completed').length;
        const pendingOrders = orders.filter(o => o.status === 'pending').length;
        const inProgressOrders = orders.filter(o => o.status === 'in-progress').length;
        const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
        
        // Dépenses
        const totalSpent = orders
            .filter(o => o.status === 'completed')
            .reduce((sum, o) => sum + o.price, 0);
        
        // Commandes récentes
        const recentOrders = await Order.find({ clientId: userId })
            .populate('freelancerId', 'name avatar')
            .populate('serviceId', 'title')
            .sort('-createdAt')
            .limit(5);
        
        // Mes reviews
        const reviews = await Review.find({ clientId: userId })
            .populate('freelancerId', 'name avatar')
            .populate('serviceId', 'title')
            .sort('-createdAt');
        
        // Évolution mensuelle des dépenses
        const monthlySpending = [];
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
            const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
            
            const monthOrders = await Order.find({
                clientId: userId,
                status: 'completed',
                completedAt: { $gte: monthStart, $lte: monthEnd }
            });
            
            const total = monthOrders.reduce((sum, o) => sum + o.price, 0);
            
            monthlySpending.push({
                month: monthStart.toLocaleString('default', { month: 'short' }),
                year: date.getFullYear(),
                spent: total
            });
        }
        
        res.json({
            success: true,
            dashboard: {
                stats: {
                    totalOrders,
                    completedOrders,
                    pendingOrders,
                    inProgressOrders,
                    deliveredOrders,
                    totalSpent
                },
                recentOrders,
                recentReviews: reviews.slice(0, 5),
                monthlySpending
            }
        });
    } catch (error) {
        console.error('Erreur getClientDashboard:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Dashboard Admin (version complète)
// @route   GET /api/dashboard/admin
// @access  Private (Admin only)
const getAdminDashboard = async (req, res) => {
    try {
        // 1. Statistiques générales
        const totalUsers = await User.countDocuments();
        const totalFreelancers = await User.countDocuments({ role: 'freelancer' });
        const totalClients = await User.countDocuments({ role: 'client' });
        const totalAdmins = await User.countDocuments({ role: 'admin' });
        
        const totalOrders = await Order.countDocuments();
        const pendingOrders = await Order.countDocuments({ status: 'pending' });
        const totalServices = await Service.countDocuments();
        const totalReviews = await Review.countDocuments();
        
        // 2. Revenus totaux
        const revenueResult = await Order.aggregate([
            { $match: { status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$price' } } }
        ]);
        const totalRevenue = revenueResult[0]?.total || 0;
        
        // 3. Calcul de la croissance (comparaison mois précédent)
        const now = new Date();
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        // Croissance des utilisateurs
        const usersLastMonth = await User.countDocuments({ 
            createdAt: { $gte: lastMonth, $lt: thisMonth } 
        });
        const usersThisMonth = await User.countDocuments({ 
            createdAt: { $gte: thisMonth } 
        });
        const usersGrowth = usersLastMonth > 0 
            ? Math.round(((usersThisMonth - usersLastMonth) / usersLastMonth) * 100) 
            : 0;
        
        // Croissance des commandes
        const ordersLastMonth = await Order.countDocuments({ 
            createdAt: { $gte: lastMonth, $lt: thisMonth } 
        });
        const ordersThisMonth = await Order.countDocuments({ 
            createdAt: { $gte: thisMonth } 
        });
        const ordersGrowth = ordersLastMonth > 0 
            ? Math.round(((ordersThisMonth - ordersLastMonth) / ordersLastMonth) * 100) 
            : 0;
        
        // Croissance des revenus
        const revenueLastMonth = await Order.aggregate([
            { 
                $match: { 
                    status: 'completed',
                    createdAt: { $gte: lastMonth, $lt: thisMonth } 
                } 
            },
            { $group: { _id: null, total: { $sum: '$price' } } }
        ]);
        const revenueThisMonth = await Order.aggregate([
            { 
                $match: { 
                    status: 'completed',
                    createdAt: { $gte: thisMonth } 
                } 
            },
            { $group: { _id: null, total: { $sum: '$price' } } }
        ]);
        const revenueLast = revenueLastMonth[0]?.total || 0;
        const revenueThis = revenueThisMonth[0]?.total || 0;
        const revenueGrowth = revenueLast > 0 
            ? Math.round(((revenueThis - revenueLast) / revenueLast) * 100) 
            : 0;
        
        // 4. Alertes
        const alerts = [];
        
        const reportedReviews = await Review.countDocuments({ status: 'reported' });
        if (reportedReviews > 0) {
            alerts.push({ type: 'warning', message: `${reportedReviews} avis signalés à modérer` });
        }
        
        const disputedOrders = await Order.countDocuments({ status: 'disputed' });
        if (disputedOrders > 0) {
            alerts.push({ type: 'danger', message: `${disputedOrders} commandes en litige` });
        }
        
        const inactiveFreelancers = await User.countDocuments({ role: 'freelancer', isActive: false });
        if (inactiveFreelancers > 0) {
            alerts.push({ type: 'info', message: `${inactiveFreelancers} freelancers désactivés` });
        }
        
        // 5. Commandes récentes
        const recentOrders = await Order.find()
            .populate('serviceId', 'title')
            .populate('clientId', 'name')
            .populate('freelancerId', 'name')
            .sort('-createdAt')
            .limit(5);
        
        // 6. Nouveaux utilisateurs
        const recentUsers = await User.find()
            .select('name email role avatar createdAt')
            .sort('-createdAt')
            .limit(5);
        
        // 7. Évolution mensuelle des revenus (6 derniers mois)
        const monthlyRevenue = [];
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
            const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
            
            const monthOrders = await Order.find({
                status: 'completed',
                completedAt: { $gte: monthStart, $lte: monthEnd }
            });
            
            const total = monthOrders.reduce((sum, o) => sum + (o.price || 0), 0);
            
            monthlyRevenue.push({
                month: monthStart.toLocaleString('default', { month: 'short' }),
                year: date.getFullYear(),
                revenue: total
            });
        }
        
        // 8. Top Freelancers (par nombre de commandes)
        const topFreelancers = await Order.aggregate([
            { 
                $match: { status: 'completed' }
            },
            {
                $group: {
                    _id: '$freelancerId',
                    totalOrders: { $sum: 1 },
                    totalRevenue: { $sum: '$price' }
                }
            },
            { $sort: { totalOrders: -1 } },
            { $limit: 5 }
        ]);
        
        // Récupérer les détails des freelancers
        const topFreelancersWithDetails = await Promise.all(
            topFreelancers.map(async (item) => {
                const user = await User.findById(item._id).select('name avatar');
                return {
                    name: user?.name || 'Artisan',
                    avatar: user?.avatar || null,
                    totalOrders: item.totalOrders,
                    totalRevenue: item.totalRevenue,
                    rating: 4.5
                };
            })
        );
        
        // 9. Top Services
        const topServices = await Order.aggregate([
            { 
                $match: { status: 'completed' }
            },
            {
                $group: {
                    _id: '$serviceId',
                    totalOrders: { $sum: 1 },
                    totalRevenue: { $sum: '$price' }
                }
            },
            { $sort: { totalOrders: -1 } },
            { $limit: 5 }
        ]);
        
        const topServicesWithDetails = await Promise.all(
            topServices.map(async (item) => {
                const service = await Service.findById(item._id).select('title price');
                return {
                    title: service?.title || 'Service',
                    price: service?.price || 0,
                    totalOrders: item.totalOrders,
                    totalRevenue: item.totalRevenue
                };
            })
        );
        
        res.json({
            success: true,
            dashboard: {
                stats: {
                    totalUsers,
                    totalOrders,
                    pendingOrders,
                    totalRevenue,
                    totalFreelancers,
                    totalClients,
                    totalServices,
                    totalReviews,
                    totalAdmins,
                    revenueGrowth,
                    ordersGrowth,
                    usersGrowth
                },
                alerts,
                recentOrders,
                recentUsers,
                monthlyRevenue,
                topFreelancers: topFreelancersWithDetails,
                topServices: topServicesWithDetails
            }
        });
    } catch (error) {
        console.error('Erreur getAdminDashboard:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erreur lors de la récupération du dashboard',
            error: error.message 
        });
    }
};

module.exports = { 
    getFreelancerDashboard, 
    getClientDashboard, 
    getAdminDashboard 
};