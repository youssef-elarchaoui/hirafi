// src/pages/freelancer/FreelancerProfile.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { userApi } from '../../api/userApi';
import { uploadApi } from '../../api/uploadApi';
import toast from 'react-hot-toast';
import { 
  FiUser, FiMail, FiPhone, FiMapPin, FiBriefcase, 
  FiSave, FiEdit2, FiCamera, FiX, FiCheckCircle,
  FiDollarSign, FiStar, FiUsers, FiTrendingUp,
  FiAward, FiGlobe, FiCalendar, FiLink, FiGithub,
  FiTwitter, FiLinkedin, FiInstagram, FiShoppingBag
} from 'react-icons/fi';

const FreelancerProfile = () => {
    const { user, setUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [stats, setStats] = useState({
        totalServices: 0,
        totalOrders: 0,
        completedOrders: 0,
        totalEarnings: 0,
        rating: 0
    });
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        city: '',
        bio: '',
        skills: [],
        hourlyRate: '',
        socialLinks: {
            github: '',
            linkedin: '',
            twitter: '',
            instagram: ''
        }
    });
    const [newSkill, setNewSkill] = useState('');
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [statsLoading, setStatsLoading] = useState(false);

    // Charger les données du profil
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                city: user.city || '',
                bio: user.bio || '',
                skills: user.skills || [],
                hourlyRate: user.hourlyRate || '',
                socialLinks: user.socialLinks || {
                    github: '',
                    linkedin: '',
                    twitter: '',
                    instagram: ''
                }
            });
            setAvatarPreview(user.avatar || null);
            setLoading(false);
        }
    }, [user]);

    // Charger les statistiques
    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        setStatsLoading(true);
        try {
            const response = await userApi.getMyStats();
            console.log('📊 Stats reçues:', response.data);
            if (response.data.success) {
                setStats(response.data.stats);
            }
        } catch (error) {
            console.error('Erreur chargement stats:', error);
            // Ne pas afficher de toast pour ne pas embêter l'utilisateur
        } finally {
            setStatsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSocialChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            socialLinks: { ...prev.socialLinks, [name]: value }
        }));
    };

    const handleAddSkill = () => {
        if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
            setFormData(prev => ({
                ...prev,
                skills: [...prev.skills, newSkill.trim()]
            }));
            setNewSkill('');
            toast.success('Compétence ajoutée');
        } else if (formData.skills.includes(newSkill.trim())) {
            toast.error('Cette compétence existe déjà');
        }
    };

    const handleRemoveSkill = (skillToRemove) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter(skill => skill !== skillToRemove)
        }));
        toast.success('Compétence supprimée');
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
            
            // Upload avatar si nouveau
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
                bio: formData.bio,
                skills: formData.skills,
                hourlyRate: formData.hourlyRate,
                socialLinks: formData.socialLinks,
                avatar: avatarUrl
            };

            console.log('📤 Envoi des données:', updateData);

            const response = await userApi.updateProfile(updateData);
            console.log('✅ Réponse:', response.data);
            
            if (response.data.success) {
                // Mettre à jour l'utilisateur dans le contexte
                const updatedUser = { ...user, ...response.data.user };
                setUser(updatedUser);
                // Mettre à jour le localStorage
                localStorage.setItem('user', JSON.stringify(updatedUser));
                
                toast.success('✓ Profil mis à jour avec succès !', {
                    id: saveToast,
                    duration: 3000,
                    icon: '✅',
                });
                setEditMode(false);
                setAvatarFile(null);
                // Rafraîchir les stats
                fetchStats();
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
                        Gérez vos informations personnelles et professionnelles
                    </p>
                </div>
                {!editMode && (
                    <button
                        onClick={() => setEditMode(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#3D5A3E] hover:bg-[#2D452E] text-white rounded-xl font-semibold transition-all"
                    >
                        <FiEdit2 size={16} />
                        Modifier le profil
                    </button>
                )}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl border border-[#E8E2D9] p-4">
                    <div className="flex items-center gap-2 text-[#6B5E4F] text-sm">
                        <FiStar className="text-yellow-500" />
                        Note
                    </div>
                    <div className="text-2xl font-bold text-[#1A1208]">{stats.rating || user?.rating || 0} / 5</div>
                </div>
                <div className="bg-white rounded-xl border border-[#E8E2D9] p-4">
                    <div className="flex items-center gap-2 text-[#6B5E4F] text-sm">
                        <FiShoppingBag className="text-[#3D5A3E]" />
                        Commandes
                    </div>
                    <div className="text-2xl font-bold text-[#1A1208]">{stats.totalOrders || 0}</div>
                </div>
                <div className="bg-white rounded-xl border border-[#E8E2D9] p-4">
                    <div className="flex items-center gap-2 text-[#6B5E4F] text-sm">
                        <FiDollarSign className="text-[#3D5A3E]" />
                        Revenus
                    </div>
                    <div className="text-2xl font-bold text-[#3D5A3E]">{stats.totalEarnings || 0} DH</div>
                </div>
                <div className="bg-white rounded-xl border border-[#E8E2D9] p-4">
                    <div className="flex items-center gap-2 text-[#6B5E4F] text-sm">
                        <FiBriefcase className="text-[#3D5A3E]" />
                        Services
                    </div>
                    <div className="text-2xl font-bold text-[#1A1208]">{stats.totalServices || 0}</div>
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
                    <p className="text-[#6B5E4F] text-sm mt-2">
                        {user?.isVerified ? (
                            <span className="flex items-center gap-1 text-green-600">
                                <FiCheckCircle size={14} /> Compte vérifié
                            </span>
                        ) : (
                            <span className="text-yellow-600">Compte en attente de vérification</span>
                        )}
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
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={true}
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

                {/* Bio */}
                <div className="mt-6">
                    <label className="block text-[#1A1208] font-semibold mb-2 flex items-center gap-2">
                        <FiBriefcase size={16} className="text-[#3D5A3E]" />
                        Bio
                    </label>
                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        disabled={!editMode}
                        rows="4"
                        placeholder="Décrivez-vous en quelques mots..."
                        className={`w-full px-4 py-2 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl focus:outline-none focus:border-[#3D5A3E] transition-all resize-none ${!editMode ? 'opacity-70 cursor-not-allowed' : ''}`}
                    />
                </div>

                {/* Tarif horaire */}
                <div className="mt-6">
                    <label className="block text-[#1A1208] font-semibold mb-2 flex items-center gap-2">
                        <FiDollarSign size={16} className="text-[#3D5A3E]" />
                        Tarif horaire (DH)
                    </label>
                    <input
                        type="number"
                        name="hourlyRate"
                        value={formData.hourlyRate}
                        onChange={handleChange}
                        disabled={!editMode}
                        className={`w-full px-4 py-2 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl focus:outline-none focus:border-[#3D5A3E] transition-all ${!editMode ? 'opacity-70 cursor-not-allowed' : ''}`}
                    />
                </div>

                {/* Compétences */}
                <div className="mt-6">
                    <label className="block text-[#1A1208] font-semibold mb-2 flex items-center gap-2">
                        <FiAward size={16} className="text-[#3D5A3E]" />
                        Compétences
                    </label>
                    {editMode ? (
                        <div className="flex gap-2 mb-3">
                            <input
                                type="text"
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                                placeholder="Ajouter une compétence..."
                                className="flex-1 px-4 py-2 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl focus:outline-none focus:border-[#3D5A3E] transition-all"
                            />
                            <button
                                type="button"
                                onClick={handleAddSkill}
                                className="px-4 py-2 bg-[#3D5A3E] text-white rounded-xl hover:bg-[#2D452E] transition-all"
                            >
                                Ajouter
                            </button>
                        </div>
                    ) : null}
                    <div className="flex flex-wrap gap-2">
                        {formData.skills.map((skill, idx) => (
                            <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-[#E8EDE6] text-[#3D5A3E] rounded-full text-sm">
                                {skill}
                                {editMode && (
                                    <button type="button" onClick={() => handleRemoveSkill(skill)} className="hover:text-red-500">
                                        <FiX size={14} />
                                    </button>
                                )}
                            </span>
                        ))}
                        {formData.skills.length === 0 && (
                            <span className="text-[#6B5E4F] text-sm">Aucune compétence renseignée</span>
                        )}
                    </div>
                </div>

                {/* Réseaux sociaux */}
                <div className="mt-6">
                    <label className="block text-[#1A1208] font-semibold mb-3 flex items-center gap-2">
                        <FiGlobe size={16} className="text-[#3D5A3E]" />
                        Réseaux sociaux
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                            <FiGithub className="text-[#6B5E4F] flex-shrink-0" />
                            <input
                                type="text"
                                name="github"
                                placeholder="GitHub"
                                value={formData.socialLinks.github}
                                onChange={handleSocialChange}
                                disabled={!editMode}
                                className={`flex-1 px-3 py-2 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl focus:outline-none focus:border-[#3D5A3E] transition-all text-sm ${!editMode ? 'opacity-70 cursor-not-allowed' : ''}`}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <FiLinkedin className="text-[#6B5E4F] flex-shrink-0" />
                            <input
                                type="text"
                                name="linkedin"
                                placeholder="LinkedIn"
                                value={formData.socialLinks.linkedin}
                                onChange={handleSocialChange}
                                disabled={!editMode}
                                className={`flex-1 px-3 py-2 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl focus:outline-none focus:border-[#3D5A3E] transition-all text-sm ${!editMode ? 'opacity-70 cursor-not-allowed' : ''}`}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <FiTwitter className="text-[#6B5E4F] flex-shrink-0" />
                            <input
                                type="text"
                                name="twitter"
                                placeholder="Twitter / X"
                                value={formData.socialLinks.twitter}
                                onChange={handleSocialChange}
                                disabled={!editMode}
                                className={`flex-1 px-3 py-2 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl focus:outline-none focus:border-[#3D5A3E] transition-all text-sm ${!editMode ? 'opacity-70 cursor-not-allowed' : ''}`}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <FiInstagram className="text-[#6B5E4F] flex-shrink-0" />
                            <input
                                type="text"
                                name="instagram"
                                placeholder="Instagram"
                                value={formData.socialLinks.instagram}
                                onChange={handleSocialChange}
                                disabled={!editMode}
                                className={`flex-1 px-3 py-2 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl focus:outline-none focus:border-[#3D5A3E] transition-all text-sm ${!editMode ? 'opacity-70 cursor-not-allowed' : ''}`}
                            />
                        </div>
                    </div>
                </div>

                {/* Actions */}
                {editMode && (
                    <div className="flex gap-4 pt-6 border-t border-[#E8E2D9] mt-6">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 bg-[#3D5A3E] hover:bg-[#2D452E] text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {saving ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Enregistrement...
                                </>
                            ) : (
                                <>
                                    <FiSave size={18} />
                                    Enregistrer
                                </>
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
                                    city: user.city || '',
                                    bio: user.bio || '',
                                    skills: user.skills || [],
                                    hourlyRate: user.hourlyRate || '',
                                    socialLinks: user.socialLinks || {
                                        github: '',
                                        linkedin: '',
                                        twitter: '',
                                        instagram: ''
                                    }
                                });
                                setAvatarPreview(user.avatar || null);
                                setAvatarFile(null);
                            }}
                            className="flex-1 bg-white border-2 border-[#E8E2D9] text-[#6B5E4F] hover:border-[#3D5A3E] hover:text-[#3D5A3E] py-3 rounded-xl font-semibold transition-all text-center"
                        >
                            Annuler
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default FreelancerProfile;