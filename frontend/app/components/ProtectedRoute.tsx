// =============================================================================
// SPORTSEE — ProtectedRoute
// Redirige vers /login si l'utilisateur n'est pas authentifié
// =============================================================================

import { Navigate, Outlet, useLocation } from "react-router";
import { isAuthenticated } from "../auth/authCookie";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";

export default function ProtectedRoute() {
  const location = useLocation();

  // Redirection immédiate si non authentifié — <Navigate> est déclaratif,
  // pas besoin de useEffect contrairement à navigate()
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
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
