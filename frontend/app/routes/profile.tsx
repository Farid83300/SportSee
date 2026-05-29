// =============================================================================
// SPORTSEE — Page Profil
// Route protégée — nécessite une authentification
// Auteur : Farid Zaffalone — OpenClassrooms Projet 6
// =============================================================================

import { useState, useEffect } from "react";
import { useAppContext } from "../context/useAppContext";
import { getToken, getUserId } from "../auth/authCookie";
import {
  USE_MOCK,
  getMockUser,
  computeAllTimeStats,
  formatDuration,
  type UserActivity,
} from "../data/mockData";

const API_URL = "http://localhost:8000";

function formatDateLong(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
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

export default function ProfilePage() {
  const { userInfo, isLoading: infoLoading, error: infoError } = useAppContext();

  const [allActivity, setAllActivity] = useState<UserActivity>([]);
  const [profileExtendedGender, setProfileExtendedGender] = useState<string>("female");
  const [activityLoading, setActivityLoading] = useState(true);
  const [activityError, setActivityError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAllActivity() {
      setActivityLoading(true);
      setActivityError(null);

      try {
        if (USE_MOCK) {
          await new Promise((r) => setTimeout(r, 300));
          // ← Récupère les données du bon utilisateur selon le cookie
          const userId = getUserId() ?? "user123";
          const mockUser = getMockUser(userId);
          setAllActivity(mockUser.allActivity);
          setProfileExtendedGender(mockUser.profileExtended.gender);
          return;
        }

        const token = getToken();
        const response = await fetch(
          `${API_URL}/api/user-activity?startWeek=2025-01-01&endWeek=2025-12-31`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!response.ok) throw new Error("Erreur lors du chargement des activités");
        const data = await response.json();
        setAllActivity(data);

      } catch (err) {
        setActivityError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        setActivityLoading(false);
      }
    }

    fetchAllActivity();
  }, []);

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

  const computedStats = computeAllTimeStats(allActivity, userInfo.profile.createdAt);
  const totalDurationFormatted = formatDuration(
    allActivity.reduce((sum, s) => sum + s.duration, 0)
  );

  return (
    <div className="profile-page">

      {/* ── Colonne gauche — infos personnelles ── */}
      <div className="profile-left">

        <div className="profile-card">
          <img
            src={userInfo.profile.profilePicture}
            alt={userInfo.profile.firstName}
            className="profile-card-avatar"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/images/default-avatar.png";
            }}
          />
          <p className="profile-card-name">
            {userInfo.profile.firstName} {userInfo.profile.lastName}
          </p>
          <p className="profile-card-since">
            Membre depuis le {formatDateLong(userInfo.profile.createdAt)}
          </p>
        </div>

        <div className="profile-info-card">
          <p className="profile-info-title">Votre profil</p>
          <ul className="profile-info-list">
            <li>Âge : <strong>{userInfo.profile.age}</strong></li>
            <li>Genre : <strong>{formatGender(profileExtendedGender)}</strong></li>
            <li>Taille : <strong>{formatHeight(userInfo.profile.height)}</strong></li>
            <li>Poids : <strong>{userInfo.profile.weight}kg</strong></li>
          </ul>
        </div>

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

          <div className="stat-card">
            <p className="stat-card-label">Temps total couru</p>
            <p className="stat-card-value">{totalDurationFormatted}</p>
          </div>

          <div className="stat-card">
            <p className="stat-card-label">Calories brûlées</p>
            <p className="stat-card-value">
              {computedStats.totalCaloriesBurned.toLocaleString("fr-FR")}
              <span>cal</span>
            </p>
          </div>

          <div className="stat-card">
            <p className="stat-card-label">Distance totale parcourue</p>
            <p className="stat-card-value">
              {userInfo.statistics.totalDistance}
              <span>km</span>
            </p>
          </div>

          <div className="stat-card">
            <p className="stat-card-label">Nombre de jours de repos</p>
            <p className="stat-card-value">
              {computedStats.restDays}
              <span>jours</span>
            </p>
          </div>

          <div className="stat-card">
            <p className="stat-card-label">Nombre de sessions</p>
            <p className="stat-card-value">
              {userInfo.statistics.totalSessions}
              <span>sessions</span>
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
