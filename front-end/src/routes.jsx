// src/routes.jsx
import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

// Layouts
import Layout from "./components/layout/Layout";
import FreelancerLayout from "./components/layout/FreelancerLayout";

// Guards
import PrivateRoute from "./components/common/PrivateRoute";
import PublicRoute from "./components/common/PublicRoute";

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

// Pages Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import FreelancerServiceDetails from "./pages/freelancer/FreelancerServiceDetails";

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
      { path: "/not-found", element: <NotFound /> },

      // Routes publiques (non connecté)
      {
        element: <PublicRoute />,
        children: [
          { path: "/login", element: <Login /> },
          { path: "/register", element: <Register /> },
        ],
      },

      // Routes Client (connecté avec rôle client)
      {
        element: <PrivateRoute allowedRoles={["client"]} />,
        children: [
          { path: "/client/dashboard", element: <ClientDashboard /> },
          { path: "/client/orders", element: <MyOrders /> },
        ],
      },

      // Routes Admin (connecté avec rôle admin)
      {
        element: <PrivateRoute allowedRoles={["admin"]} />,
        children: [
          { path: "/admin/dashboard", element: <AdminDashboard /> },
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
          { path: "/freelancer/services/:id", element: <FreelancerServiceDetails /> },
          
          // Profil
          { path: "/freelancer/profile", element: <FreelancerProfile /> },
          
          // Paramètres
          { path: "/freelancer/settings", element: <FreelancerSettings /> },
        ],
      },
    ],
  },

  // Redirection 404 pour toutes les routes non trouvées
  { path: "*", element: <Navigate to="/not-found" replace /> },
]);