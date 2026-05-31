// =============================================================================
// SPORTSEE — Composant Navbar
// Apparaît sur toutes les pages protégées
// Auteur : Farid Zaffalone — OpenClassrooms Projet 6
// =============================================================================

import { NavLink, useNavigate } from "react-router";
import { clearAuth } from "../../auth/authCookie";
import AnimatedLogo from "../AnimatedLogo/AnimatedLogo";

export default function Navbar() {
  const navigate = useNavigate();

  function handleLogout() {
    clearAuth();
    navigate("/login", { replace: true });
  }

  return (
    <nav className="navbar">

      {/* Logo — icône animée + texte SPORTSEE alignés */}
      <NavLink to="/" className="navbar-logo">
        <AnimatedLogo height={21} />
        <img src="/SPORTSEE.svg" alt="SportSee" style={{ height: "21px" }} />
      </NavLink>

      {/* Navigation — pill à droite */}
      <ul className="navbar-nav">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) => isActive ? "active" : ""}
          >
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/profile"
            className={({ isActive }) => isActive ? "active" : ""}
          >
            Mon profil
          </NavLink>
        </li>
        <li>
          <div className="navbar-separator" />
        </li>
        <li>
          <button onClick={handleLogout} className="btn-logout">
            Se déconnecter
          </button>
        </li>
      </ul>

    </nav>
  );
}
