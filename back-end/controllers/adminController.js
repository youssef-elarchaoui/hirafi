const User = require("../models/User");
const Service = require("../models/Service");
const Order = require("../models/Order");
const Review = require("../models/Review");
const Notification = require("../models/Notification");

// ========== STATISTIQUES GLOBALES ==========

// @desc    Obtenir les statistiques globales
// @route   GET /api/admin/stats
// @access  Private (Admin only)
const getStats = async (req, res) => {
  try {
    // Statistiques des utilisateurs
    const totalUsers = await User.countDocuments();
    const totalClients = await User.countDocuments({ role: "client" });
    const totalFreelancers = await User.countDocuments({ role: "freelancer" });
    const totalAdmins = await User.countDocuments({ role: "admin" });

    // Utilisateurs actifs (connectés dans les 30 derniers jours)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const activeUsers = await User.countDocuments({
      lastLogin: { $gte: thirtyDaysAgo },
    });

    // Statistiques des services
    const totalServices = await Service.countDocuments();
    const activeServices = await Service.countDocuments({ status: "active" });
    const pausedServices = await Service.countDocuments({ status: "paused" });
    const deletedServices = await Service.countDocuments({ status: "deleted" });

    // Statistiques des commandes
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: "pending" });
    const inProgressOrders = await Order.countDocuments({
      status: "in-progress",
    });
    const deliveredOrders = await Order.countDocuments({ status: "delivered" });
    const completedOrders = await Order.countDocuments({ status: "completed" });
    const cancelledOrders = await Order.countDocuments({ status: "cancelled" });
    const disputedOrders = await Order.countDocuments({ status: "disputed" });

    // Chiffre d'affaires
    const allOrders = await Order.find({ status: "completed" });
    let totalRevenue = 0;
    let totalPlatformFees = 0;
    let totalFreelancerEarnings = 0;

    allOrders.forEach((order) => {
      totalRevenue += order.price;
      totalPlatformFees += order.platformFee || 0;
      totalFreelancerEarnings += order.freelancerEarnings || 0;
    });

    // Statistiques des reviews
    const totalReviews = await Review.countDocuments();
    const averageRating = await Review.aggregate([
      { $group: { _id: null, avg: { $avg: "$rating" } } },
    ]);

    // Commandes par mois (derniers 12 mois)
    const last12Months = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const count = await Order.countDocuments({
        createdAt: { $gte: monthStart, $lte: monthEnd },
      });

      last12Months.push({
        month: monthStart.toLocaleString("default", { month: "short" }),
        year: date.getFullYear(),
        count,
      });
    }

    res.status(200).json({
      success: true,
      stats: {
        users: {
          total: totalUsers,
          clients: totalClients,
          freelancers: totalFreelancers,
          admins: totalAdmins,
          active: activeUsers,
        },
        services: {
          total: totalServices,
          active: activeServices,
          paused: pausedServices,
          deleted: deletedServices,
        },
        orders: {
          total: totalOrders,
          pending: pendingOrders,
          inProgress: inProgressOrders,
          delivered: deliveredOrders,
          completed: completedOrders,
          cancelled: cancelledOrders,
          disputed: disputedOrders,
        },
        revenue: {
          total: totalRevenue,
          platformFees: totalPlatformFees,
          freelancerEarnings: totalFreelancerEarnings,
        },
        reviews: {
          total: totalReviews,
          averageRating: averageRating[0]?.avg || 0,
        },
        monthlyOrders: last12Months,
      },
    });
  } catch (error) {
    console.error("Erreur getStats:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des statistiques",
      error: error.message,
    });
  }
};

// ========== GESTION DES UTILISATEURS ==========

// @desc    Obtenir tous les utilisateurs
// @route   GET /api/admin/users
// @access  Private (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const { role, isActive, search, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === "true";
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;
    const total = await User.countDocuments(filter);

    const users = await User.find(filter)
      .select("-password")
      .sort("-createdAt")
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      users,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Erreur getAllUsers:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des utilisateurs",
    });
  }
};

