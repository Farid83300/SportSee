// =============================================================================
// SPORTSEE — Page 404 Not Found
// Auteur : Farid Zaffalone — OpenClassrooms Projet 6
// =============================================================================

import { Link } from "react-router";

export default function NotFoundPage() {
  return (
    <main className="not-found-page">

      {/* Logo */}
      <div className="not-found-logo">
        <img src="/logo.svg" alt="SportSee" />
      </div>

      {/* Contenu */}
      <div className="not-found-content">
        <p className="not-found-code">404</p>
        <h1 className="not-found-title">Page introuvable</h1>
        <p className="not-found-text">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <Link to="/" className="not-found-btn">
          Retour au dashboard
        </Link>
      </div>

    </main>
  );
}
