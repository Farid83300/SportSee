// =============================================================================
// SPORTSEE — Composant ProfileCard
// Affiche la photo, le nom et la date d'inscription
// Auteur : Farid Zaffalone — OpenClassrooms Projet 6
// =============================================================================

interface ProfileCardProps {
  firstName: string;
  lastName: string;
  createdAt: string;
  profilePicture: string;
}

function formatDateLong(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric", month: "long", year: "numeric",
  });
}

export default function ProfileCard({
  firstName,
  lastName,
  createdAt,
  profilePicture,
}: ProfileCardProps) {
  return (
    <div className="profile-card">
      <div className="avatar-wrapper avatar-wrapper--large">
        <img
          src={profilePicture}
          alt={`${firstName} ${lastName}`}
          className="profile-card-avatar"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/images/default-avatar.png";
          }}
        />
      </div>
      <p className="profile-card-name">
        {firstName} {lastName}
      </p>
      <p className="profile-card-since">
        Membre depuis le {formatDateLong(createdAt)}
      </p>
    </div>
  );
}
