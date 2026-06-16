// controllers/userController.js
const User = require("../models/User");
const Service = require("../models/Service");
const Order = require("../models/Order");

const getMyStats = async (req, res) => {
  try {
    const userId = req.user._id;

    console.log("📊 Récupération des stats pour:", userId);

    const totalServices = await Service.countDocuments({
      freelancerId: userId,
      status: { $ne: "deleted" },
    });

    const totalOrders = await Order.countDocuments({
      freelancerId: userId,
    });

    const completedOrders = await Order.countDocuments({
      freelancerId: userId,
      status: "completed",
    });

    const completedOrdersList = await Order.find({
      freelancerId: userId,
      status: "completed",
    });
    const totalEarnings = completedOrdersList.reduce(
      (sum, order) => sum + order.price,
      0,
    );

    const user = await User.findById(userId);
    const rating = user?.rating || 0;

    console.log("📊 Stats:", {
      totalServices,
      totalOrders,
      completedOrders,
      totalEarnings,
      rating,
    });

    res.status(200).json({
      success: true,
      stats: {
        totalServices,
        totalOrders,
        completedOrders,
        totalEarnings,
        rating,
      },
    });
  } catch (error) {
    console.error("Erreur getMyStats:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des statistiques",
    });
  }
};
// @desc    Obtenir tous les freelancers
// @route   GET /api/users/freelancers
// @access  Public
const getFreelancers = async (req, res) => {
  try {
    const freelancers = await User.find({
      role: "freelancer",
      isActive: true,
    }).select("-password");

    res.status(200).json({
      success: true,
      count: freelancers.length,
      freelancers,
    });
  } catch (error) {
    console.error("Erreur getFreelancers:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des freelancers",
    });
  }
};

// @desc    Obtenir un freelancer par ID
// @route   GET /api/users/freelancers/:id
// @access  Public
const getFreelancerById = async (req, res) => {
  try {
    const freelancer = await User.findOne({
      _id: req.params.id,
      role: "freelancer",
      isActive: true,
    }).select("-password");

    if (!freelancer) {
      return res.status(404).json({
        success: false,
        message: "Freelancer non trouvé",
      });
    }

    res.status(200).json({
      success: true,
      freelancer,
    });
  } catch (error) {
    console.error("Erreur getFreelancerById:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération du freelancer",
    });
  }
};

module.exports = {
  getMyStats,
  getFreelancers,
  getFreelancerById,
};
