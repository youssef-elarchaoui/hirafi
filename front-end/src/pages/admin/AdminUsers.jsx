// src/pages/admin/AdminUsers.jsx
import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import toast from 'react-hot-toast';
import { 
  FiUsers, FiSearch, FiFilter, FiEdit2, FiTrash2,
  FiUserCheck, FiUserX, FiRefreshCw, FiEye,
  FiChevronLeft, FiChevronRight, FiX, FiCheck,
  FiMail, FiMapPin, FiPhone, FiCalendar
} from 'react-icons/fi';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showUserModal, setShowUserModal] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, [currentPage, roleFilter, statusFilter]);

    const fetchUsers = async () => {
        setLoading(true);
        setRefreshing(true);
        try {
            const params = new URLSearchParams();
            if (roleFilter !== 'all') params.append('role', roleFilter);
            if (statusFilter !== 'all') params.append('isActive', statusFilter === 'active');
            if (searchTerm) params.append('search', searchTerm);
            params.append('page', currentPage);
            params.append('limit', 10);

            const response = await adminApi.getUsers(params);
            console.log('👥 Utilisateurs reçus:', response.data);
            
            setUsers(response.data.users || []);
            setTotalPages(response.data.pagination?.pages || 1);
        } catch (error) {
            console.error('Erreur:', error);
            toast.error('Impossible de charger les utilisateurs');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleToggleStatus = async (userId, currentStatus) => {
        const action = currentStatus ? 'désactiver' : 'activer';
        const confirmAction = window.confirm(`Êtes-vous sûr de vouloir ${action} cet utilisateur ?`);
        if (!confirmAction) return;

        try {
            const response = currentStatus 
                ? await adminApi.disableUser(userId)
                : await adminApi.enableUser(userId);
            
            if (response.data.success) {
                toast.success(`Utilisateur ${action} avec succès`);
                fetchUsers();
            }
        } catch (error) {
            toast.error('Erreur lors de l\'opération');
        }
    };

    const handleDeleteUser = async (userId, userName) => {
        const confirmDelete = window.confirm(`Êtes-vous sûr de vouloir supprimer définitivement "${userName}" ?`);
        if (!confirmDelete) return;

        try {
            const response = await adminApi.deleteUser(userId);
            if (response.data.success) {
                toast.success('Utilisateur supprimé avec succès');
                fetchUsers();
            }
        } catch (error) {
            toast.error('Erreur lors de la suppression');
        }
    };

    const viewUserDetails = async (userId) => {
        try {
            const response = await adminApi.getUserById(userId);
            setSelectedUser(response.data.user);
            setShowUserModal(true);
        } catch (error) {
            toast.error('Impossible de charger les détails');
        }
    };

    const getRoleBadge = (role) => {
        const config = {
            'admin': { label: 'Admin', color: 'bg-red-50 text-red-600' },
            'freelancer': { label: 'Artisan', color: 'bg-blue-50 text-blue-600' },
            'client': { label: 'Client', color: 'bg-green-50 text-green-600' }
        };
        const { label, color } = config[role] || config.client;
        return <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>{label}</span>;
    };

    const getStatusBadge = (isActive) => {
        return isActive 
            ? <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-600">Actif</span>
            : <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-50 text-red-600">Inactif</span>;
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
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
                    <h1 className="text-2xl font-heading font-bold text-[#1A1208] flex items-center gap-2">
                        <FiUsers className="text-[#3D5A3E]" />
                        Utilisateurs
                    </h1>
                    <p className="text-[#6B5E4F] text-sm mt-1">
                        Gérez tous les utilisateurs de la plateforme
                    </p>
                </div>
                <button 
                    onClick={fetchUsers}
                    disabled={refreshing}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E8E2D9] rounded-xl text-[#6B5E4F] hover:text-[#3D5A3E] transition-all"
                >
                    <FiRefreshCw className={refreshing ? 'animate-spin' : ''} size={16} />
                    Actualiser
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 max-w-md">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9B9082]" size={18} />
                    <input
                        type="text"
                        placeholder="Rechercher par nom ou email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && fetchUsers()}
                        className="w-full pl-10 pr-4 py-2 bg-white border border-[#E8E2D9] rounded-xl focus:outline-none focus:border-[#3D5A3E] transition-all"
                    />
                </div>
                <div className="flex gap-3">
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="px-4 py-2 bg-white border border-[#E8E2D9] rounded-xl focus:outline-none focus:border-[#3D5A3E] text-sm"
                    >
                        <option value="all">Tous les rôles</option>
                        <option value="client">Clients</option>
                        <option value="freelancer">Artisans</option>
                        <option value="admin">Admins</option>
                    </select>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 bg-white border border-[#E8E2D9] rounded-xl focus:outline-none focus:border-[#3D5A3E] text-sm"
                    >
                        <option value="all">Tous les statuts</option>
                        <option value="active">Actifs</option>
                        <option value="inactive">Inactifs</option>
                    </select>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-2xl border border-[#E8E2D9] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[#FAF8F5] border-b border-[#E8E2D9]">
                            <tr>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B5E4F] uppercase">Utilisateur</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B5E4F] uppercase">Rôle</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B5E4F] uppercase">Statut</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B5E4F] uppercase">Inscrit le</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B5E4F] uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-8 text-[#6B5E4F]">
                                        Aucun utilisateur trouvé
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user._id} className="border-b border-[#E8E2D9] hover:bg-[#FAF8F5] transition-colors">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#3D5A3E] to-[#2D452E] flex items-center justify-center text-white font-bold text-sm">
                                                    {user.name?.charAt(0) || 'U'}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-[#1A1208] text-sm">{user.name}</p>
                                                    <p className="text-xs text-[#6B5E4F]">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">{getRoleBadge(user.role)}</td>
                                        <td className="py-3 px-4">{getStatusBadge(user.isActive)}</td>
                                        <td className="py-3 px-4">
                                            <span className="text-sm text-[#6B5E4F]">{formatDate(user.createdAt)}</span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => viewUserDetails(user._id)}
                                                    className="p-1.5 text-[#6B5E4F] hover:text-[#3D5A3E] rounded-lg hover:bg-[#E8EDE6] transition-all"
                                                    title="Voir détails"
                                                >
                                                    <FiEye size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleToggleStatus(user._id, user.isActive)}
                                                    className={`p-1.5 rounded-lg transition-all ${
                                                        user.isActive 
                                                            ? 'text-yellow-600 hover:bg-yellow-50' 
                                                            : 'text-green-600 hover:bg-green-50'
                                                    }`}
                                                    title={user.isActive ? 'Désactiver' : 'Activer'}
                                                >
                                                    {user.isActive ? <FiUserX size={16} /> : <FiUserCheck size={16} />}
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(user._id, user.name)}
                                                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                    title="Supprimer"
                                                >
                                                    <FiTrash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="p-2 border border-[#E8E2D9] rounded-lg disabled:opacity-50 hover:border-[#3D5A3E] transition-all"
                    >
                        <FiChevronLeft size={18} />
                    </button>
                    <span className="flex items-center px-4 text-sm text-[#6B5E4F]">
                        Page {currentPage} sur {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 border border-[#E8E2D9] rounded-lg disabled:opacity-50 hover:border-[#3D5A3E] transition-all"
                    >
                        <FiChevronRight size={18} />
                    </button>
                </div>
            )}

            {/* User Details Modal */}
            {showUserModal && selectedUser && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-xl font-heading font-bold text-[#1A1208]">
                                Détails de l'utilisateur
                            </h2>
                            <button
                                onClick={() => setShowUserModal(false)}
                                className="p-1.5 rounded-lg hover:bg-[#E8EDE6] transition-all"
                            >
                                <FiX size={20} />
                            </button>
                        </div>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#3D5A3E] to-[#2D452E] flex items-center justify-center text-white text-3xl font-bold">
                                {selectedUser.name?.charAt(0) || 'U'}
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-[#1A1208]">{selectedUser.name}</h3>
                                <p className="text-[#6B5E4F]">{selectedUser.email}</p>
                                <div className="flex gap-2 mt-1">
                                    {getRoleBadge(selectedUser.role)}
                                    {getStatusBadge(selectedUser.isActive)}
                                    {selectedUser.isVerified && (
                                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-600">
                                            Vérifié
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-3 bg-[#FAF8F5] rounded-xl">
                                <p className="text-xs text-[#6B5E4F] uppercase">Téléphone</p>
                                <p className="font-medium text-[#1A1208]">{selectedUser.phone || 'Non renseigné'}</p>
                            </div>
                            <div className="p-3 bg-[#FAF8F5] rounded-xl">
                                <p className="text-xs text-[#6B5E4F] uppercase">Ville</p>
                                <p className="font-medium text-[#1A1208]">{selectedUser.city || 'Non renseigné'}</p>
                            </div>
                            <div className="p-3 bg-[#FAF8F5] rounded-xl">
                                <p className="text-xs text-[#6B5E4F] uppercase">Membre depuis</p>
                                <p className="font-medium text-[#1A1208]">{formatDate(selectedUser.createdAt)}</p>
                            </div>
                            <div className="p-3 bg-[#FAF8F5] rounded-xl">
                                <p className="text-xs text-[#6B5E4F] uppercase">Dernière connexion</p>
                                <p className="font-medium text-[#1A1208]">{selectedUser.lastLogin ? formatDate(selectedUser.lastLogin) : 'Jamais'}</p>
                            </div>
                        </div>

                        {selectedUser.role === 'freelancer' && (
                            <div className="mt-4 p-3 bg-[#FAF8F5] rounded-xl">
                                <p className="text-xs text-[#6B5E4F] uppercase">Compétences</p>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {selectedUser.skills?.length > 0 ? (
                                        selectedUser.skills.map((skill, idx) => (
                                            <span key={idx} className="px-2 py-1 bg-white border border-[#E8E2D9] rounded-full text-xs text-[#3D5A3E]">
                                                {skill}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-[#6B5E4F] text-sm">Aucune compétence renseignée</span>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="flex gap-3 mt-6 pt-4 border-t border-[#E8E2D9]">
                            <button
                                onClick={() => handleToggleStatus(selectedUser._id, selectedUser.isActive)}
                                className={`flex-1 py-2 rounded-xl font-semibold transition-all ${
                                    selectedUser.isActive 
                                        ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100' 
                                        : 'bg-green-50 text-green-600 hover:bg-green-100'
                                }`}
                            >
                                {selectedUser.isActive ? 'Désactiver' : 'Activer'}
                            </button>
                            <button
                                onClick={() => {
                                    setShowUserModal(false);
                                    handleDeleteUser(selectedUser._id, selectedUser.name);
                                }}
                                className="flex-1 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl font-semibold transition-all"
                            >
                                Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;