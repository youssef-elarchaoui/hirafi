// controllers/orderController.js

const Order = require('../models/Order');
const Service = require('../models/Service');
const User = require('../models/User');

// @desc    Créer une nouvelle commande
// @route   POST /api/orders
// @access  Private (Client only)
const createOrder = async (req, res) => {
    try {
        // Vérifier si l'utilisateur est client
        if (req.user.role !== 'client') {
            return res.status(403).json({
                success: false,
                message: 'Seuls les clients peuvent passer des commandes'
            });
        }

        const { serviceId, requirements } = req.body;

        if (!serviceId || !requirements) {
            return res.status(400).json({
                success: false,
                message: 'Veuillez fournir le service et les exigences'
            });
        }

        // Vérifier si le service existe
        const service = await Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service non trouvé'
            });
        }

        // Vérifier si le service est actif
        if (service.status !== 'active') {
            return res.status(400).json({
                success: false,
                message: 'Ce service n\'est pas disponible'
            });
        }

        // Vérifier que le client ne commande pas son propre service
        if (service.freelancerId.toString() === req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: 'Vous ne pouvez pas commander votre propre service'
            });
        }

        // Calculer les frais
        const platformFee = service.price * 0.1; // 10% de commission
        const freelancerEarnings = service.price - platformFee;

        // Créer la commande
        const order = await Order.create({
            serviceId: service._id,
            clientId: req.user._id,
            freelancerId: service.freelancerId,
            requirements,
            price: service.price,
            platformFee,
            freelancerEarnings,
            status: 'pending'
        });

        // Peupler les informations
        await order.populate('serviceId', 'title images');
        await order.populate('clientId', 'name avatar');
        await order.populate('freelancerId', 'name avatar');

        res.status(201).json({
            success: true,
            message: 'Commande créée avec succès',
            order
        });

    } catch (error) {
        console.error('Erreur createOrder:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la création de la commande',
            error: error.message
        });
    }
};

// @desc    Obtenir mes commandes (en tant que client)
// @route   GET /api/orders/my-orders
// @access  Private (Client)
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ clientId: req.user._id })
            .populate('serviceId', 'title images price')
            .populate('freelancerId', 'name avatar')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });

    } catch (error) {
        console.error('Erreur getMyOrders:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des commandes'
        });
    }
};

// @desc    Obtenir les commandes reçues (en tant que freelancer)
// @route   GET /api/orders/received
// @access  Private (Freelancer)
const getReceivedOrders = async (req, res) => {
    try {
        const orders = await Order.find({ freelancerId: req.user._id })
            .populate('serviceId', 'title images price')
            .populate('clientId', 'name avatar')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });

    } catch (error) {
        console.error('Erreur getReceivedOrders:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des commandes'
        });
    }
};

// @desc    Obtenir une commande par ID
// @route   GET /api/orders/:id
// @access  Private (Client, Freelancer, Admin)
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('serviceId', 'title description images price deliveryDays')
            .populate('clientId', 'name email avatar phone')
            .populate('freelancerId', 'name email avatar skills rating');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Commande non trouvée'
            });
        }

        // Vérifier les autorisations
        const isClient = order.clientId._id.toString() === req.user._id.toString();
        const isFreelancer = order.freelancerId._id.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';

        if (!isClient && !isFreelancer && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Vous n\'êtes pas autorisé à voir cette commande'
            });
        }

        res.status(200).json({
            success: true,
            order
        });

    } catch (error) {
        console.error('Erreur getOrderById:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération de la commande'
        });
    }
};

