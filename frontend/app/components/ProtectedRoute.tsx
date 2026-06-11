// =============================================================================
// SPORTSEE — ProtectedRoute
// Redirige vers /login si l'utilisateur n'est pas authentifié
// =============================================================================


import { isAuthenticated } from "../auth/authCookie";
import { Outlet, useLocation, useNavigate } from "react-router";
import { useEffect } from "react";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";

export default function ProtectedRoute() {
  const location = useLocation();
  const navigate = useNavigate();

  // Redirection immédiate si non authentifié — <Navigate> est déclaratif,
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login", { replace: true, state: { from: location } });
    }
  }, []);

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