// @desc    Obtenir un utilisateur par ID
// @route   GET /api/admin/users/:id
// @access  Private (Admin only)
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    // Récupérer les services du freelancer
    let services = [];
    if (user.role === "freelancer") {
      services = await Service.find({ freelancerId: user._id });
    }

    // Récupérer les commandes
    const orders = await Order.find({
      $or: [{ clientId: user._id }, { freelancerId: user._id }],
    }).limit(10);

    res.status(200).json({
      success: true,
      user,
      services,
      orders,
    });
  } catch (error) {
    console.error("Erreur getUserById:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération de l'utilisateur",
    });
  }
};

// @desc    Mettre à jour un utilisateur
// @route   PUT /api/admin/users/:id
// @access  Private (Admin only)
const updateUser = async (req, res) => {
  try {
    const { name, email, role, isActive, isVerified, balance, phone, city } =
      req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (isActive !== undefined) user.isActive = isActive;
    if (isVerified !== undefined) user.isVerified = isVerified;
    if (balance !== undefined) user.balance = balance;
    if (phone) user.phone = phone;
    if (city) user.city = city;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Utilisateur mis à jour avec succès",
      user,
    });
  } catch (error) {
    console.error("Erreur updateUser:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour de l'utilisateur",
    });
  }
};

// @desc    Désactiver un utilisateur
// @route   PUT /api/admin/users/:id/disable
// @access  Private (Admin only)
const disableUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    user.isActive = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Utilisateur désactivé avec succès",
      user,
    });
  } catch (error) {
    console.error("Erreur disableUser:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la désactivation",
    });
  }
};

// @desc    Activer un utilisateur
// @route   PUT /api/admin/users/:id/enable
// @access  Private (Admin only)
const enableUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    user.isActive = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Utilisateur activé avec succès",
      user,
    });
  } catch (error) {
    console.error("Erreur enableUser:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'activation",
    });
  }
};

// @desc    Supprimer un utilisateur
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin only)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    // Supprimer les services du freelancer
    if (user.role === "freelancer") {
      await Service.deleteMany({ freelancerId: user._id });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: "Utilisateur supprimé avec succès",
    });
  } catch (error) {
    console.error("Erreur deleteUser:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression",
    });
  }
};

// ========== GESTION DES SERVICES ==========

// @desc    Obtenir tous les services (admin)
// @route   GET /api/admin/services
// @access  Private (Admin only)
const getAllServices = async (req, res) => {
  try {
    const { status, category, search, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (search) {
      filter.$text = { $search: search };
    }

    const skip = (page - 1) * limit;
    const total = await Service.countDocuments(filter);

    const services = await Service.find(filter)
      .populate("freelancerId", "name email")
      .sort("-createdAt")
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      services,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Erreur getAllServices:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des services",
    });
  }
};

// @desc    Mettre à jour un service (admin)
// @route   PUT /api/admin/services/:id
// @access  Private (Admin only)
const updateService = async (req, res) => {
  try {
    const { title, description, category, price, deliveryDays, status } =
      req.body;

    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service non trouvé",
      });
    }

    if (title) service.title = title;
    if (description) service.description = description;
    if (category) service.category = category;
    if (price) service.price = price;
    if (deliveryDays) service.deliveryDays = deliveryDays;
    if (status) service.status = status;

    await service.save();

    res.status(200).json({
      success: true,
      message: "Service mis à jour avec succès",
      service,
    });
  } catch (error) {
    console.error("Erreur updateService:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour du service",
    });
  }
};

// @desc    Supprimer un service (admin)
// @route   DELETE /api/admin/services/:id
// @access  Private (Admin only)
const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service non trouvé",
      });
    }

    await service.deleteOne();

    res.status(200).json({
      success: true,
      message: "Service supprimé avec succès",
    });
  } catch (error) {
    console.error("Erreur deleteService:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression du service",
    });
  }
};

// ========== GESTION DES COMMANDES ==========

// @desc    Obtenir toutes les commandes (admin)
// @route   GET /api/admin/orders
// @access  Private (Admin only)
const getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (status) filter.status = status;

    const skip = (page - 1) * limit;
    const total = await Order.countDocuments(filter);

    const orders = await Order.find(filter)
      .populate("serviceId", "title")
      .populate("clientId", "name email")
      .populate("freelancerId", "name email")
      .sort("-createdAt")
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      orders,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Erreur getAllOrders:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des commandes",
    });
  }
};

