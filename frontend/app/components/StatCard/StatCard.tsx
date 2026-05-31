// =============================================================================
// SPORTSEE — Composant StatCard
// Carte bleue réutilisable pour afficher une statistique
// Auteur : Farid Zaffalone — OpenClassrooms Projet 6
// =============================================================================

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string; // optionnel : "cal", "km", "jours", "sessions"
}

export default function StatCard({ label, value, unit }: StatCardProps) {
  return (
    <div className="stat-card">
      <p className="stat-card-label">{label}</p>
      <p className="stat-card-value">
        {value}
        {unit && <span>{unit}</span>}
      </p>
    </div>
  );
}
