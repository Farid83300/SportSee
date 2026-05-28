// =============================================================================
// SPORTSEE — ProtectedRoute
// Redirige vers /login si l'utilisateur n'est pas authentifié
// =============================================================================

// app/components/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router";
import { isAuthenticated } from "../auth/authCookie";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";

export default function ProtectedRoute() {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-layout">
      <Navbar />
      <main className="app-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
