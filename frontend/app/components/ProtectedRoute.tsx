// =============================================================================
// SPORTSEE — ProtectedRoute
// Redirige vers /login si l'utilisateur n'est pas authentifié
// =============================================================================

import { Navigate, Outlet } from "react-router";
import { isAuthenticated } from "../auth/authCookie";

export default function ProtectedRoute() {
  if (!isAuthenticated()) {
    // Redirige vers la page de login si pas de token
    return <Navigate to="/login" replace />;
  }

  // Rend les routes enfants si authentifié
  return <Outlet />;
}
