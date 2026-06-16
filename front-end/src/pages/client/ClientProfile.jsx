// src/pages/client/ClientProfile.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { userApi } from '../../api/userApi';
import { uploadApi } from '../../api/uploadApi';
import toast from 'react-hot-toast';
import { 
  FiUser, FiMail, FiPhone, FiMapPin, FiSave, FiEdit2,
  FiCamera, FiCheckCircle, FiShoppingBag, FiDollarSign,
  FiCalendar, FiAward, FiShield, FiLogOut
} from 'react-icons/fi';
import { Link } from 'react-router-dom';

const ClientProfile = () => {
    const { user, setUser, logout } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalSpent: 0,
        totalReviews: 0
    });
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        city: ''
    });
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                city: user.city || ''
            });
            setAvatarPreview(user.avatar || null);
            setStats({
                totalOrders: user.totalOrders || 0,
                totalSpent: user.totalSpent || 0,
                totalReviews: user.totalReviews || 0
            });
            setLoading(false);
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('L\'image ne doit pas dépasser 5MB');
                return;
            }
            if (!file.type.startsWith('image/')) {
                toast.error('Veuillez sélectionner une image');
                return;
            }
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
            toast.success('Image sélectionnée');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        const saveToast = toast.loading('Enregistrement en cours...');

        try {
            let avatarUrl = user?.avatar || '';
            
            if (avatarFile) {
                try {
                    const uploadResponse = await uploadApi.uploadImage(avatarFile);
                    if (uploadResponse.data.success) {
                        avatarUrl = uploadResponse.data.url;
                    }
                } catch (uploadError) {
                    console.error('Erreur upload avatar:', uploadError);
                    toast.error('Erreur lors de l\'upload de l\'avatar', {
                        id: saveToast,
                        duration: 3000,
                    });
                    setSaving(false);
                    return;
                }
            }

            const updateData = {
                name: formData.name,
                phone: formData.phone,
                city: formData.city,
                avatar: avatarUrl
            };

            console.log('📤 Envoi des données:', updateData);

            const response = await userApi.updateProfile(updateData);
            console.log('✅ Réponse:', response.data);
            
            if (response.data.success) {
                const updatedUser = { ...user, ...response.data.user };
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
                
                toast.success('✓ Profil mis à jour avec succès !', {
                    id: saveToast,
                    duration: 3000,
                    icon: '✅',
                });
                setEditMode(false);
                setAvatarFile(null);
            } else {
                toast.error(response.data.message || 'Erreur lors de la mise à jour', {
                    id: saveToast,
                    duration: 4000,
                    icon: '❌',
                });
            }
        } catch (error) {
            console.error('❌ Erreur mise à jour:', error);
            toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour du profil', {
                id: saveToast,
                duration: 4000,
                icon: '❌',
            });
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
            logout();
            window.location.href = '/login';
        }
    };

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
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-heading font-bold text-[#1A1208]">
                        Mon profil
                    </h1>
                    <p className="text-[#6B5E4F] text-sm mt-1">
                        Gérez vos informations personnelles
                    </p>
                </div>
                {!editMode && (
                    <button
                        onClick={() => setEditMode(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#3D5A3E] hover:bg-[#2D452E] text-white rounded-xl font-semibold transition-all"
                    >
                        <FiEdit2 size={16} />
                        Modifier
                    </button>
                )}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl border border-[#E8E2D9] p-4">
                    <div className="flex items-center gap-2 text-[#6B5E4F] text-sm">
                        <FiShoppingBag className="text-[#3D5A3E]" />
                        Commandes
                    </div>
                    <div className="text-2xl font-bold text-[#1A1208]">{stats.totalOrders}</div>
                </div>
                <div className="bg-white rounded-xl border border-[#E8E2D9] p-4">
                    <div className="flex items-center gap-2 text-[#6B5E4F] text-sm">
                        <FiDollarSign className="text-[#3D5A3E]" />
                        Dépenses totales
                    </div>
                    <div className="text-2xl font-bold text-[#3D5A3E]">{stats.totalSpent} DH</div>
                </div>
                <div className="bg-white rounded-xl border border-[#E8E2D9] p-4">
                    <div className="flex items-center gap-2 text-[#6B5E4F] text-sm">
                        <FiAward className="text-[#3D5A3E]" />
                        Avis donnés
                    </div>
                    <div className="text-2xl font-bold text-[#1A1208]">{stats.totalReviews}</div>
                </div>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#E8E2D9] p-6">
                {/* Avatar */}
                <div className="flex flex-col items-center mb-6">
                    <div className="relative">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-r from-[#3D5A3E] to-[#2D452E] flex items-center justify-center overflow-hidden border-4 border-[#E8EDE6]">
                            {avatarPreview ? (
                                <img 
                                    src={avatarPreview} 
                                    alt="Avatar" 
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = `https://ui-avatars.com/api/?background=3D5A3E&color=fff&bold=true&name=${formData.name || 'User'}`;
                                    }}
                                />
                            ) : (
                                <span className="text-4xl text-white font-bold">
                                    {formData.name?.charAt(0) || 'U'}
                                </span>
                            )}
                        </div>
                        {editMode && (
                            <label className="absolute bottom-0 right-0 p-2 bg-[#3D5A3E] rounded-full cursor-pointer hover:bg-[#2D452E] transition-all shadow-lg">
                                <FiCamera size={16} className="text-white" />
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                />
                            </label>
                        )}
                    </div>
                    {user?.isVerified && (
                        <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                            <FiCheckCircle size={14} /> Compte vérifié
                        </p>
                    )}
                    <p className="text-xs text-[#6B5E4F] mt-1 flex items-center gap-1">
                        <FiCalendar size={12} />
                        Membre depuis {new Date(user?.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nom */}
                    <div>
                        <label className="block text-[#1A1208] font-semibold mb-2 flex items-center gap-2">
                            <FiUser size={16} className="text-[#3D5A3E]" />
                            Nom complet
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            disabled={!editMode}
                            className={`w-full px-4 py-2 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl focus:outline-none focus:border-[#3D5A3E] transition-all ${!editMode ? 'opacity-70 cursor-not-allowed' : ''}`}
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-[#1A1208] font-semibold mb-2 flex items-center gap-2">
                            <FiMail size={16} className="text-[#3D5A3E]" />
                            Email
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            disabled
                            className="w-full px-4 py-2 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl opacity-60 cursor-not-allowed"
                        />
                        <p className="text-xs text-[#6B5E4F] mt-1">L'email ne peut pas être modifié</p>
                    </div>

                    {/* Téléphone */}
                    <div>
                        <label className="block text-[#1A1208] font-semibold mb-2 flex items-center gap-2">
                            <FiPhone size={16} className="text-[#3D5A3E]" />
                            Téléphone
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            disabled={!editMode}
                            className={`w-full px-4 py-2 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl focus:outline-none focus:border-[#3D5A3E] transition-all ${!editMode ? 'opacity-70 cursor-not-allowed' : ''}`}
                        />
                    </div>

                    {/* Ville */}
                    <div>
                        <label className="block text-[#1A1208] font-semibold mb-2 flex items-center gap-2">
                            <FiMapPin size={16} className="text-[#3D5A3E]" />
                            Ville
                        </label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            disabled={!editMode}
                            className={`w-full px-4 py-2 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl focus:outline-none focus:border-[#3D5A3E] transition-all ${!editMode ? 'opacity-70 cursor-not-allowed' : ''}`}
                        />
                    </div>
                </div>

                {/* Actions */}
                {editMode ? (
                    <div className="flex gap-4 pt-6 border-t border-[#E8E2D9] mt-6">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 bg-[#3D5A3E] hover:bg-[#2D452E] text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {saving ? (
                                <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Enregistrement...</>
                            ) : (
                                <><FiSave size={18} /> Enregistrer</>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setEditMode(false);
                                setFormData({
                                    name: user.name || '',
                                    email: user.email || '',
                                    phone: user.phone || '',
                                    city: user.city || ''
                                });
                                setAvatarPreview(user.avatar || null);
                                setAvatarFile(null);
                            }}
                            className="flex-1 bg-white border-2 border-[#E8E2D9] text-[#6B5E4F] hover:border-[#3D5A3E] hover:text-[#3D5A3E] py-3 rounded-xl font-semibold transition-all"
                        >
                            Annuler
                        </button>
                    </div>
                ) : (
                    <div className="flex gap-4 pt-6 border-t border-[#E8E2D9] mt-6">
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                        >
                            <FiLogOut size={18} />
                            Se déconnecter
                        </button>
                        <Link
                            to="/client/settings"
                            className="flex-1 bg-white border-2 border-[#E8E2D9] text-[#6B5E4F] hover:border-[#3D5A3E] hover:text-[#3D5A3E] py-3 rounded-xl font-semibold transition-all text-center"
                        >
                            <FiShield className="inline mr-2" />
                            Paramètres
                        </Link>
                    </div>
                )}
            </form>
        </div>
    );
};

export default ClientProfile;