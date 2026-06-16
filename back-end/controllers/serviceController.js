// controllers/serviceController.js

const Service = require('../models/Service');
const User = require('../models/User');
const Order = require('../models/Order'); // Ajoutez cette ligne

// @desc    Créer un nouveau service
// @route   POST /api/services
// @access  Private (Freelancer only)
const createService = async (req, res) => {
    try {
        if (req.user.role !== 'freelancer') {
            return res.status(403).json({
                success: false,
                message: 'Seuls les freelancers peuvent créer des services'
            });
        }

        const {
            title,
            description,
            category,
            subcategory,
            price,
            deliveryDays,
            tags,
            images,
            requirements
        } = req.body;

        if (!title || !description || !category || !price || !deliveryDays) {
            return res.status(400).json({
                success: false,
                message: 'Veuillez fournir tous les champs requis'
            });
        }

        const service = await Service.create({
            title,
            description,
            category,
            subcategory: subcategory || '',
            price,
            deliveryDays,
            tags: tags || [],
            images: images || [],
            requirements: requirements || '',
            freelancerId: req.user._id
        });

        res.status(201).json({
            success: true,
            message: 'Service créé avec succès',
            service
        });

    } catch (error) {
        console.error('Erreur createService:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la création du service',
            error: error.message
        });
    }
};

// @desc    Obtenir tous les services (avec filtres) - PUBLIC
// @route   GET /api/services
// @access  Public
const getServices = async (req, res) => {
    try {
        const {
            category,
            minPrice,
            maxPrice,
            search,
            page = 1,
            limit = 10,
            sort = '-createdAt'
        } = req.query;

        const filter = { status: 'active' };
        if (category) filter.category = category;
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }
        if (search) {
            filter.$text = { $search: search };
        }

        const skip = (page - 1) * limit;
        const total = await Service.countDocuments(filter);

        const services = await Service.find(filter)
            .populate('freelancerId', 'name avatar rating')
            .sort(sort)
            .skip(skip)
            .limit(Number(limit));

        res.status(200).json({
            success: true,
            services,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / limit),
                limit: Number(limit)
            }
        });

    } catch (error) {
        console.error('Erreur getServices:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des services'
        });
    }
};

// @desc    Obtenir un service par ID
// @route   GET /api/services/:id
// @access  Public
const getServiceById = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id)
            .populate('freelancerId', 'name email avatar rating skills totalOrders totalEarnings');

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service non trouvé'
            });
        }

        service.views += 1;
        await service.save();

        res.status(200).json({
            success: true,
            service
        });

    } catch (error) {
        console.error('Erreur getServiceById:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération du service'
        });
    }
};

// @desc    Mettre à jour un service
// @route   PUT /api/services/:id
// @access  Private (Freelancer owner only)
const updateService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service non trouvé'
            });
        }

        if (service.freelancerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Vous n\'êtes pas autorisé à modifier ce service'
            });
        }

        const {
            title,
            description,
            category,
            price,
            deliveryDays,
            tags,
            images,
            requirements,
            status
        } = req.body;

        if (title) service.title = title;
        if (description) service.description = description;
        if (category) service.category = category;
        if (price) service.price = price;
        if (deliveryDays) service.deliveryDays = deliveryDays;
        if (tags) service.tags = tags;
        if (images) service.images = images;
        if (requirements) service.requirements = requirements;
        if (status) service.status = status;

        await service.save();

        res.status(200).json({
            success: true,
            message: 'Service mis à jour avec succès',
            service
        });

    } catch (error) {
        console.error('Erreur updateService:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la mise à jour du service'
        });
    }
};

// @desc    Supprimer un service - HARD DELETE (suppression réelle)
// @route   DELETE /api/services/:id
// @access  Private (Freelancer owner or Admin)
const deleteService = async (req, res) => {
    try {
        console.log('=== SUPPRESSION SERVICE ===');
        console.log('ID:', req.params.id);
        console.log('Utilisateur:', req.user._id);
        
        // 1. Trouver le service
        const service = await Service.findById(req.params.id);
        
        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service non trouvé'
            });
        }
        
        // 2. Vérifier les autorisations
        const isOwner = service.freelancerId.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';
        
        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Vous n\'êtes pas autorisé à supprimer ce service'
            });
        }
        
        // 3. SUPPRESSION RÉELLE (Hard delete)
        await Service.findByIdAndDelete(req.params.id);
        
        console.log('Service supprimé avec succès');
        
        res.status(200).json({
            success: true,
            message: 'Service supprimé avec succès'
        });
        
    } catch (error) {
        console.error('Erreur deleteService:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression du service: ' + error.message
        });
    }
};

// @desc    Obtenir les services d'un freelancer (Public)
// @route   GET /api/services/freelancer/:freelancerId
// @access  Public
const getFreelancerServices = async (req, res) => {
    try {
        const services = await Service.find({
            freelancerId: req.params.freelancerId,
            status: 'active'
        }).sort('-createdAt');

        res.status(200).json({
            success: true,
            count: services.length,
            services
        });

    } catch (error) {
        console.error('Erreur getFreelancerServices:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des services'
        });
    }
};

// @desc    Obtenir mes services (freelancer connecté)
// @route   GET /api/services/me
// @access  Private (Freelancer only)
const getMyServices = async (req, res) => {
    try {
        console.log('=== RÉCUPÉRATION MES SERVICES ===');
        console.log('Utilisateur ID:', req.user._id);
        
        const services = await Service.find({
            freelancerId: req.user._id
        }).sort('-createdAt');
        
        console.log(`${services.length} services trouvés`);
        
        res.status(200).json({
            success: true,
            count: services.length,
            services
        });

    } catch (error) {
        console.error('Erreur getMyServices:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération de vos services'
        });
    }
};

module.exports = {
    createService,
    getServices,
    getServiceById,
    updateService,
    deleteService,
    getFreelancerServices,
    getMyServices
};