// @desc    Mettre à jour le statut d'une commande
// @route   PUT /api/orders/:id/status
// @access  Private (Freelancer or Client)
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Commande non trouvée'
            });
        }

        const isFreelancer = order.freelancerId.toString() === req.user._id.toString();
        const isClient = order.clientId.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';

        // Vérifier les autorisations
        if (!isFreelancer && !isClient && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Non autorisé'
            });
        }

        // Logique de changement de statut
        const validTransitions = {
            'pending': ['in-progress', 'cancelled'],
            'in-progress': ['delivered', 'cancelled'],
            'delivered': ['completed', 'disputed'],
            'completed': [],
            'cancelled': [],
            'disputed': ['cancelled', 'completed']
        };

        if (!validTransitions[order.status].includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Transition de ${order.status} à ${status} non autorisée`
            });
        }

        // Restrictions par rôle
        if (status === 'in-progress' && !isFreelancer && !isAdmin) {
            return res.status(403).json({ success: false, message: 'Seul le freelancer peut accepter la commande' });
        }
        
        if (status === 'delivered' && !isFreelancer && !isAdmin) {
            return res.status(403).json({ success: false, message: 'Seul le freelancer peut livrer la commande' });
        }
        
        if (status === 'completed' && !isClient && !isAdmin) {
            return res.status(403).json({ success: false, message: 'Seul le client peut confirmer la livraison' });
        }
        
        if (status === 'cancelled' && !isClient && !isFreelancer && !isAdmin) {
            return res.status(403).json({ success: false, message: 'Non autorisé' });
        }

        // Mettre à jour
        order.status = status;
        
        if (status === 'delivered') order.deliveredAt = new Date();
        if (status === 'completed') order.completedAt = new Date();
        if (status === 'cancelled') order.cancelledAt = new Date();
        
        await order.save();

        res.status(200).json({
            success: true,
            message: `Statut de la commande mis à jour: ${status}`,
            order
        });

    } catch (error) {
        console.error('Erreur updateOrderStatus:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la mise à jour du statut'
        });
    }
};

// @desc    Livrer une commande (avec fichier)
// @route   POST /api/orders/:id/deliver
// @access  Private (Freelancer only)
const deliverOrder = async (req, res) => {
    try {
        const { deliveryMessage, deliveryFile } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Commande non trouvée'
            });
        }

        // Vérifier si l'utilisateur est le freelancer
        if (order.freelancerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Seul le freelancer peut livrer la commande'
            });
        }

        // Vérifier le statut
        if (order.status !== 'in-progress') {
            return res.status(400).json({
                success: false,
                message: 'La commande doit être en cours pour être livrée'
            });
        }

        order.deliveryMessage = deliveryMessage || '';
        if (deliveryFile) order.deliveryFile = deliveryFile;
        order.status = 'delivered';
        order.deliveredAt = new Date();

        await order.save();

        res.status(200).json({
            success: true,
            message: 'Commande livrée avec succès',
            order
        });

    } catch (error) {
        console.error('Erreur deliverOrder:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la livraison'
        });
    }
};

// @desc    Annuler une commande
// @route   PUT /api/orders/:id/cancel
// @access  Private (Client or Freelancer)
const cancelOrder = async (req, res) => {
    try {
        const { cancellationReason } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Commande non trouvée'
            });
        }

        const isClient = order.clientId.toString() === req.user._id.toString();
        const isFreelancer = order.freelancerId.toString() === req.user._id.toString();

        if (!isClient && !isFreelancer && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Non autorisé'
            });
        }

        if (order.status !== 'pending' && order.status !== 'in-progress') {
            return res.status(400).json({
                success: false,
                message: 'Impossible d\'annuler une commande déjà livrée ou terminée'
            });
        }

        order.status = 'cancelled';
        order.cancelledAt = new Date();
        order.cancellationReason = cancellationReason || 'Annulé par l\'utilisateur';

        await order.save();

        res.status(200).json({
            success: true,
            message: 'Commande annulée avec succès',
            order
        });

    } catch (error) {
        console.error('Erreur cancelOrder:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'annulation'
        });
    }
};

// @desc    Obtenir toutes les commandes (Admin only)
// @route   GET /api/orders/admin/all
// @access  Private (Admin only)
const getAllOrders = async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        
        const filter = {};
        if (status) filter.status = status;

        const skip = (page - 1) * limit;
        const total = await Order.countDocuments(filter);

        const orders = await Order.find(filter)
            .populate('serviceId', 'title')
            .populate('clientId', 'name email')
            .populate('freelancerId', 'name email')
            .sort('-createdAt')
            .skip(skip)
            .limit(Number(limit));

        res.status(200).json({
            success: true,
            orders,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Erreur getAllOrders:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération'
        });
    }
};

module.exports = {
    createOrder,
    getMyOrders,
    getReceivedOrders,
    getOrderById,
    updateOrderStatus,
    deliverOrder,
    cancelOrder,
    getAllOrders
};