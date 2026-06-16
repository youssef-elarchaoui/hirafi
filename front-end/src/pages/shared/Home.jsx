// src/pages/shared/Home.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { serviceApi } from "../../api/serviceApi";
import { reviewApi } from "../../api/reviewApi";
import {
  FiArrowRight,
  FiStar,
  FiUsers,
  FiBriefcase,
  FiClock,
  FiAward,
  FiShield,
  FiMessageCircle,
  FiTrendingUp,
  FiZap,
  FiGlobe,
  FiHeart,
  FiChevronRight,
  FiCheckCircle,
  FiMapPin,
  FiCalendar,
  FiEye,
  FiShoppingBag,
  FiPercent,
  FiGift,
  FiHeadphones,
  FiBookOpen,
  FiThumbsUp,
  FiTarget,
  FiEye as FiEyeIcon,
  FiSmile,
} from "react-icons/fi";

function Home() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalServices: 0,
    totalFreelancers: 0,
    totalOrders: 0,
    avgRating: 0,
  });
  const [featuredServices, setFeaturedServices] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [trendingFreelancers, setTrendingFreelancers] = useState([]);
  const [newServices, setNewServices] = useState([]);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Configuration des catégories
  const categoryConfig = {
    "graphic-design": {
      name: "Design Graphique",
      icon: "🎨",
      color: "from-purple-500 to-pink-500",
      bg: "bg-purple-50",
      text: "text-purple-600",
      description: "Logo, branding, illustration",
    },
    "web-development": {
      name: "Développement Web",
      icon: "💻",
      color: "from-blue-500 to-cyan-500",
      bg: "bg-blue-50",
      text: "text-blue-600",
      description: "Sites, applications, e-commerce",
    },
    marketing: {
      name: "Marketing Digital",
      icon: "📈",
      color: "from-orange-500 to-red-500",
      bg: "bg-orange-50",
      text: "text-orange-600",
      description: "SEO, réseaux sociaux, ads",
    },
    writing: {
      name: "Rédaction",
      icon: "✍️",
      color: "from-green-500 to-emerald-500",
      bg: "bg-green-50",
      text: "text-green-600",
      description: "Contenu, traduction, copywriting",
    },
    video: {
      name: "Vidéo & Animation",
      icon: "🎥",
      color: "from-red-500 to-rose-500",
      bg: "bg-red-50",
      text: "text-red-600",
      description: "Montage, motion design, 3D",
    },
    consulting: {
      name: "Consulting",
      icon: "💡",
      color: "from-indigo-500 to-purple-500",
      bg: "bg-indigo-50",
      text: "text-indigo-600",
      description: "Stratégie, coaching, conseil",
    },
  };

  // Avantages
  const benefits = [
    {
      icon: FiShield,
      title: "Garantie satisfait ou remboursé",
      desc: "Votre argent est sécurisé jusqu'à validation",
    },
    {
      icon: FiClock,
      title: "Support 24/7",
      desc: "Une équipe disponible pour vous assister",
    },
    {
      icon: FiPercent,
      title: "0% de commission",
      desc: "Nous ne prenons aucune commission sur vos projets",
    },
    {
      icon: FiGift,
      title: "Programme de parrainage",
      desc: "Gagnez des récompenses en invitant vos amis",
    },
  ];

  // Valeurs de l'entreprise
  const companyValues = [
    {
      icon: FiTarget,
      title: "Notre Mission",
      desc: "Connecter les talents marocains avec des clients exigeants à travers le monde.",
    },
    {
      icon: FiEyeIcon,
      title: "Notre Vision",
      desc: "Devenir la plateforme de référence pour l'artisanat et le freelancing au Maroc.",
    },
    {
      icon: FiHeart,
      title: "Nos Valeurs",
      desc: "Authenticité, qualité, transparence et respect du savoir-faire marocain.",
    },
  ];

  // FAQs
  const faqs = [
    {
      q: "Comment trouver un artisan ?",
      a: "Utilisez notre moteur de recherche et filtrez par catégorie, budget ou localisation.",
    },
    {
      q: "Comment payer en toute sécurité ?",
      a: "Les fonds sont bloqués sécuritairement et ne sont libérés qu'après votre validation.",
    },
    {
      q: "Que faire en cas de litige ?",
      a: "Notre équipe intervient rapidement pour trouver une solution amiable équitable.",
    },
    {
      q: "Comment devenir artisan ?",
      a: "Inscrivez-vous gratuitement, créez votre profil et proposez vos services.",
    },
  ];

  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true);
      try {
        const servicesRes = await serviceApi.getAllServices({ limit: 1000 });
        let services = [];
        if (servicesRes.data && servicesRes.data.services) {
          services = servicesRes.data.services;
        }

        // Statistiques
        const totalServices = services.length;
        const freelancerIds = new Set();
        let totalOrders = 0;
        let totalRating = 0;
        let ratingCount = 0;

        services.forEach((service) => {
          if (service.freelancerId && service.freelancerId._id) {
            freelancerIds.add(service.freelancerId._id);
          }
          totalOrders += service.orders || 0;
          if (service.rating && service.ratingCount) {
            totalRating += service.rating * service.ratingCount;
            ratingCount += service.ratingCount;
          }
        });

        setStats({
          totalServices: totalServices,
          totalFreelancers: freelancerIds.size,
          totalOrders: totalOrders,
          avgRating:
            ratingCount > 0 ? (totalRating / ratingCount).toFixed(1) : 4.8,
        });

        // Services en vedette
        const featured = [...services]
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, 3);
        setFeaturedServices(featured);

        // Nouveaux services
        const newest = [...services]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 4);
        setNewServices(newest);

        // Catégories
        const categoriesWithStats = Object.keys(categoryConfig).map(
          (catId) => ({
            id: catId,
            ...categoryConfig[catId],
            count: services.filter((s) => s.category === catId).length,
          }),
        );
        setCategories(categoriesWithStats);

        // Artisans populaires
        const freelancerMap = new Map();
        services.forEach((service) => {
          if (service.freelancerId && service.freelancerId._id) {
            const id = service.freelancerId._id;
            if (!freelancerMap.has(id)) {
              freelancerMap.set(id, {
                id: id,
                name: service.freelancerId.name || "Artisan",
                totalServices: 0,
                totalOrders: 0,
                rating: service.freelancerId.rating || 5,
              });
            }
            const f = freelancerMap.get(id);
            f.totalServices++;
            f.totalOrders += service.orders || 0;
          }
        });
        setTrendingFreelancers(Array.from(freelancerMap.values()).slice(0, 4));

        // Avis
        try {
          const reviewsRes = await reviewApi.getMyReviews();
          if (reviewsRes.data && reviewsRes.data.reviews) {
            const allReviews = reviewsRes.data.reviews;
            const validReviews = allReviews.filter(
              (r) => r.comment && r.comment.length > 10,
            );
            setRecentReviews(validReviews.slice(0, 5));
          } else {
            setRecentReviews([
              {
                _id: "1",
                rating: 5,
                comment:
                  "Excellent travail ! L'artisan a parfaitement compris mes besoins.",
                clientId: { name: "Ahmed Tazi" },
                createdAt: new Date().toISOString(),
              },
              {
                _id: "2",
                rating: 5,
                comment:
                  "Très professionnel et ponctuel. Je recommande vivement cette plateforme.",
                clientId: { name: "Fatima Zahra" },
                createdAt: new Date().toISOString(),
              },
              {
                _id: "3",
                rating: 4,
                comment:
                  "Bon service, communication fluide, livré dans les délais.",
                clientId: { name: "Karim Benjelloun" },
                createdAt: new Date().toISOString(),
              },
            ]);
          }
        } catch (err) {
          console.error("Erreur avis:", err);
        }
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  // Auto-slide témoignages
  useEffect(() => {
    if (recentReviews.length === 0) return;
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % recentReviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [recentReviews.length]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-3 border-[#E8EDE6] rounded-full"></div>
          <div className="absolute inset-0 border-3 border-[#3D5A3E] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  const currentReview = recentReviews[currentTestimonial];

  return (
    <div className="bg-gradient-to-br from-[#FAF8F5] via-white to-[#FAF8F5] min-h-screen">
      {/* ========== SECTION HERO ========== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#3D5A3E]/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#C47D4E]/5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-[#E8EDE6] px-4 py-2 rounded-full mb-6">
                <span className="w-2 h-2 bg-[#3D5A3E] rounded-full animate-pulse"></span>
                <span className="text-sm text-[#3D5A3E] font-medium">
                  ✨ Plateforme N°1 au Maroc
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-[#1A1208] mb-6 leading-tight">
                Trouvez l'artisan idéal pour
                <span className="text-[#3D5A3E] block">
                  vos projets créatifs
                </span>
              </h1>

              <p className="text-lg text-[#5C5244] mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Connectez-vous avec les meilleurs freelancers marocains.
                Qualité, sécurité et simplicité au rendez-vous.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/services"
                  className="group bg-[#3D5A3E] hover:bg-[#2D452E] text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 hover:gap-3 shadow-lg hover:shadow-xl"
                >
                  Explorer les services
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/register?role=freelancer"
                  className="border-2 border-[#3D5A3E] text-[#3D5A3E] hover:bg-[#E8EDE6] px-8 py-4 rounded-xl font-semibold transition-all duration-300 text-center"
                >
                  Devenir artisan
                </Link>
              </div>

              <div className="flex justify-center lg:justify-start gap-8 mt-10 pt-6 border-t border-[#E8EDE6]">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#3D5A3E]">
                    {stats.totalServices}
                  </div>
                  <div className="text-xs text-[#5C5244]">Services</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#3D5A3E]">
                    {stats.totalFreelancers}
                  </div>
                  <div className="text-xs text-[#5C5244]">Artisans</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#3D5A3E]">
                    {stats.avgRating}★
                  </div>
                  <div className="text-xs text-[#5C5244]">Note moyenne</div>
                </div>
              </div>
            </div>

            <div className="flex-1 relative">
              <div className="grid grid-cols-2 gap-4">
                {featuredServices.slice(0, 4).map((service, idx) => (
                  <div
                    key={service._id}
                    className="bg-white rounded-2xl p-4 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                  >
                    <div className="text-4xl mb-2">
                      {categoryConfig[service.category]?.icon || "✨"}
                    </div>
                    <h3 className="font-semibold text-sm line-clamp-1">
                      {service.title}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-yellow-500 mt-1">
                      <FiStar className="fill-current" size={12} />
                      <span>{service.rating || "Nouveau"}</span>
                    </div>
                    <div className="text-[#3D5A3E] font-bold text-sm mt-2">
                      {service.price} DH
                    </div>
                  </div>
                ))}
              </div>
              <div className="absolute -z-10 inset-0 bg-gradient-to-r from-[#3D5A3E]/10 to-[#C47D4E]/10 rounded-3xl blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== À PROPOS DE HIRAFI SECTION ========== */}
      <section className="py-20 bg-[#E8EDE6]/30">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#3D5A3E]/10 rounded-full text-xs text-[#3D5A3E] font-semibold mb-3">
              <FiHeart size={12} /> À propos
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#1A1208] mb-4">
              Qui sommes-nous ?
            </h2>
            <p className="text-[#5C5244] max-w-2xl mx-auto">
              Hirafi est bien plus qu'une simple plateforme de freelancing
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {companyValues.map((value, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-8 text-center hover:shadow-xl transition-all group"
              >
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#E8EDE6] flex items-center justify-center group-hover:bg-[#3D5A3E] group-hover:text-white transition-all">
                  <value.icon
                    className="text-[#3D5A3E] group-hover:text-white"
                    size={32}
                  />
                </div>
                <h3 className="text-xl font-heading font-bold text-[#1A1208] mb-3">
                  {value.title}
                </h3>
                <p className="text-[#5C5244] leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-[#3D5A3E] to-[#2D452E] rounded-3xl p-8 md:p-12 text-center text-white">
            <p className="text-xl md:text-2xl font-heading font-semibold mb-6 max-w-3xl mx-auto">
              "Nous croyons au talent marocain et nous nous engageons à le faire
              rayonner à travers le monde"
            </p>
            <div className="flex justify-center gap-2 text-[#C47D4E]">
              <FiStar className="fill-current" />
              <FiStar className="fill-current" />
              <FiStar className="fill-current" />
              <FiStar className="fill-current" />
              <FiStar className="fill-current" />
            </div>
          </div>
        </div>
      </section>

      {/* ========== STATS SECTION ========== */}
      <section className="py-16 bg-gradient-to-r from-[#3D5A3E] to-[#2D452E]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="group hover:transform hover:scale-105 transition-all">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-white/10 flex items-center justify-center">
                <FiUsers className="text-[#C47D4E]" size={28} />
              </div>
              <div className="text-4xl font-heading font-bold text-white mb-1">
                {stats.totalFreelancers}
              </div>
              <div className="text-white/70 text-sm">Artisans qualifiés</div>
            </div>
            <div className="group hover:transform hover:scale-105 transition-all">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-white/10 flex items-center justify-center">
                <FiBriefcase className="text-[#C47D4E]" size={28} />
              </div>
              <div className="text-4xl font-heading font-bold text-white mb-1">
                {stats.totalServices}
              </div>
              <div className="text-white/70 text-sm">Services proposés</div>
            </div>
            <div className="group hover:transform hover:scale-105 transition-all">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-white/10 flex items-center justify-center">
                <FiShoppingBag className="text-[#C47D4E]" size={28} />
              </div>
              <div className="text-4xl font-heading font-bold text-white mb-1">
                {stats.totalOrders}
              </div>
              <div className="text-white/70 text-sm">Commandes réalisées</div>
            </div>
            <div className="group hover:transform hover:scale-105 transition-all">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-white/10 flex items-center justify-center">
                <FiAward className="text-[#C47D4E]" size={28} />
              </div>
              <div className="text-4xl font-heading font-bold text-white mb-1">
                {stats.avgRating}/5
              </div>
              <div className="text-white/70 text-sm">Satisfaction client</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== CATÉGORIES SECTION ========== */}
      <section className="py-20">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#E8EDE6] rounded-full text-xs text-[#3D5A3E] font-semibold mb-3">
              <FiZap size={12} /> Catégories populaires
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#1A1208] mb-4">
              Explorez par domaine
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/services?category=${cat.id}`}
                className="group bg-white rounded-2xl p-6 border border-[#E8EDE6] hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
              >
                <div
                  className={`absolute top-0 right-0 w-32 h-32 ${cat.bg} rounded-full -mr-16 -mt-16 opacity-50`}
                ></div>
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-5xl group-hover:scale-110 transition-transform">
                      {cat.icon}
                    </span>
                    <span
                      className={`${cat.bg} ${cat.text} px-3 py-1 rounded-full text-xs font-semibold`}
                    >
                      {cat.count} services
                    </span>
                  </div>
                  <h3 className="text-xl font-heading font-bold text-[#1A1208] mb-2">
                    {cat.name}
                  </h3>
                  <p className="text-[#5C5244] text-sm mb-4">
                    {cat.description}
                  </p>
                  <div className="flex items-center text-[#3D5A3E] font-medium text-sm group-hover:gap-2 transition-all gap-1">
                    Explorer <FiArrowRight size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========== SERVICES EN VEDETTE ========== */}
      {featuredServices.length > 0 && (
        <section className="py-20 bg-[#E8EDE6]/30">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#3D5A3E]/10 rounded-full text-xs text-[#3D5A3E] font-semibold mb-3">
                <FiTrendingUp size={12} /> Top services
              </span>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#1A1208] mb-4">
                Services les mieux notés
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredServices.map((service) => (
                <Link
                  key={service._id}
                  to={`/services/${service._id}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div
                    className={`h-48 bg-gradient-to-r ${categoryConfig[service.category]?.color || "from-emerald-500 to-teal-500"} flex items-center justify-center relative overflow-hidden`}
                  >
                    <span className="text-7xl group-hover:scale-110 transition-transform duration-500">
                      {categoryConfig[service.category]?.icon || "✨"}
                    </span>
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all"></div>
                    {service.rating >= 4.8 && (
                      <div className="absolute top-4 right-4 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                        <FiStar className="fill-current" size={10} /> Top
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-heading font-bold text-[#1A1208] line-clamp-1">
                        {service.title}
                      </h3>
                      <div className="flex items-center gap-1 bg-[#E8EDE6] px-2 py-1 rounded-full">
                        <FiStar
                          className="text-yellow-500 fill-current"
                          size={12}
                        />
                        <span className="text-sm font-semibold">
                          {service.rating || "Nouveau"}
                        </span>
                      </div>
                    </div>
                    <p className="text-[#5C5244] text-sm line-clamp-2">
                      {service.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-2xl font-bold text-[#3D5A3E]">
                        {service.price} DH
                      </span>
                      <div className="flex items-center gap-1 text-[#5C5244] text-sm">
                        <FiClock size={14} />
                        <span>{service.deliveryDays} jours</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                to="/services"
                className="inline-flex items-center gap-2 bg-[#3D5A3E] text-white hover:bg-[#2D452E] px-8 py-3 rounded-xl font-semibold transition-all hover:gap-3"
              >
                Voir tous les services <FiArrowRight />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ========== NOUVEAUTÉS SECTION ========== */}
      {newServices.length > 0 && (
        <section className="py-20">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#E8EDE6] rounded-full text-xs text-[#3D5A3E] font-semibold mb-3">
                <FiZap size={12} /> Nouveautés
              </span>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#1A1208] mb-4">
                Derniers services ajoutés
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newServices.map((service) => (
                <Link
                  key={service._id}
                  to={`/services/${service._id}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:-translate-y-1"
                >
                  <div className="h-32 bg-gradient-to-r from-gray-100 to-gray-50 flex items-center justify-center text-5xl">
                    {categoryConfig[service.category]?.icon || "✨"}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sm line-clamp-1">
                      {service.title}
                    </h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-bold text-[#3D5A3E]">
                        {service.price} DH
                      </span>
                      <div className="flex items-center gap-1 text-xs text-yellow-500">
                        <FiStar className="fill-current" size={10} />
                        <span>{service.rating || "Nouveau"}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========== AVANTAGES SECTION ========== */}
      <section className="py-20 bg-[#E8EDE6]/30">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-white rounded-full text-xs text-[#3D5A3E] font-semibold mb-3">
              <FiAward size={12} /> Avantages exclusifs
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#1A1208] mb-4">
              Pourquoi choisir Hirafi ?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 text-center hover:shadow-xl transition-all group"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#E8EDE6] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <benefit.icon className="text-[#3D5A3E]" size={28} />
                </div>
                <h3 className="text-lg font-heading font-bold text-[#1A1208] mb-2">
                  {benefit.title}
                </h3>
                <p className="text-[#5C5244] text-sm">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== AVIS CLIENTS SECTION ========== */}
      {recentReviews.length > 0 && (
        <section className="py-20 bg-gradient-to-r from-[#3D5A3E] to-[#2D452E] relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 60'%3E%3C/svg%3E\")",
            }}
          ></div>

          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 rounded-full text-xs text-white font-semibold mb-3">
                <FiHeart size={12} /> Ce qu'ils disent
              </span>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-4">
                Avis de nos clients
              </h2>
              <p className="text-white/80 max-w-2xl mx-auto">
                Des retours authentiques de clients satisfaits
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recentReviews.slice(0, 3).map((review) => (
                <div
                  key={review._id}
                  className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#3D5A3E] to-[#2D452E] flex items-center justify-center text-white font-bold text-lg">
                      {review.clientId?.name?.charAt(0) || "C"}
                    </div>
                    <div>
                      <h4 className="font-heading font-semibold text-[#1A1208]">
                        {review.clientId?.name || "Client"}
                      </h4>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <FiStar
                            key={i}
                            className={
                              i < review.rating
                                ? "text-yellow-500 fill-current"
                                : "text-gray-300"
                            }
                            size={14}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-[#5C5244] text-sm leading-relaxed italic">
                    "{review.comment}"
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-xs text-[#9B9082]">
                    <FiCalendar size={12} />
                    <span>
                      {new Date(review.createdAt).toLocaleDateString("fr-FR")}
                    </span>
                    <span className="ml-auto flex items-center gap-1">
                      <FiThumbsUp size={12} />
                      <span>Utile</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========== ARTISANS POPULAIRES ========== */}
      {trendingFreelancers.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#E8EDE6] rounded-full text-xs text-[#3D5A3E] font-semibold mb-3">
                <FiUsers size={12} /> Artisans à l'honneur
              </span>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#1A1208] mb-4">
                Les plus demandés
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingFreelancers.map((freelancer) => (
                <Link
                  key={freelancer.id}
                  to={`/freelancers/${freelancer.id}`}
                  className="group bg-[#E8EDE6]/30 rounded-2xl p-6 text-center hover:shadow-xl transition-all hover:-translate-y-1"
                >
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#3D5A3E] to-[#2D452E] flex items-center justify-center text-white text-3xl font-bold">
                    {freelancer.name?.charAt(0) || "A"}
                  </div>
                  <h3 className="font-heading font-semibold text-[#1A1208] mb-1">
                    {freelancer.name}
                  </h3>
                  <div className="flex items-center justify-center gap-3 text-xs text-[#5C5244] mb-3">
                    <span className="flex items-center gap-1">
                      <FiBriefcase size={12} /> {freelancer.totalServices}{" "}
                      services
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-1 text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <FiStar key={i} className="fill-current" size={14} />
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========== TÉMOIGNAGES CARROUSEL ========== */}
      {recentReviews.length > 0 && currentReview && (
        <section className="py-20 bg-[#E8EDE6]/30">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#3D5A3E]/10 rounded-full text-xs text-[#3D5A3E] font-semibold mb-3">
                <FiMessageCircle size={12} /> Témoignage du moment
              </span>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#1A1208] mb-4">
                Ils parlent de nous
              </h2>
            </div>

            <div className="relative max-w-4xl mx-auto">
              <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl">
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#3D5A3E] to-[#2D452E] flex items-center justify-center text-white text-3xl font-bold mb-6">
                    {currentReview.clientId?.name?.charAt(0) || "C"}
                  </div>
                  <div className="flex gap-1 text-yellow-500 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        className={
                          i < currentReview.rating ? "fill-current" : ""
                        }
                        size={20}
                      />
                    ))}
                  </div>
                  <p className="text-[#1A1208] text-lg italic mb-6 leading-relaxed">
                    "{currentReview.comment}"
                  </p>
                  <h4 className="font-heading font-bold text-[#1A1208] text-lg">
                    {currentReview.clientId?.name}
                  </h4>
                  <p className="text-[#5C5244] text-sm">Client satisfait</p>
                </div>
              </div>

              <div className="flex justify-center gap-2 mt-8">
                {recentReviews.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentTestimonial(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      currentTestimonial === idx
                        ? "w-8 bg-[#3D5A3E]"
                        : "bg-[#C47D4E]/50"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========== FAQ SECTION ========== */}
      <section className="py-20">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#E8EDE6] rounded-full text-xs text-[#3D5A3E] font-semibold mb-3">
              <FiBookOpen size={12} /> FAQ
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#1A1208] mb-4">
              Questions fréquentes
            </h2>
            <p className="text-[#5C5244] max-w-2xl mx-auto">
              Tout ce que vous devez savoir sur Hirafi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 hover:shadow-lg transition-all group border border-[#E8EDE6]"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#E8EDE6] flex items-center justify-center group-hover:bg-[#3D5A3E] group-hover:text-white transition-all flex-shrink-0">
                    <span className="font-bold">?</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-heading font-bold text-[#1A1208] mb-2">
                      {faq.q}
                    </h3>
                    <p className="text-[#5C5244] text-sm">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              to="/faq"
              className="inline-flex items-center gap-2 text-[#3D5A3E] font-semibold hover:gap-3 transition-all"
            >
              Voir toutes les FAQs <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ========== CTA FINAL ========== */}
      <section className="py-20">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden bg-gradient-to-r from-[#3D5A3E] to-[#2D452E] rounded-3xl p-12 text-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <div className="text-6xl mb-4">🚀</div>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-4">
                Prêt à donner vie à vos projets ?
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
                Rejoignez notre communauté et trouvez l'artisan parfait pour
                réaliser vos idées
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="bg-white text-[#3D5A3E] hover:bg-gray-100 px-8 py-3 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg"
                >
                  Commencer maintenant
                </Link>
                <Link
                  to="/services"
                  className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-3 rounded-xl font-semibold transition-all"
                >
                  Explorer les services
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

export default Home;
