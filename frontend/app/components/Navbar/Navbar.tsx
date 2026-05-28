// =============================================================================
// SPORTSEE — Composant Navbar
// Apparaît sur toutes les pages protégées
// Auteur : Farid Zaffalone — OpenClassrooms Projet 6
// =============================================================================

import { NavLink, useNavigate } from "react-router";
import { clearAuth } from "../../auth/authCookie";

export default function Navbar() {
  const navigate = useNavigate();

  function handleLogout() {
    clearAuth();
    navigate("/login", { replace: true });
  }

  return (
    <nav className="navbar">

      {/* Logo — aligné à gauche */}
      <NavLink to="/" className="navbar-logo">
        <img src="/logo.svg" alt="SportSee" />
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
