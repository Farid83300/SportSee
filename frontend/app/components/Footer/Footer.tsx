// =============================================================================
// SPORTSEE — Composant Footer
// Apparaît en bas de toutes les pages
// Auteur : Farid Zaffalone — OpenClassrooms Projet 6
// =============================================================================

import AnimatedLogo from "../AnimatedLogo/AnimatedLogo";

export default function Footer() {
  return (
    <footer className="footer">

      {/* Copyright + liens — groupe de gauche */}
      <div className="footer-left">
        <span>©Sportsee Tous droits réservés</span>
        <div className="footer-links">
          <a href="#">Conditions générales</a>
          <a href="#">Contact</a>
        </div>
      </div>

      {/* Logo animé — toujours à droite */}
      <AnimatedLogo height={20} />

    </footer>
  );
}
