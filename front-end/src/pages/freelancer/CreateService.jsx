// src/pages/freelancer/CreateService.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { serviceApi } from '../../api/serviceApi';
import { uploadApi } from '../../api/uploadApi';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import { 
  FiArrowLeft, FiSave, FiImage, FiTag, FiClock, 
  FiDollarSign, FiAlertCircle, FiPlus, FiX, FiUpload,
  FiTrash2, FiEye
} from 'react-icons/fi';

const CreateService = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [uploadingImages, setUploadingImages] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        subcategory: '',
        price: '',
        deliveryDays: '',
        tags: [],
        images: [],
        requirements: ''
    });
    const [tagInput, setTagInput] = useState('');
    const [previewImages, setPreviewImages] = useState([]);

    const categories = [
        { value: 'graphic-design', label: 'Design Graphique', icon: '🎨' },
        { value: 'web-development', label: 'Développement Web', icon: '💻' },
        { value: 'marketing', label: 'Marketing Digital', icon: '📈' },
        { value: 'writing', label: 'Rédaction', icon: '✍️' },
        { value: 'video', label: 'Vidéo & Animation', icon: '🎥' },
        { value: 'consulting', label: 'Consulting', icon: '💡' }
    ];

    const subcategories = {
        'graphic-design': ['Logo Design', 'Branding', 'Illustration', 'Packaging', 'Infographie'],
        'web-development': ['Frontend', 'Backend', 'Full Stack', 'E-commerce', 'Mobile', 'WordPress'],
        'marketing': ['SEO', 'Social Media', 'Ads', 'Email Marketing', 'Content Strategy'],
        'writing': ['Rédaction web', 'Traduction', 'Copywriting', 'Proofreading', 'Blog posts'],
        'video': ['Montage', 'Motion Design', 'Animation 3D', 'Effets spéciaux', 'Color grading'],
        'consulting': ['Stratégie', 'Coaching', 'Conseil', 'Audit', 'Formation']
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCategoryChange = (e) => {
        const category = e.target.value;
        setFormData(prev => ({ 
            ...prev, 
            category,
            subcategory: ''
        }));
    };

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;
        
        // Vérifier la taille (max 5MB par image)
        const validFiles = files.filter(file => file.size <= 5 * 1024 * 1024);
        if (validFiles.length !== files.length) {
            toast.error('Certaines images dépassent 5MB');
        }
        
        // Créer les previews
        const newPreviews = validFiles.map(file => URL.createObjectURL(file));
        setPreviewImages(prev => [...prev, ...newPreviews]);
        
        setUploadingImages(true);
        const uploadToast = toast.loading('Upload des images en cours...');
        
        try {
            // Upload une par une
            const uploadedUrls = [];
            for (const file of validFiles) {
                const response = await uploadApi.uploadImage(file);
                if (response.data.success) {
                    uploadedUrls.push(response.data.url);
                }
            }
            
            setFormData(prev => ({
                ...prev,
                images: [...prev.images, ...uploadedUrls]
            }));
            
            toast.success(`${uploadedUrls.length} image(s) uploadée(s) avec succès`, {
                id: uploadToast,
                duration: 3000,
            });
        } catch (error) {
            toast.error('Erreur lors de l\'upload des images', {
                id: uploadToast,
                duration: 4000,
            });
        } finally {
            setUploadingImages(false);
        }
    };

    const removeImage = (indexToRemove) => {
        // Supprimer le preview
        setPreviewImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
        // Supprimer l'URL du formulaire
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, idx) => idx !== indexToRemove)
        }));
        toast.success('Image supprimée', { duration: 1500 });
    };

    const addTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, tagInput.trim()]
            }));
            setTagInput('');
            toast.success('Tag ajouté', { duration: 1500 });
        }
    };

    const removeTag = (tagToRemove) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
        toast.success('Tag supprimé', { duration: 1500 });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!formData.title.trim()) {
            toast.error('Veuillez entrer un titre');
            return;
        }
        if (!formData.description.trim()) {
            toast.error('Veuillez entrer une description');
            return;
        }
        if (!formData.category) {
            toast.error('Veuillez sélectionner une catégorie');
            return;
        }
        if (!formData.price || formData.price <= 0) {
            toast.error('Veuillez entrer un prix valide');
            return;
        }
        if (!formData.deliveryDays || formData.deliveryDays <= 0) {
            toast.error('Veuillez entrer un délai de livraison valide');
            return;
        }

        setLoading(true);
        const createToast = toast.loading('Création du service en cours...');
        
        try {
            const response = await serviceApi.createService(formData);
            if (response.data.success) {
                toast.success('✓ Service créé avec succès !', {
                    id: createToast,
                    duration: 3000,
                    icon: '🎉',
                });
                setTimeout(() => {
                    navigate('/freelancer/services');
                }, 1500);
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Erreur lors de la création';
            toast.error(errorMsg, {
                id: createToast,
                duration: 4000,
                icon: '❌',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Link 
                    to="/freelancer/services"
                    className="p-2 rounded-lg hover:bg-[#E8EDE6] transition-colors"
                >
                    <FiArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-heading font-bold text-[#1A1208]">
                        Créer un nouveau service
                    </h1>
                    <p className="text-[#6B5E4F] text-sm mt-1">
                        Partagez votre talent avec la communauté
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Titre */}
                <div className="bg-white rounded-2xl border border-[#E8E2D9] p-6">
                    <label className="block text-[#1A1208] font-semibold mb-2">
                        Titre du service *
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Ex: Création de site web professionnel"
                        className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl focus:outline-none focus:border-[#3D5A3E] transition-all"
                        required
                    />
                </div>

                {/* Description */}
                <div className="bg-white rounded-2xl border border-[#E8E2D9] p-6">
                    <label className="block text-[#1A1208] font-semibold mb-2">
                        Description *
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="6"
                        placeholder="Décrivez votre service en détail..."
                        className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl focus:outline-none focus:border-[#3D5A3E] transition-all resize-none"
                        required
                    />
                </div>

                {/* Catégorie et sous-catégorie */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl border border-[#E8E2D9] p-6">
                        <label className="block text-[#1A1208] font-semibold mb-2">
                            Catégorie *
                        </label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleCategoryChange}
                            className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl focus:outline-none focus:border-[#3D5A3E] transition-all"
                            required
                        >
                            <option value="">Sélectionner une catégorie</option>
                            {categories.map(cat => (
                                <option key={cat.value} value={cat.value}>
                                    {cat.icon} {cat.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="bg-white rounded-2xl border border-[#E8E2D9] p-6">
                        <label className="block text-[#1A1208] font-semibold mb-2">
                            Sous-catégorie
                        </label>
                        <select
                            name="subcategory"
                            value={formData.subcategory}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl focus:outline-none focus:border-[#3D5A3E] transition-all"
                            disabled={!formData.category}
                        >
                            <option value="">Sélectionner une sous-catégorie</option>
                            {formData.category && subcategories[formData.category]?.map(sub => (
                                <option key={sub} value={sub.toLowerCase()}>{sub}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Prix et délai */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl border border-[#E8E2D9] p-6">
                        <label className="block text-[#1A1208] font-semibold mb-2 flex items-center gap-2">
                            <FiDollarSign size={16} />
                            Prix (DH) *
                        </label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="0"
                            className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl focus:outline-none focus:border-[#3D5A3E] transition-all"
                            required
                        />
                    </div>

                    <div className="bg-white rounded-2xl border border-[#E8E2D9] p-6">
                        <label className="block text-[#1A1208] font-semibold mb-2 flex items-center gap-2">
                            <FiClock size={16} />
                            Délai de livraison (jours) *
                        </label>
                        <input
                            type="number"
                            name="deliveryDays"
                            value={formData.deliveryDays}
                            onChange={handleChange}
                            placeholder="7"
                            className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl focus:outline-none focus:border-[#3D5A3E] transition-all"
                            required
                        />
                    </div>
                </div>

                {/* Upload d'images */}
                <div className="bg-white rounded-2xl border border-[#E8E2D9] p-6">
                    <label className="block text-[#1A1208] font-semibold mb-2 flex items-center gap-2">
                        <FiImage size={16} />
                        Images du service
                    </label>
                    
                    {/* Zone d'upload */}
                    <div className="mb-4">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#E8E2D9] rounded-xl cursor-pointer hover:border-[#3D5A3E] transition-all bg-[#FAF8F5]">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <FiUpload className="text-[#9B9082] mb-2" size={24} />
                                <p className="text-sm text-[#6B5E4F]">
                                    <span className="font-semibold">Cliquez pour uploader</span> ou glissez-déposez
                                </p>
                                <p className="text-xs text-[#9B9082] mt-1">
                                    PNG, JPG, JPEG (Max 5MB)
                                </p>
                            </div>
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                multiple
                                onChange={handleImageUpload}
                                disabled={uploadingImages}
                            />
                        </label>
                    </div>
                    
                    {/* Preview des images */}
                    {previewImages.length > 0 && (
                        <div>
                            <p className="text-sm font-medium text-[#1A1208] mb-2">
                                Aperçu ({previewImages.length} image(s))
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {previewImages.map((img, idx) => (
                                    <div key={idx} className="relative group">
                                        <img 
                                            src={img} 
                                            alt={`Aperçu ${idx + 1}`} 
                                            className="w-full h-32 object-cover rounded-lg border border-[#E8E2D9]"
                                        />
                                        <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <a href={img} target="_blank" rel="noopener noreferrer" className="p-1 bg-white rounded-full text-[#3D5A3E] hover:bg-[#E8EDE6]">
                                                <FiEye size={16} />
                                            </a>
                                            <button
                                                type="button"
                                                onClick={() => removeImage(idx)}
                                                className="p-1 bg-white rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-all"
                                            >
                                                <FiTrash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {uploadingImages && (
                        <div className="mt-3 flex items-center justify-center gap-2 text-sm text-[#3D5A3E]">
                            <div className="w-4 h-4 border-2 border-[#3D5A3E] border-t-transparent rounded-full animate-spin"></div>
                            Upload en cours...
                        </div>
                    )}
                </div>

                {/* Tags */}
                <div className="bg-white rounded-2xl border border-[#E8E2D9} p-6">
                    <label className="block text-[#1A1208] font-semibold mb-2 flex items-center gap-2">
                        <FiTag size={16} />
                        Tags (compétences)
                    </label>
                    <div className="flex gap-2 mb-3">
                        <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                            placeholder="Ex: React, UI/UX, Figma"
                            className="flex-1 px-4 py-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl focus:outline-none focus:border-[#3D5A3E] transition-all"
                        />
                        <button
                            type="button"
                            onClick={addTag}
                            className="px-4 py-3 bg-[#E8EDE6] text-[#3D5A3E] rounded-xl hover:bg-[#3D5A3E] hover:text-white transition-all"
                        >
                            <FiPlus size={20} />
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag, idx) => (
                            <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-[#E8EDE6] text-[#3D5A3E] rounded-full text-sm">
                                {tag}
                                <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500">
                                    <FiX size={14} />
                                </button>
                            </span>
                        ))}
                    </div>
                </div>

                {/* Prérequis */}
                <div className="bg-white rounded-2xl border border-[#E8E2D9] p-6">
                    <label className="block text-[#1A1208] font-semibold mb-2 flex items-center gap-2">
                        <FiAlertCircle size={16} />
                        Prérequis (optionnel)
                    </label>
                    <textarea
                        name="requirements"
                        value={formData.requirements}
                        onChange={handleChange}
                        rows="3"
                        placeholder="Ce que le client doit fournir avant de commencer..."
                        className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl focus:outline-none focus:border-[#3D5A3E] transition-all resize-none"
                    />
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-4">
                    <button
                        type="submit"
                        disabled={loading || uploadingImages}
                        className="flex-1 bg-[#3D5A3E] hover:bg-[#2D452E] text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Création en cours...
                            </>
                        ) : (
                            <>
                                <FiSave size={18} />
                                Créer le service
                            </>
                        )}
                    </button>
                    <Link
                        to="/freelancer/services"
                        className="flex-1 bg-white border-2 border-[#E8E2D9] text-[#6B5E4F] hover:border-[#3D5A3E] hover:text-[#3D5A3E] py-3 rounded-xl font-semibold transition-all text-center"
                    >
                        Annuler
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default CreateService;