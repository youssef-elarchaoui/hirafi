// src/pages/client/MyOrders.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { orderApi } from "../../api/orderApi";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";
import {
  FiPackage,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiEye,
  FiSearch,
  FiFilter,
  FiCalendar,
  FiDollarSign,
  FiUser,
  FiMessageSquare,
  FiDownload,
  FiTrendingUp,
  FiChevronLeft,
  FiChevronRight,
  FiRefreshCw,
  FiStar,
  FiTruck,
  FiAlertCircle,
} from "react-icons/fi";

const MyOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const itemsPerPage = 10;

  useEffect(() => {
    fetchOrders();
  }, [currentPage, statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await orderApi.getMyOrders();
      console.log("Commandes reçues:", response.data);

      let ordersList = response.data.orders || [];

      // Filtrer par statut
      if (statusFilter !== "all") {
        ordersList = ordersList.filter(
          (order) => order.status === statusFilter,
        );
      }

      // Filtrer par recherche
      if (searchTerm) {
        ordersList = ordersList.filter(
          (order) =>
            order.serviceId?.title
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            order.freelancerId?.name
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            order._id.toLowerCase().includes(searchTerm.toLowerCase()),
        );
      }

      // Pagination
      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      const paginatedOrders = ordersList.slice(start, end);

      setOrders(paginatedOrders);
      setTotalPages(Math.ceil(ordersList.length / itemsPerPage));
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Impossible de charger vos commandes");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fonction completeOrder corrigée utilisant updateStatus
  const completeOrder = async (orderId) => {
    const confirmComplete = window.confirm(
      "Confirmez-vous la réception de cette commande ?",
    );
    if (!confirmComplete) return;

    const completeToast = toast.loading("Validation en cours...");
    try {
      // Utiliser updateStatus au lieu de completeOrder
      const response = await orderApi.updateStatus(orderId, "completed");
      if (response.data.success) {
        toast.success("✓ Commande validée avec succès !", {
          id: completeToast,
          duration: 3000,
          icon: "🎉",
        });
        fetchOrders();
        if (selectedOrder?._id === orderId) {
          setSelectedOrder(null);
        }
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Erreur lors de la validation",
        {
          id: completeToast,
          duration: 4000,
        },
      );
    }
  };

  const cancelOrder = async (orderId) => {
    const confirmCancel = window.confirm(
      "Êtes-vous sûr de vouloir annuler cette commande ?",
    );
    if (!confirmCancel) return;

    const cancelToast = toast.loading("Annulation en cours...");
    try {
      const response = await orderApi.cancelOrder(orderId);
      if (response.data.success) {
        toast.success("✓ Commande annulée avec succès !", {
          id: cancelToast,
          duration: 3000,
        });
        fetchOrders();
        if (selectedOrder?._id === orderId) {
          setSelectedOrder(null);
        }
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Erreur lors de l'annulation",
        {
          id: cancelToast,
          duration: 4000,
        },
      );
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        label: "En attente",
        color: "bg-yellow-50 text-yellow-600",
        icon: FiClock,
      },
      "in-progress": {
        label: "En cours",
        color: "bg-blue-50 text-blue-600",
        icon: FiPackage,
      },
      delivered: {
        label: "Livré",
        color: "bg-purple-50 text-purple-600",
        icon: FiTruck,
      },
      completed: {
        label: "Terminé",
        color: "bg-green-50 text-green-600",
        icon: FiCheckCircle,
      },
      cancelled: {
        label: "Annulé",
        color: "bg-red-50 text-red-600",
        icon: FiXCircle,
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        <Icon size={12} />
        {config.label}
      </span>
    );
  };

  const getAvailableActions = (status) => {
    if (status === "pending") {
      return [
        {
          label: "Annuler",
          action: cancelOrder,
          className:
            "text-red-500 hover:bg-red-50 border border-red-200 hover:border-red-300",
        },
      ];
    }
    if (status === "delivered") {
      return [
        {
          label: "✅ Valider la réception",
          action: completeOrder,
          className: "bg-green-500 hover:bg-green-600 text-white",
        },
      ];
    }
    return [];
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("fr-MA").format(price || 0);
  };

  // Statistiques
  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    inProgress: orders.filter((o) => o.status === "in-progress").length,
    completed: orders.filter((o) => o.status === "completed").length,
    totalSpent: orders.reduce((sum, o) => sum + (o.price || 0), 0),
  };

  // Re-fetch quand search change
  useEffect(() => {
    fetchOrders();
  }, [searchTerm]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-3 border-[#E8EDE6] rounded-full"></div>
          <div className="absolute inset-0 border-3 border-[#3D5A3E] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-[#1A1208]">
            Mes commandes
          </h1>
          <p className="text-[#6B5E4F] text-sm mt-1">
            Suivez l'état de toutes vos commandes
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E8E2D9] rounded-xl text-[#6B5E4F] hover:text-[#3D5A3E] transition-all"
        >
          <FiRefreshCw size={16} />
          Actualiser
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-[#E8E2D9] p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#6B5E4F] text-sm">Total commandes</span>
            <FiPackage className="text-[#3D5A3E]" size={18} />
          </div>
          <div className="text-2xl font-bold text-[#1A1208]">{stats.total}</div>
        </div>
        <div className="bg-white rounded-xl border border-[#E8E2D9] p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#6B5E4F] text-sm">En attente</span>
            <FiClock className="text-yellow-500" size={18} />
          </div>
          <div className="text-2xl font-bold text-yellow-600">
            {stats.pending}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[#E8E2D9] p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#6B5E4F] text-sm">En cours</span>
            <FiPackage className="text-blue-500" size={18} />
          </div>
          <div className="text-2xl font-bold text-blue-600">
            {stats.inProgress}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[#E8E2D9] p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#6B5E4F] text-sm">Dépenses totales</span>
            <FiDollarSign className="text-[#3D5A3E]" size={18} />
          </div>
          <div className="text-2xl font-bold text-[#3D5A3E]">
            {formatPrice(stats.totalSpent)} DH
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <FiSearch
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9B9082]"
            size={18}
          />
          <input
            type="text"
            placeholder="Rechercher par service, artisan ou ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-[#E8E2D9] rounded-xl focus:outline-none focus:border-[#3D5A3E] transition-all"
          />
        </div>
        <div className="flex gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-white border border-[#E8E2D9] rounded-xl focus:outline-none focus:border-[#3D5A3E] text-sm"
          >
            <option value="all">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="in-progress">En cours</option>
            <option value="delivered">Livré</option>
            <option value="completed">Terminé</option>
            <option value="cancelled">Annulé</option>
          </select>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#E8E2D9] pb-2">
        {[
          "all",
          "pending",
          "in-progress",
          "delivered",
          "completed",
          "cancelled",
        ].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-1.5 rounded-full text-sm transition-all ${
              statusFilter === status
                ? "bg-[#3D5A3E] text-white"
                : "text-[#6B5E4F] hover:bg-[#E8EDE6]"
            }`}
          >
            {status === "all"
              ? "Tous"
              : status === "pending"
                ? "En attente"
                : status === "in-progress"
                  ? "En cours"
                  : status === "delivered"
                    ? "Livré"
                    : status === "completed"
                      ? "Terminé"
                      : "Annulé"}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-[#E8E2D9]">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-heading font-semibold text-[#1A1208] mb-2">
            Aucune commande
          </h3>
          <p className="text-[#6B5E4F] mb-6">
            {searchTerm
              ? "Aucune commande ne correspond à votre recherche"
              : "Vous n'avez pas encore passé de commandes"}
          </p>
          {!searchTerm && (
            <Link
              to="/services"
              className="inline-flex items-center gap-2 bg-[#3D5A3E] hover:bg-[#2D452E] text-white px-6 py-2 rounded-xl font-semibold transition-all"
            >
              Explorer les services
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-2xl border border-[#E8E2D9] overflow-hidden hover:shadow-md transition-all"
            >
              {/* En-tête */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 bg-[#FAF8F5] border-b border-[#E8E2D9]">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-xs font-mono text-[#6B5E4F]">
                    #{order._id?.slice(-8)}
                  </span>
                  {getStatusBadge(order.status)}
                </div>
                <div className="flex items-center gap-4 text-xs text-[#6B5E4F]">
                  <span className="flex items-center gap-1">
                    <FiCalendar size={12} />
                    {formatDate(order.createdAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <FiDollarSign size={12} />
                    {formatPrice(order.price)} DH
                  </span>
                </div>
              </div>

              {/* Contenu */}
              <div className="p-4">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Info service */}
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-lg bg-[#E8EDE6] flex items-center justify-center text-2xl flex-shrink-0">
                        {order.serviceId?.category === "graphic-design" && "🎨"}
                        {order.serviceId?.category === "web-development" &&
                          "💻"}
                        {order.serviceId?.category === "marketing" && "📈"}
                        {!order.serviceId?.category && "✨"}
                      </div>
                      <div>
                        <Link
                          to={`/services/${order.serviceId?._id}`}
                          className="font-heading font-semibold text-[#1A1208] hover:text-[#3D5A3E] transition-colors"
                        >
                          {order.serviceId?.title || "Service"}
                        </Link>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-[#6B5E4F] mt-1">
                          <span className="flex items-center gap-1">
                            <FiUser size={12} />
                            {order.freelancerId?.name || "Artisan"}
                          </span>
                          <span className="flex items-center gap-1">
                            <FiDollarSign size={12} />
                            {formatPrice(order.price)} DH
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() =>
                        setSelectedOrder(
                          selectedOrder?._id === order._id ? null : order,
                        )
                      }
                      className="px-3 py-1.5 text-sm border border-[#E8E2D9] rounded-lg text-[#6B5E4F] hover:border-[#3D5A3E] hover:text-[#3D5A3E] transition-all"
                    >
                      {selectedOrder?._id === order._id ? "Masquer" : "Détails"}
                    </button>

                    {getAvailableActions(order.status).map((action) => (
                      <button
                        key={action.label}
                        onClick={() => action.action(order._id)}
                        disabled={updatingStatus}
                        className={`px-3 py-1.5 text-sm rounded-lg transition-all ${action.className}`}
                      >
                        {action.label}
                      </button>
                    ))}

                    <Link
                      to={`/messages?order=${order._id}`}
                      className="px-3 py-1.5 text-sm bg-[#E8EDE6] text-[#3D5A3E] rounded-lg hover:bg-[#3D5A3E] hover:text-white transition-all flex items-center gap-1"
                    >
                      <FiMessageSquare size={14} />
                      Message
                    </Link>
                  </div>
                </div>

                {/* Détails expansibles */}
                {selectedOrder?._id === order._id && (
                  <div className="mt-4 pt-4 border-t border-[#E8E2D9] animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-[#1A1208] text-sm mb-2">
                          Description du projet
                        </h4>
                        <p className="text-[#6B5E4F] text-sm bg-[#FAF8F5] p-3 rounded-lg">
                          {order.requirements || "Aucune description fournie"}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#1A1208] text-sm mb-2">
                          Informations artisan
                        </h4>
                        <div className="space-y-1 text-sm text-[#6B5E4F] bg-[#FAF8F5] p-3 rounded-lg">
                          <p>
                            <span className="font-medium">Nom:</span>{" "}
                            {order.freelancerId?.name || "N/A"}
                          </p>
                          <p>
                            <span className="font-medium">Email:</span>{" "}
                            {order.freelancerId?.email || "N/A"}
                          </p>
                          <p>
                            <span className="font-medium">Téléphone:</span>{" "}
                            {order.freelancerId?.phone || "Non renseigné"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="p-2 border border-[#E8E2D9] rounded-lg disabled:opacity-50 hover:border-[#3D5A3E] transition-all"
          >
            <FiChevronLeft size={18} />
          </button>
          <span className="flex items-center px-4 text-sm text-[#6B5E4F]">
            Page {currentPage} sur {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
            className="p-2 border border-[#E8E2D9] rounded-lg disabled:opacity-50 hover:border-[#3D5A3E] transition-all"
          >
            <FiChevronRight size={18} />
          </button>
        </div>
      )}

      <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fadeIn 0.2s ease-out;
                }
            `}</style>
    </div>
  );
};

export default MyOrders;
