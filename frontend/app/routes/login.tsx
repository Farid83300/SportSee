// =============================================================================
// SPORTSEE — Page Login
// Route publique — gestion de la redirection et layout de la page
// Auteur : Farid Zaffalone — OpenClassrooms Projet 6
// =============================================================================

import { Navigate } from "react-router";
import { isAuthenticated } from "../auth/authCookie";
import { useAppContext } from "../context/useAppContext";
import LoginForm from "../components/LoginForm/LoginForm";
import AnimatedLogo from "../components/AnimatedLogo/AnimatedLogo";

export default function LoginPage() {
  const { refreshUserInfo } = useAppContext();

  // ✅ Redirection déclarative via <Navigate> — pas d'appel de fonction dans le render
  if (isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="login-page">

      {/* ── Colonne gauche — logo + formulaire ── */}
      <div className="login-left">
        <div className="login-logo">
          <AnimatedLogo height={21} />
          <img src="/SPORTSEE.svg" alt="SportSee" style={{ height: "21px", width: "auto" }} />
        </div>
        {/* ✅ refreshUserInfo transmis au formulaire pour recharger le contexte après login */}
        <LoginForm onLoginSuccess={refreshUserInfo} />
      </div>

      {/* ── Colonne droite — image marathon ── */}
      <div className="login-right">
        <img
          src="/images/marathon.png"
          alt="Coureurs en marathon"
        />
        <div className="login-right-caption">
          Analysez vos performances en un clin d'œil,
          suivez vos progrès et atteignez vos objectifs.
        </div>
      </div>

    </div>
  );
}
