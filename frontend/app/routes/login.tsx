// =============================================================================
// SPORTSEE — Page Login
// Route publique — gestion de la redirection et layout de la page
// Auteur : Farid Zaffalone — OpenClassrooms Projet 6
// =============================================================================

import { useNavigate } from "react-router";
import { isAuthenticated } from "../auth/authCookie";
import LoginForm from "../components/LoginForm/LoginForm";
import AnimatedLogo from "../components/AnimatedLogo/AnimatedLogo";

export default function LoginPage() {
  const navigate = useNavigate();

  // Redirige vers le dashboard si déjà connecté
  if (isAuthenticated()) {
    navigate("/", { replace: true });
  }

  return (
    <div className="login-page">

      {/* ── Colonne gauche — logo + formulaire ── */}
      <div className="login-left">
        <div className="login-logo">
          <AnimatedLogo height={21} />
          <img src="/SPORTSEE.svg" alt="SportSee" style={{ height: "21px", width: "auto" }} />
        </div>
        <LoginForm />
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