// @desc    Mettre à jour le statut d'une commande (admin)
// @route   PUT /api/admin/orders/:id/status
// @access  Private (Admin only)
const updateOrderStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Commande non trouvée",
      });
    }

    order.status = status;
    if (adminNotes) order.adminNotes = adminNotes;

    if (status === "completed") order.completedAt = new Date();
    if (status === "cancelled") order.cancelledAt = new Date();

    await order.save();

    res.status(200).json({
      success: true,
      message: `Statut de la commande mis à jour: ${status}`,
      order,
    });
  } catch (error) {
    console.error("Erreur updateOrderStatus:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour du statut",
    });
  }
};

// ========== GESTION DES REVIEWS ==========

// @desc    Obtenir tous les reviews signalés
// @route   GET /api/admin/reviews/reported
// @access  Private (Admin only)
const getReportedReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ status: "reported" })
      .populate("clientId", "name email")
      .populate("freelancerId", "name email")
      .populate("serviceId", "title")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error("Erreur getReportedReviews:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des reviews signalés",
    });
  }
};

// @desc    Approuver un review signalé
// @route   PUT /api/admin/reviews/:id/approve
// @access  Private (Admin only)
const approveReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review non trouvé",
      });
    }

    review.status = "active";
    await review.save();

    res.status(200).json({
      success: true,
      message: "Review approuvé avec succès",
    });
  } catch (error) {
    console.error("Erreur approveReview:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'approbation",
    });
  }
};

// @desc    Masquer un review signalé
// @route   PUT /api/admin/reviews/:id/hide
// @access  Private (Admin only)
const hideReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review non trouvé",
      });
    }

    review.status = "hidden";
    await review.save();

    res.status(200).json({
      success: true,
      message: "Review masqué avec succès",
    });
  } catch (error) {
    console.error("Erreur hideReview:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors du masquage",
    });
  }
};

// ========== GESTION DES CATÉGORIES ==========

// @desc    Obtenir toutes les catégories
// @route   GET /api/admin/categories
// @access  Private (Admin only)
const getCategories = async (req, res) => {
  try {
    const categories = [
      { id: "graphic-design", name: "Design Graphique", icon: "🎨", count: 0 },
      {
        id: "web-development",
        name: "Développement Web",
        icon: "💻",
        count: 0,
      },
      { id: "marketing", name: "Marketing Digital", icon: "📈", count: 0 },
      { id: "writing", name: "Rédaction", icon: "✍️", count: 0 },
      { id: "video", name: "Vidéo & Animation", icon: "🎥", count: 0 },
      { id: "music", name: "Musique & Audio", icon: "🎵", count: 0 },
      { id: "business", name: "Business", icon: "💼", count: 0 },
      { id: "lifestyle", name: "Lifestyle", icon: "🌟", count: 0 },
    ];

    // Compter les services par catégorie
    for (let cat of categories) {
      cat.count = await Service.countDocuments({
        category: cat.id,
        status: "active",
      });
    }

    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error("Erreur getCategories:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des catégories",
    });
  }
};


