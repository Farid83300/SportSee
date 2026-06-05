// =============================================================================
// SPORTSEE — ProtectedRoute
// Redirige vers /login si l'utilisateur n'est pas authentifié
// =============================================================================

// app/components/ProtectedRoute.tsx
import { Outlet, useLocation, useNavigate } from "react-router";
import { useEffect } from "react";
import { isAuthenticated } from "../auth/authCookie";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";

export default function ProtectedRoute() {
  // ✅ Tous les hooks appelés en premier, sans exception
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Redirection dans un useEffect — jamais pendant le render
  // Pas le choix que d'utiliser useEffet car react router 7 inclut SSR et cause problème avec navigate() appelé directement dans le render
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login", { replace: true, state: { from: location } });
    }
  }, []);

  // Si non authentifié, on ne rend rien le temps que useEffect s'exécute
  if (!isAuthenticated()) {
    return null;
  }

  const isProfile = location.pathname === "/profile";

  return (
    <div className="app-layout">
      <Navbar />
      <main className={isProfile ? "app-main app-main--wide" : "app-main"}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
