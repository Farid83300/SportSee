// =============================================================================
// SPORTSEE — Configuration des routes (React Router v7)
// =============================================================================

import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
  // Route publique — page de login
  route("login", "routes/login.tsx"),

  // Routes protégées — nécessitent une authentification
  layout("components/ProtectedRoute.tsx", [
    // Page d'accueil → redirige vers /dashboard
    index("routes/home.tsx"),

    // Dashboard principal
    route("dashboard", "routes/dashboard.tsx"),
  ]),

  // Gestion des routes inexistantes (404)
  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
