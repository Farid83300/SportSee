// =============================================================================
// SPORTSEE — Composant Footer
// Apparaît en bas de toutes les pages
// Auteur : Farid Zaffalone — OpenClassrooms Projet 6
// =============================================================================

export default function Footer() {
  return (
    <footer className="footer">

      {/* Copyright */}
      <span>©Sportsee Tous droits réservés</span>

      {/* Liens */}
      <div className="footer-links">
        <a href="#">Conditions générales</a>
        <a href="#">Contact</a>
        <img src="/Logo2.png" alt="SportSee" style={{ height: "20px" }} />
      </div>

    </footer>
  );
}