// @desc    Statistiques avancées pour Dashboard
// @route   GET /api/admin/dashboard/stats
// @access  Private (Admin only)
const getDashboardStats = async (req, res) => {
  try {
    // === Statistiques utilisateurs ===
    const totalUsers = await User.countDocuments();
    const newUsersToday = await User.countDocuments({
      createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
    });
    const newUsersThisWeek = await User.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    });
    const activeUsers = await User.countDocuments({
      lastLogin: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    });

    // === Statistiques commandes ===
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: "pending" });
    const completedOrders = await Order.countDocuments({ status: "completed" });
    const cancelledOrders = await Order.countDocuments({ status: "cancelled" });

    // Commandes par statut
    const ordersByStatus = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    // === Chiffre d'affaires ===
    const revenueStats = await Order.aggregate([
      { $match: { status: "completed" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$price" },
          totalFees: { $sum: "$platformFee" },
          totalFreelancerEarnings: { $sum: "$freelancerEarnings" },
        },
      },
    ]);

    // === Évolution mensuelle ===
    const monthlyStats = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const ordersCount = await Order.countDocuments({
        createdAt: { $gte: monthStart, $lte: monthEnd },
      });

      const revenue = await Order.aggregate([
        {
          $match: {
            status: "completed",
            createdAt: { $gte: monthStart, $lte: monthEnd },
          },
        },
        { $group: { _id: null, total: { $sum: "$price" } } },
      ]);

      monthlyStats.push({
        month: monthStart.toLocaleString("default", { month: "short" }),
        year: date.getFullYear(),
        orders: ordersCount,
        revenue: revenue[0]?.total || 0,
      });
    }

    // === Top freelancers ===
    const topFreelancers = await User.aggregate([
      { $match: { role: "freelancer", isActive: true } },
      {
        $lookup: {
          from: "orders",
          localField: "_id",
          foreignField: "freelancerId",
          as: "orders",
        },
      },
      {
        $addFields: {
          totalEarnings: { $sum: "$orders.freelancerEarnings" },
          totalOrders: { $size: "$orders" },
        },
      },
      { $sort: { totalEarnings: -1 } },
      { $limit: 5 },
      {
        $project: {
          name: 1,
          email: 1,
          avatar: 1,
          totalEarnings: 1,
          totalOrders: 1,
          rating: 1,
        },
      },
    ]);

    // === Top clients ===
    const topClients = await User.aggregate([
      { $match: { role: "client", isActive: true } },
      {
        $lookup: {
          from: "orders",
          localField: "_id",
          foreignField: "clientId",
          as: "orders",
        },
      },
      {
        $addFields: {
          totalSpent: { $sum: "$orders.price" },
          totalOrders: { $size: "$orders" },
        },
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 5 },
      {
        $project: {
          name: 1,
          email: 1,
          avatar: 1,
          totalSpent: 1,
          totalOrders: 1,
        },
      },
    ]);

    // === Top services ===
    const topServices = await Service.aggregate([
      { $match: { status: "active" } },
      {
        $lookup: {
          from: "orders",
          localField: "_id",
          foreignField: "serviceId",
          as: "orders",
        },
      },
      {
        $addFields: {
          totalOrders: { $size: "$orders" },
          totalRevenue: { $sum: "$orders.price" },
        },
      },
      { $sort: { totalOrders: -1 } },
      { $limit: 5 },
      {
        $project: {
          title: 1,
          category: 1,
          price: 1,
          totalOrders: 1,
          totalRevenue: 1,
          rating: 1,
        },
      },
    ]);

    // === Distribution par catégorie ===
    const categoryDistribution = await Service.aggregate([
      { $match: { status: "active" } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // === Notifications non lues ===
    const unreadNotifications = await Notification.countDocuments({
      isRead: false,
    });

    res.json({
      success: true,
      stats: {
        users: {
          total: totalUsers,
          newToday: newUsersToday,
          newThisWeek: newUsersThisWeek,
          active: activeUsers,
        },
        orders: {
          total: totalOrders,
          pending: pendingOrders,
          completed: completedOrders,
          cancelled: cancelledOrders,
          byStatus: ordersByStatus,
        },
        revenue: revenueStats[0] || {
          totalRevenue: 0,
          totalFees: 0,
          totalFreelancerEarnings: 0,
        },
        monthlyStats,
        topFreelancers,
        topClients,
        topServices,
        categoryDistribution,
        unreadNotifications,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Exporter les données (CSV)
// @route   GET /api/admin/export/:type
// @access  Private (Admin only)
const exportData = async (req, res) => {
  try {
    const { type } = req.params;
    let data = [];

    switch (type) {
      case "users":
        data = await User.find({}).select("-password");
        break;
      case "orders":
        data = await Order.find({}).populate(
          "clientId freelancerId",
          "name email",
        );
        break;
      case "services":
        data = await Service.find({}).populate("freelancerId", "name email");
        break;
      default:
        return res
          .status(400)
          .json({ success: false, message: "Type non valide" });
    }

    res.json({ success: true, count: data.length, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  // Stats
  getStats,
  getDashboardStats,
  exportData,
  // Users
  getAllUsers,
  getUserById,
  updateUser,
  disableUser,
  enableUser,
  deleteUser,
  // Services
  getAllServices,
  updateService,
  deleteService,
  // Orders
  getAllOrders,
  updateOrderStatus,
  // Reviews
  getReportedReviews,
  approveReview,
  hideReview,
  // Categories
  getCategories,
};
