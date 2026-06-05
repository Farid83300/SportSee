// =============================================================================
// SPORTSEE — Page Profil
// Utilise useAppContext + useUserActivity + composants ProfileCard, ProfileInfoCard, StatCard
// Auteur : Farid Zaffalone — OpenClassrooms Projet 6
// =============================================================================

import { useAppContext } from "../context/useAppContext";
import { useUserActivity } from "../hooks/useUserActivity";
import { inferGenderFromPicture } from "../services/apiService";
import { computeAllTimeStats, formatDuration } from "../data/mockData";
import ProfileCard from "../components/ProfileCard/ProfileCard";
import ProfileInfoCard from "../components/ProfileInfoCard/ProfileInfoCard";
import StatCard from "../components/StatCard/StatCard";

function formatDateLong(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric", month: "long", year: "numeric",
  });
}

export default function ProfilePage() {
  const { userInfo, isLoading: infoLoading, error: infoError } = useAppContext();

  const {
    allActivity,
    isLoading: activityLoading,
    error: activityError,
  } = useUserActivity("profile", userInfo?.profile.createdAt);

  if (infoLoading || activityLoading) {
    return <div className="loading">Chargement...</div>;
  }

  if (infoError || activityError) {
    return (
      <div className="error-message">
        Erreur : {infoError || activityError}
      </div>
    );
  }

  if (!userInfo) return null;

  // Genre déduit depuis l'URL de la photo de profil
  const gender = inferGenderFromPicture(userInfo.profile.profilePicture);

  const computedStats = computeAllTimeStats(allActivity, userInfo.profile.createdAt);
  const totalDurationFormatted = formatDuration(
    allActivity.reduce((sum, s) => sum + s.duration, 0)
  );

  return (
    <div className="profile-page">

      {/* ── Colonne gauche — infos personnelles ── */}
      <div className="profile-left">

        <ProfileCard
          firstName={userInfo.profile.firstName}
          lastName={userInfo.profile.lastName}
          createdAt={userInfo.profile.createdAt}
          profilePicture={userInfo.profile.profilePicture}
        />

        <ProfileInfoCard
          age={userInfo.profile.age}
          gender={gender}
          height={userInfo.profile.height}
          weight={userInfo.profile.weight}
        />

      </div>

      {/* ── Colonne droite — statistiques globales ── */}
      <div>
        <p style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--color-text)", marginBottom: "0.25rem" }}>
          Vos statistiques
        </p>
        <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", marginBottom: "1.5rem" }}>
          depuis le {formatDateLong(userInfo.profile.createdAt)}
        </p>

        <div className="stats-grid">
          <StatCard label="Temps total couru" value={totalDurationFormatted} />
          <StatCard
            label="Calories brûlées"
            value={computedStats.totalCaloriesBurned.toLocaleString("fr-FR")}
            unit="cal"
          />
          <StatCard
            label="Distance totale parcourue"
            value={userInfo.statistics.totalDistance}
            unit="km"
          />
          <StatCard
            label="Nombre de jours de repos"
            value={computedStats.restDays}
            unit="jours"
          />
          <StatCard
            label="Nombre de sessions"
            value={userInfo.statistics.totalSessions}
            unit="sessions"
          />
        </div>
      </div>

    </div>
  );
}
