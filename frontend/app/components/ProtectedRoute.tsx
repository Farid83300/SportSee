// =============================================================================
// SPORTSEE — ProtectedRoute
// Redirige vers /login si l'utilisateur n'est pas authentifié
// =============================================================================

// app/components/ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from "react-router";
import { isAuthenticated } from "../auth/authCookie";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";

export default function ProtectedRoute() {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const location = useLocation();
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
