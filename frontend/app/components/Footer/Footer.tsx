// =============================================================================
// SPORTSEE — Composant Footer
// Apparaît en bas de toutes les pages
// Auteur : Farid Zaffalone — OpenClassrooms Projet 6
// =============================================================================

import AnimatedLogo from "../AnimatedLogo/AnimatedLogo";

export default function Footer() {
  return (
    <footer className="footer">

      {/* Copyright */}
      <span>©Sportsee Tous droits réservés</span>

      {/* Liens + logo animé */}
      <div className="footer-links">
        <a href="#">Conditions générales</a>
        <a href="#">Contact</a>
        <AnimatedLogo height={20} />
      </div>

    </footer>
  );
}
