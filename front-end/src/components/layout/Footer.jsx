import { Link } from "react-router-dom";
import {
  FiMapPin,
  FiMail,
  FiPhone,
  FiInstagram,
  FiLinkedin,
  FiFacebook,
  FiTwitter,
  FiHeart,
  FiTrendingUp,
  FiAward,
  FiUsers,
  FiChevronRight,
} from "react-icons/fi";
import { useState, useEffect } from "react";
import { serviceApi } from "../../api/serviceApi";
import { useAuth } from "../../hooks/useAuth";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [isVisible, setIsVisible] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [categoriesStats, setCategoriesStats] = useState([]);
  const [totalStats, setTotalStats] = useState({
    totalFreelancers: 0,
    totalServices: 0,
    totalOrders: 0,
    avgRating: 0,
  });
  const [loading, setLoading] = useState(true);
const { user } = useAuth();


  // Catégories avec leurs icônes (statiques car ce sont des filtres)
  const categoryConfig = {
    "graphic-design": { name: "Design Graphique", icon: "🎨" },
    "web-development": { name: "Développement Web", icon: "💻" },
    marketing: { name: "Marketing Digital", icon: "📈" },
    writing: { name: "Rédaction", icon: "✍️" },
    video: { name: "Vidéo & Animation", icon: "🎥" },
    consulting: { name: "Consulting", icon: "💡" },
  };

  // Gérer l'affichage du bouton scroll to top
  useEffect(() => {
    const handleScroll = () => {
      // Afficher le bouton après avoir défilé de 300px
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Vérifier la position initiale
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Charger les catégories dynamiquement depuis les services
  useEffect(() => {
    const fetchCategoriesStats = async () => {
      setLoading(true);
      try {
        const response = await serviceApi.getAllServices({ limit: 1000 });
        const services = response.data.services || [];

        // Calculer les statistiques par catégorie
        const categoryMap = new Map();

        services.forEach((service) => {
          const category = service.category;
          if (category && categoryConfig[category]) {
            if (!categoryMap.has(category)) {
              categoryMap.set(category, {
                id: category,
                name: categoryConfig[category].name,
                icon: categoryConfig[category].icon,
                count: 0,
                totalOrders: 0,
                avgRating: 0,
                ratingSum: 0,
              });
            }
            const catData = categoryMap.get(category);
            catData.count++;
            catData.totalOrders += service.orders || 0;
            if (service.rating) {
              catData.ratingSum += service.rating;
            }
          }
        });

        // Calculer la moyenne des ratings et préparer les données
        const categoriesArray = Array.from(categoryMap.values()).map((cat) => ({
          ...cat,
          avgRating:
            cat.ratingSum > 0 ? (cat.ratingSum / cat.count).toFixed(1) : 0,
        }));

        // Trier par nombre de services (décroissant)
        categoriesArray.sort((a, b) => b.count - a.count);

        setCategoriesStats(categoriesArray);

        // Calculer les statistiques globales
        const totalFreelancers = new Set(
          services.map((s) => s.freelancerId?._id).filter(Boolean),
        ).size;
        const totalServices = services.length;
        const totalOrders = services.reduce(
          (acc, s) => acc + (s.orders || 0),
          0,
        );
        const avgRating =
          services.reduce((acc, s) => acc + (s.rating || 0), 0) /
          (totalServices || 1);

        setTotalStats({
          totalFreelancers,
          totalServices,
          totalOrders,
          avgRating: avgRating.toFixed(1),
        });
      } catch (error) {
        console.error("Erreur chargement catégories footer:", error);
        // Données par défaut en cas d'erreur
        setCategoriesStats([
          {
            id: "graphic-design",
            name: "Design Graphique",
            icon: "🎨",
            count: 0,
            totalOrders: 0,
            avgRating: 0,
          },
          {
            id: "web-development",
            name: "Développement Web",
            icon: "💻",
            count: 0,
            totalOrders: 0,
            avgRating: 0,
          },
          {
            id: "marketing",
            name: "Marketing Digital",
            icon: "📈",
            count: 0,
            totalOrders: 0,
            avgRating: 0,
          },
          {
            id: "writing",
            name: "Rédaction",
            icon: "✍️",
            count: 0,
            totalOrders: 0,
            avgRating: 0,
          },
        ]);
        setTotalStats({
          totalFreelancers: 0,
          totalServices: 0,
          totalOrders: 0,
          avgRating: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCategoriesStats();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 },
    );

    const footer = document.getElementById("footer");
    if (footer) observer.observe(footer);

    return () => {
      if (footer) observer.unobserve(footer);
    };
  }, []);

  // Fonction pour scroll en haut avec animation
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Statistiques pour l'affichage
  const stats = [
    {
      icon: FiUsers,
      value: totalStats.totalFreelancers,
      label: "Artisans actifs",
      suffix: "+",
      color: "#3D5A3E",
    },
    {
      icon: FiTrendingUp,
      value: totalStats.totalServices,
      label: "Services proposés",
      suffix: "+",
      color: "#C47D4E",
    },
    {
      icon: FiAward,
      value: totalStats.avgRating,
      label: "Note moyenne",
      suffix: "★",
      color: "#3D5A3E",
    },
  ];

  // Liens des réseaux sociaux avec icônes
  const socialLinks = [
    {
      icon: FiInstagram,
      name: "Instagram",
      url: "https://instagram.com",
      color: "hover:text-pink-600",
    },
    {
      icon: FiLinkedin,
      name: "LinkedIn",
      url: "https://linkedin.com",
      color: "hover:text-blue-700",
    },
    {
      icon: FiFacebook,
      name: "Facebook",
      url: "https://facebook.com",
      color: "hover:text-blue-600",
    },
    {
      icon: FiTwitter,
      name: "Twitter",
      url: "https://twitter.com",
      color: "hover:text-sky-500",
    },
  ];

  // Villes marocaines
  const cities = [
    "Casablanca",
    "Rabat",
    "Marrakech",
    "Fès",
    "Tanger",
    "Agadir",
    "Tétouan",
    "Meknès",
  ];

  return (
    <footer
      id="footer"
      className="relative bg-gradient-to-br from-[#FAF8F5] to-[#F5F2EE] dark:from-gray-900 dark:to-gray-800 border-t border-[#E8E2D9] dark:border-gray-700 mt-auto overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-20 right-20 w-40 h-40 border-2 border-[#3D5A3E] rounded-full"></div>
        <div className="absolute bottom-20 left-20 w-60 h-60 border-2 border-[#C47D4E] rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-[#3D5A3E] rotate-45"></div>
      </div>

      <div className="relative max-w-[1280px] mx-auto px-4 md:px-6 py-12 md:py-16">
        {/* Newsletter Section */}
        <div className="mb-12 p-6 md:p-8 bg-gradient-to-r from-[#3D5A3E] to-[#2D452E] rounded-2xl text-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <h3 className="text-2xl font-display font-bold mb-2">
                Restez connecté
              </h3>
              <p className="text-white/80 text-sm">
                Recevez nos actualités et offres exclusives
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="flex-1 px-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <a
                href="/register"
                className="px-6 py-2 bg-white text-[#3D5A3E] rounded-lg font-semibold hover:bg-gray-100 transition-all hover:scale-105"
              >
                S'abonner
              </a>
            </div>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Brand Section */}
          <div
            className={`transform transition-all duration-700 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
          >
            <div className="mb-4">
              <span className="text-3xl font-display font-black text-[#3D5A3E] dark:text-[#3D5A3E] tracking-tight">
                حريفي
              </span>
              <div className="text-xs text-[#3D5A3E] dark:text-[#3D5A3E] mt-1">
                Hirafi
              </div>
            </div>
            <p className="text-[#6B5E4F] dark:text-gray-400 text-sm leading-relaxed mb-4">
              La plateforme marocaine qui connecte les artisans et freelances
              talentueux avec des clients qui cherchent l'authenticité et la
              qualité.
            </p>

            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#6B5E4F] dark:text-gray-400 text-sm">
                <FiMapPin
                  className="text-[#3D5A3E] dark:text-[#3D5A3E]"
                  size={16}
                />
                <span>Casablanca, Maroc</span>
              </div>
              <div className="flex items-center gap-2 text-[#6B5E4F] dark:text-gray-400 text-sm">
                <FiMail
                  className="text-[#3D5A3E] dark:text-[#3D5A3E]"
                  size={16}
                />
                <a
                  href="mailto:contact@hirafi.ma"
                  className="hover:text-[#3D5A3E] transition-colors"
                >
                  contact@hirafi.ma
                </a>
              </div>
              <div className="flex items-center gap-2 text-[#6B5E4F] dark:text-gray-400 text-sm">
                <FiPhone
                  className="text-[#3D5A3E] dark:text-[#3D5A3E]"
                  size={16}
                />
                <a
                  href="tel:+212520000000"
                  className="hover:text-[#3D5A3E] transition-colors"
                >
                  +212 5 20 00 00 00
                </a>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center">
                  <stat.icon
                    className="mx-auto mb-1"
                    color={stat.color}
                    size={20}
                  />
                  <div className="font-bold text-[#1A1208] dark:text-white text-sm">
                    {stat.value}
                    {stat.suffix}
                  </div>
                  <div className="text-[#9B9082] dark:text-gray-500 text-xs">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dynamic Categories Section */}
          <div
            className={`transform transition-all duration-700 delay-100 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
          >
            <h4 className="font-display font-semibold mb-4 text-[#1A1208] dark:text-white text-base relative inline-block">
              Catégories populaires
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-[#C47D4E] mt-1"></span>
            </h4>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                  ></div>
                ))}
              </div>
            ) : (
              <ul className="space-y-3">
                {categoriesStats.map((cat, idx) => (
                  <li key={idx}>
                    <Link
                      to={`/services?category=${cat.id}`}
                      className="group flex justify-between items-center text-[#6B5E4F] dark:text-gray-400 hover:text-[#3D5A3E] dark:hover:text-[#3D5A3E] text-sm transition-all duration-200"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-lg">{cat.icon}</span>
                        <span className="flex items-center gap-1">
                          <FiChevronRight
                            className="opacity-0 group-hover:opacity-100 transition-all text-[#3D5A3E]"
                            size={12}
                          />
                          {cat.name}
                        </span>
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-[#E8EDE6] dark:bg-gray-700 px-2 py-0.5 rounded-full">
                          {cat.count} services
                        </span>
                        {/* {cat.avgRating > 0 && (
                                                    <span className="text-xs text-[#C47D4E] flex items-center gap-1">
                                                        ⭐ {cat.avgRating}
                                                    </span>
                                                )} */}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            {/* Lien voir toutes les catégories */}
            <Link
              to="/categories"
              className="inline-flex items-center gap-1 mt-4 text-sm text-[#3D5A3E] dark:text-[#3D5A3E] hover:underline"
            >
              Voir toutes les catégories
              <FiChevronRight size={14} />
            </Link>
          </div>

          {/* Explorer & Support Combined */}
          <div
            className={`transform transition-all duration-700 delay-200 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-100"}`}
          >
            <div className="mb-6">
              <h4 className="font-display font-semibold mb-4 text-[#1A1208] dark:text-white text-base relative inline-block">
                Explorer
                <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-[#C47D4E] mt-1"></span>
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/services"
                    className="text-[#6B5E4F] dark:text-gray-400 hover:text-[#3D5A3E] dark:hover:text-[#3D5A3E] text-sm transition-colors duration-200 flex items-center gap-1"
                  >
                    Tous les services
                  </Link>
                </li>
                <li>
                  <Link
                    to="/freelancers"
                    className="text-[#6B5E4F] dark:text-gray-400 hover:text-[#3D5A3E] dark:hover:text-[#3D5A3E] text-sm transition-colors duration-200"
                  >
                    Artisans
                  </Link>
                </li>
                <li>
                  <Link
                    to="/categories"
                    className="text-[#6B5E4F] dark:text-gray-400 hover:text-[#3D5A3E] dark:hover:text-[#3D5A3E] text-sm transition-colors duration-200"
                  >
                    Catégories
                  </Link>
                </li>
                <li>
                  <Link
                    to="/regions"
                    className="text-[#6B5E4F] dark:text-gray-400 hover:text-[#3D5A3E] dark:hover:text-[#3D5A3E] text-sm transition-colors duration-200"
                  >
                    Régions du Maroc
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-display font-semibold mb-4 text-[#1A1208] dark:text-white text-base relative inline-block">
                Support
                <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-[#C47D4E] mt-1"></span>
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/faq"
                    className="text-[#6B5E4F] dark:text-gray-400 hover:text-[#3D5A3E] dark:hover:text-[#3D5A3E] text-sm transition-colors duration-200"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-[#6B5E4F] dark:text-gray-400 hover:text-[#3D5A3E] dark:hover:text-[#3D5A3E] text-sm transition-colors duration-200"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms"
                    className="text-[#6B5E4F] dark:text-gray-400 hover:text-[#3D5A3E] dark:hover:text-[#3D5A3E] text-sm transition-colors duration-200"
                  >
                    Conditions générales
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy"
                    className="text-[#6B5E4F] dark:text-gray-400 hover:text-[#3D5A3E] dark:hover:text-[#3D5A3E] text-sm transition-colors duration-200"
                  >
                    Confidentialité
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Popular Cities & Social Media */}
          <div
            className={`transform transition-all duration-700 delay-300 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-100"}`}
          >
            <div className="mb-6">
              <h4 className="font-display font-semibold mb-4 text-[#1A1208] dark:text-white text-base relative inline-block">
                Villes populaires
                <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-[#C47D4E] mt-1"></span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {cities.map((city, idx) => (
                  <Link
                    key={idx}
                    to={`/regions?city=${city.toLowerCase()}`}
                    className="text-xs px-2 py-1 bg-[#E8EDE6] dark:bg-gray-700 text-[#6B5E4F] dark:text-gray-300 rounded-full hover:bg-[#3D5A3E] hover:text-white transition-all"
                  >
                    {city}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-display font-semibold mb-4 text-[#1A1208] dark:text-white text-base relative inline-block">
                Suivez-nous
                <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-[#C47D4E] mt-1"></span>
              </h4>
              <div className="flex gap-4">
                {socialLinks.map((social, idx) => (
                  <a
                    key={idx}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-[#E8EDE6] dark:bg-gray-700 rounded-full flex items-center justify-center text-[#6B5E4F] dark:text-gray-300 hover:bg-[#3D5A3E] hover:text-white transition-all transform hover:scale-110"
                    aria-label={social.name}
                  >
                    <social.icon size={20} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#E8E2D9] dark:border-gray-700 mt-8 md:mt-12 pt-6 md:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-[#9B9082] dark:text-gray-500 text-xs flex items-center gap-1">
              &copy; {currentYear} Hirafi. Tous droits réservés.
              <FiHeart size={12} className="text-red-500 animate-pulse ml-1" />
            </p>
            <div className="flex gap-6 flex-wrap justify-center">
              <Link
                to="/terms"
                className="text-[#9B9082] dark:text-gray-500 hover:text-[#3D5A3E] dark:hover:text-[#3D5A3E] text-xs transition-colors duration-200"
              >
                Mentions légales
              </Link>
              <Link
                to="/privacy"
                className="text-[#9B9082] dark:text-gray-500 hover:text-[#3D5A3E] dark:hover:text-[#3D5A3E] text-xs transition-colors duration-200"
              >
                Politique de confidentialité
              </Link>
              <Link
                to="/cookies"
                className="text-[#9B9082] dark:text-gray-500 hover:text-[#3D5A3E] dark:hover:text-[#3D5A3E] text-xs transition-colors duration-200"
              >
                Cookies
              </Link>
              <Link
                to="/accessibility"
                className="text-[#9B9082] dark:text-gray-500 hover:text-[#3D5A3E] dark:hover:text-[#3D5A3E] text-xs transition-colors duration-200"
              >
                Accessibilité
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to top button - Apparaît après 300px de défilement */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-20 md:bottom-6 right-6 bg-[#3D5A3E] text-white p-3 rounded-full shadow-lg hover:bg-[#2D452E] transition-all hover:scale-110 z-50 animate-fade-in-up"
          aria-label="Retour en haut"
          style={{ bottom: user ? "5rem" : "1.5rem" }}
        >
          <FiChevronRight className="rotate-[-90deg]" size={20} />
        </button>
      )}

      <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
                .animate-pulse {
                    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-fade-in-up {
                    animation: fadeInUp 0.3s ease-out;
                }
            `}</style>
    </footer>
  );
};

export default Footer;
