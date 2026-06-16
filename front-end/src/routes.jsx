// src/routes.jsx
import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

// Layouts
import Layout from "./components/layout/Layout";
import FreelancerLayout from "./components/layout/FreelancerLayout";
import ClientLayout from "./components/layout/ClientLayout";
import MessagesLayout from "./components/layout/MessagesLayout";

// Guards
import PrivateRoute from "./components/common/PrivateRoute";
import PublicRoute from "./components/common/PublicRoute";
import AdminLayout from "./components/layout/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminServices from "./pages/admin/AdminServices";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminSettings from "./pages/admin/AdminSettings";

// Pages partagées
import Home from "./pages/shared/Home";
import Login from "./pages/shared/Login";
import Register from "./pages/shared/Register";
import Services from "./pages/shared/Services";
import ServiceDetails from "./pages/shared/ServiceDetails";
import Categories from "./pages/shared/Categories";
import NotFound from "./pages/shared/NotFound";

// Pages Client
import ClientDashboard from "./pages/client/ClientDashboard";
import MyOrders from "./pages/client/MyOrders";

// Pages Freelancer
import FreelancerDashboard from "./pages/freelancer/FreelancerDashboard";
import FreelancerOrders from "./pages/freelancer/FreelancerOrders";
import FreelancerServices from "./pages/freelancer/FreelancerServices";
import FreelancerProfile from "./pages/freelancer/FreelancerProfile";
import FreelancerSettings from "./pages/freelancer/FreelancerSettings";
import FreelancerMessages from "./pages/freelancer/FreelancerMessages";
import CreateService from "./pages/freelancer/CreateService";
import EditService from "./pages/freelancer/EditService";
import FreelancerServiceDetails from "./pages/freelancer/FreelancerServiceDetails";
import Freelancers from "./pages/shared/Freelancers";
import FreelancerDetails from "./pages/shared/FreelancerDetails";
import HowItWorks from "./pages/shared/HowItWorks";
import SuccessStories from "./pages/shared/SuccessStories";
import ClientWishlist from "./pages/client/ClientWishlist";
import ClientMessages from "./pages/client/ClientMessages";
import Messages from "./pages/shared/Messages";
import ClientProfile from "./pages/client/ClientProfile";
import ClientSettings from "./pages/client/ClientSettings";
import FAQ from "./pages/shared/FAQ";
import Regions from "./pages/shared/Regions";
import Contact from "./pages/shared/Contact";

export const router = createBrowserRouter([
  {
    // Layout principal pour les pages publiques
    element: <Layout />,
    children: [
      // Pages publiques
      { path: "/", element: <Home /> },
      { path: "/services", element: <Services /> },
      { path: "/services/:id", element: <ServiceDetails /> },
      { path: "/categories", element: <Categories /> },
      { path: "/freelancers", element: <Freelancers /> },
      { path: "/freelancers/:id", element: <FreelancerDetails /> },
      { path: "/how-it-works", element: <HowItWorks /> },
      { path: "/success-stories", element: <SuccessStories /> },
      //   { path: "/messages", element: <Messages /> },
      { path: "/faq", element: <FAQ /> }, // ✅ Ajouté
      { path: "/regions", element: <Regions /> }, // ✅ Ajouté
      { path: "/contact", element: <Contact /> },
      { path: "/not-found", element: <NotFound /> },

      // Routes publiques (non connecté)
      {
        element: <PublicRoute />,
        children: [
          { path: "/login", element: <Login /> },
          { path: "/register", element: <Register /> },
        ],
      },
    ],
  },
  // Routes Client
  {
    element: <PrivateRoute allowedRoles={["client"]} />,
    children: [
      {
        element: <ClientLayout />,
        children: [
          { path: "/client/dashboard", element: <ClientDashboard /> },
          { path: "/client/orders", element: <MyOrders /> },
          { path: "/client/wishlist", element: <ClientWishlist /> },
          { path: "/client/messages", element: <ClientMessages /> },
          { path: "/client/profile", element: <ClientProfile /> },
          { path: "/client/settings", element: <ClientSettings /> },
        ],
      },
    ],
  },

  // Dans la configuration
  {
    element: <PrivateRoute allowedRoles={["admin"]} />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: "/admin/dashboard", element: <AdminDashboard /> },
          { path: "/admin/users", element: <AdminUsers /> },
          { path: "/admin/orders", element: <AdminOrders /> },
          { path: "/admin/services", element: <AdminServices /> },
          { path: "/admin/reviews", element: <AdminReviews /> },
          { path: "/admin/settings", element: <AdminSettings /> },
        ],
      },
    ],
  },

  // Layout Freelancer avec sidebar dédiée
  {
    element: <PrivateRoute allowedRoles={["freelancer"]} />,
    children: [
      {
        element: <FreelancerLayout />,
        children: [
          // Dashboard
          { path: "/freelancer/dashboard", element: <FreelancerDashboard /> },

          // Commandes
          { path: "/freelancer/orders", element: <FreelancerOrders /> },

          // Services
          { path: "/freelancer/services", element: <FreelancerServices /> },
          { path: "/freelancer/services/create", element: <CreateService /> },
          { path: "/freelancer/services/edit/:id", element: <EditService /> },

          // Messages
          { path: "/freelancer/messages", element: <FreelancerMessages /> },
          { path: "/freelancer/messages/:id", element: <FreelancerMessages /> },
          {
            path: "/freelancer/services/:id",
            element: <FreelancerServiceDetails />,
          },

          // Profil
          { path: "/freelancer/profile", element: <FreelancerProfile /> },

          // Paramètres
          { path: "/freelancer/settings", element: <FreelancerSettings /> },
        ],
      },
    ],
  },
  {
    element: <MessagesLayout />,
    children: [{ path: "/messages", element: <Messages /> }],
  },

  // Redirection 404 pour toutes les routes non trouvées
  { path: "*", element: <Navigate to="/not-found" replace /> },
]);
