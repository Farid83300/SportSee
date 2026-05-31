// =============================================================================
// SPORTSEE — Composant ProfileInfoCard
// Affiche les informations personnelles : âge, genre, taille, poids
// Auteur : Farid Zaffalone — OpenClassrooms Projet 6
// =============================================================================

interface ProfileInfoCardProps {
  age: number;
  gender: string;
  height: number; // cm
  weight: number; // kg
}

function formatHeight(cm: number): string {
  const m = Math.floor(cm / 100);
  const remainder = cm % 100;
  return `${m}m${remainder.toString().padStart(2, "0")}`;
}

function formatGender(gender: string): string {
  if (gender === "female") return "Femme";
  if (gender === "male") return "Homme";
  return gender;
}

export default function ProfileInfoCard({
  age,
  gender,
  height,
  weight,
}: ProfileInfoCardProps) {
  return (
    <div className="profile-info-card">
      <p className="profile-info-title">Votre profil</p>
      <ul className="profile-info-list">
        <li>Âge : <strong>{age}</strong></li>
        <li>Genre : <strong>{formatGender(gender)}</strong></li>
        <li>Taille : <strong>{formatHeight(height)}</strong></li>
        <li>Poids : <strong>{weight}kg</strong></li>
      </ul>
    </div>
  );
}
