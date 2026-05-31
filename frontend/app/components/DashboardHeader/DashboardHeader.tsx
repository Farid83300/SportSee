// =============================================================================
// SPORTSEE — Composant DashboardHeader
// Bandeau de profil en haut du dashboard
// Auteur : Farid Zaffalone — OpenClassrooms Projet 6
// =============================================================================

interface DashboardHeaderProps {
  firstName: string;
  lastName: string;
  createdAt: string;
  profilePicture: string;
  totalDistance: string;
}

function formatDateLong(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric", month: "long", year: "numeric",
  });
}

export default function DashboardHeader({
  firstName,
  lastName,
  createdAt,
  profilePicture,
  totalDistance,
}: DashboardHeaderProps) {
  return (
    <div className="profile-header">

      {/* Identité */}
      <div className="profile-header-left">
        <img
          src={profilePicture}
          alt={`${firstName} ${lastName}`}
          className="profile-avatar"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/images/default-avatar.png";
          }}
        />
        <div>
          <p className="profile-name">
            {firstName} {lastName}
          </p>
          <p className="profile-since">
            Membre depuis le {formatDateLong(createdAt)}
          </p>
        </div>
      </div>

      {/* Distance totale */}
      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
        <p className="profile-stat-label">Distance totale parcourue</p>
        <div className="profile-stat-value">
          <img src="/icons/running.svg" alt="" style={{ width: "28px", height: "28px" }} />
          {totalDistance} km
        </div>
      </div>

    </div>
  );
}
