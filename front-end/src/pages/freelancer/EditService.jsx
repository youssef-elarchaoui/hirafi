// src/pages/freelancer/EditService.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { serviceApi } from "../../api/serviceApi";
import { uploadApi } from "../../api/uploadApi";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";
import {
  FiArrowLeft,
  FiSave,
  FiImage,
  FiTag,
  FiClock,
  FiDollarSign,
  FiAlertCircle,
  FiPlus,
  FiX,
  FiTrash2,
  FiUpload,
  FiEye,
} from "react-icons/fi";

const EditService = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [imageFiles, setImageFiles] = useState([]); // Pour les nouveaux fichiers
  const [existingImages, setExistingImages] = useState([]); // Pour les images existantes
  const [removedImages, setRemovedImages] = useState([]); // Pour les images supprimées
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    subcategory: "",
    price: "",
    deliveryDays: "",
    tags: [],
    images: [],
    requirements: "",
    status: "active",
  });

  const categories = [
    { value: "graphic-design", label: "Design Graphique", icon: "🎨" },
    { value: "web-development", label: "Développement Web", icon: "💻" },
    { value: "marketing", label: "Marketing Digital", icon: "📈" },
    { value: "writing", label: "Rédaction", icon: "✍️" },
    { value: "video", label: "Vidéo & Animation", icon: "🎥" },
    { value: "consulting", label: "Consulting", icon: "💡" },
  ];

  const subcategories = {
    "graphic-design": [
      "Logo Design",
      "Branding",
      "Illustration",
      "Packaging",
      "Infographie",
    ],
    "web-development": [
      "Frontend",
      "Backend",
      "Full Stack",
      "E-commerce",
      "Mobile",
      "WordPress",
    ],
    marketing: [
      "SEO",
      "Social Media",
      "Ads",
      "Email Marketing",
      "Content Strategy",
    ],
    writing: [
      "Rédaction web",
      "Traduction",
      "Copywriting",
      "Proofreading",
      "Blog posts",
    ],
    video: [
      "Montage",
      "Motion Design",
      "Animation 3D",
      "Effets spéciaux",
      "Color grading",
    ],
    consulting: ["Stratégie", "Coaching", "Conseil", "Audit", "Formation"],
  };

  useEffect(() => {
    fetchService();
  }, [id]);

  const fetchService = async () => {
    setLoading(true);
    try {
      const response = await serviceApi.getServiceById(id);
      const service = response.data.service;

      if (service.freelancerId._id !== user?._id && user?.role !== "admin") {
        toast.error("Vous n'êtes pas autorisé à modifier ce service");
        navigate("/freelancer/services");
        return;
      }

      setFormData({
        title: service.title || "",
        description: service.description || "",
        category: service.category || "",
        subcategory: service.subcategory || "",
        price: service.price || "",
        deliveryDays: service.deliveryDays || "",
        tags: service.tags || [],
        images: service.images || [],
        requirements: service.requirements || "",
        status: service.status || "active",
      });

      // Initialiser les images existantes
      setExistingImages(service.images || []);

      toast.success("Service chargé avec succès", { duration: 2000 });
    } catch (error) {
      toast.error("Erreur lors du chargement du service");
      navigate("/freelancer/services");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setFormData((prev) => ({
      ...prev,
      category,
      subcategory: "",
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Filtrer les fichiers valides (max 5MB)
    const validFiles = files.filter((file) => file.size <= 5 * 1024 * 1024);
    if (validFiles.length !== files.length) {
      toast.error("Certaines images dépassent 5MB");
    }

    // Ajouter aux fichiers à uploader
    setImageFiles((prev) => [...prev, ...validFiles]);

    // Créer les previews pour les nouveaux fichiers
    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
    setExistingImages((prev) => [...prev, ...newPreviews]);

    toast.success(`${validFiles.length} image(s) sélectionnée(s)`);
  };
  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
      toast.success("Tag ajouté", { duration: 1500 });
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
    toast.success("Tag supprimé", { duration: 1500 });
  };

  const removeExistingImage = (indexToRemove) => {
    const imageToRemove = existingImages[indexToRemove];

    // Vérifier si c'est une image existante (URL) ou nouvelle (blob)
    if (
      imageToRemove.startsWith("blob:") ||
      imageToRemove.startsWith("http://localhost")
    ) {
      // C'est une nouvelle image non uploadée
      setImageFiles((prev) =>
        prev.filter((_, idx) => {
          const blobUrl = URL.createObjectURL(prev[idx]);
          return blobUrl !== imageToRemove;
        }),
      );
    } else {
      // C'est une image existante, on la marque pour suppression
      setRemovedImages((prev) => [...prev, imageToRemove]);
    }

    // Supprimer du tableau d'affichage
    setExistingImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    toast.success("Image supprimée");
  };

  const uploadNewImages = async () => {
    if (imageFiles.length === 0) return [];

    const uploadedUrls = [];
    for (const file of imageFiles) {
      try {
        const response = await uploadApi.uploadImage(file);
        if (response.data.success) {
          uploadedUrls.push(response.data.url);
        }
      } catch (error) {
        console.error("Erreur upload:", error);
      }
    }
    return uploadedUrls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      toast.error("Veuillez entrer un titre");
      return;
    }
    if (!formData.description.trim()) {
      toast.error("Veuillez entrer une description");
      return;
    }
    if (!formData.category) {
      toast.error("Veuillez sélectionner une catégorie");
      return;
    }
    if (!formData.price || formData.price <= 0) {
      toast.error("Veuillez entrer un prix valide");
      return;
    }
    if (!formData.deliveryDays || formData.deliveryDays <= 0) {
      toast.error("Veuillez entrer un délai de livraison valide");
      return;
    }

    setSaving(true);
    const saveToast = toast.loading("Enregistrement en cours...");

    try {
      // Upload des nouvelles images
      const newImageUrls = await uploadNewImages();

      // Conserver les images existantes non supprimées
      const keptImages = existingImages.filter(
        (img) => !img.startsWith("blob:") && !removedImages.includes(img),
      );

      // Toutes les images finales
      const allImages = [...keptImages, ...newImageUrls];

      const updatedData = {
        ...formData,
        images: allImages,
      };

      const response = await serviceApi.updateService(id, updatedData);
      if (response.data.success) {
        toast.success("✓ Service mis à jour avec succès !", {
          id: saveToast,
          duration: 3000,
          icon: "✏️",
        });
        setTimeout(() => {
          navigate("/freelancer/services");
        }, 1500);
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Erreur lors de la mise à jour";
      toast.error(errorMsg, {
        id: saveToast,
        duration: 4000,
        icon: "❌",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "⚠️ Êtes-vous sûr de vouloir supprimer ce service ? Cette action est irréversible.",
    );

    if (confirmDelete) {
      const deleteToast = toast.loading("Suppression en cours...");
      try {
        await serviceApi.deleteService(id);
        toast.success("✓ Service supprimé avec succès !", {
          id: deleteToast,
          duration: 3000,
          icon: "🗑️",
        });
        setTimeout(() => {
          navigate("/freelancer/services");
        }, 1500);
      } catch (err) {
        toast.error("Erreur lors de la suppression", {
          id: deleteToast,
          duration: 4000,
          icon: "❌",
        });
      }
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
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link
            to="/freelancer/services"
            className="p-2 rounded-lg hover:bg-[#E8EDE6] transition-colors"
          >
            <FiArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-heading font-bold text-[#1A1208]">
              Modifier le service
            </h1>
            <p className="text-[#6B5E4F] text-sm mt-1">
              Mettez à jour les informations de votre service
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleDelete}
          className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
        >
          <FiTrash2 size={16} />
          Supprimer
        </button>
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
              {categories.map((cat) => (
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
              {formData.category &&
                subcategories[formData.category]?.map((sub) => (
                  <option key={sub} value={sub.toLowerCase()}>
                    {sub}
                  </option>
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
              className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl focus:outline-none focus:border-[#3D5A3E] transition-all"
              required
            />
          </div>
        </div>

        {/* Statut */}
        <div className="bg-white rounded-2xl border border-[#E8E2D9] p-6">
          <label className="block text-[#1A1208] font-semibold mb-2">
            Statut
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl focus:outline-none focus:border-[#3D5A3E] transition-all"
          >
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
          </select>
        </div>

        {/* Images */}
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
                  <span className="font-semibold">Cliquez pour uploader</span>{" "}
                  ou glissez-déposez
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
          {existingImages.length > 0 && (
            <div>
              <p className="text-sm font-medium text-[#1A1208] mb-2">
                Images ({existingImages.length})
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {existingImages.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={img}
                      alt={`Image ${idx + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-[#E8E2D9]"
                      onError={(e) => {
                        e.target.src =
                          "https://placehold.co/400x300/E8EDE6/3D5A3E?text=Image+non+chargée";
                      }}
                    />
                    <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <a
                        href={img}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 bg-white rounded-full text-[#3D5A3E] hover:bg-[#E8EDE6]"
                      >
                        <FiEye size={16} />
                      </a>
                      <button
                        type="button"
                        onClick={() => removeExistingImage(idx)}
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
        <div className="bg-white rounded-2xl border border-[#E8E2D9] p-6">
          <label className="block text-[#1A1208] font-semibold mb-2 flex items-center gap-2">
            <FiTag size={16} />
            Tags (compétences)
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), addTag())
              }
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
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-3 py-1 bg-[#E8EDE6] text-[#3D5A3E] rounded-full text-sm"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:text-red-500"
                >
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
            disabled={saving || uploadingImages}
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
                Enregistrer les modifications
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

export default EditService;
