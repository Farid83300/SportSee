// =============================================================================
// SPORTSEE — Page Dashboard
// Route protégée — nécessite une authentification
// Auteur : Farid Zaffalone — OpenClassrooms Projet 6
// =============================================================================

import { useState, useEffect } from "react";
import { useAppContext } from "../context/useAppContext";
import { getToken, getUserId } from "../auth/authCookie";
import {
  USE_MOCK,
  getMockUser,
  getWeekRange,
  getLast4WeeksRange,
  computeWeeklyStats,
  groupByWeek,
  type UserActivity,
} from "../data/mockData";
import KmChart from "../components/charts/KmChart";
import BpmChart from "../components/charts/BpmChart";
import WeeklyPieChart from "../components/charts/WeeklyPieChart";

const API_URL = "http://localhost:8000";

// ---------------------------------------------------------------------------
// Helper — formate une date en "DD/MM/YYYY"
// ---------------------------------------------------------------------------
function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("fr-FR");
}

// ---------------------------------------------------------------------------
// Helper — formate une date en "DD mois YYYY" (ex: "14 juin 2023")
// ---------------------------------------------------------------------------
function formatDateLong(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

export default function DashboardPage() {
  const { userInfo, isLoading: infoLoading, error: infoError } = useAppContext();

  // Activité semaine courante
  const [weekActivity, setWeekActivity] = useState<UserActivity>([]);
  // Activité 4 dernières semaines
  const [last4Activity, setLast4Activity] = useState<UserActivity>([]);
  const [activityLoading, setActivityLoading] = useState(true);
  const [activityError, setActivityError] = useState<string | null>(null);

  // ---------------------------------------------------------------------------
  // Chargement des données d'activité
  // ---------------------------------------------------------------------------
  useEffect(() => {
    async function fetchActivity() {
      setActivityLoading(true);
      setActivityError(null);

      try {
        if (USE_MOCK) {
          await new Promise((r) => setTimeout(r, 300));
          // ← Récupère les données du bon utilisateur selon le cookie
          const userId = getUserId() ?? "user123";
          const mockUser = getMockUser(userId);
          setWeekActivity(mockUser.weekActivity);
          setLast4Activity(mockUser.last4WeeksActivity);
          return;
        }

        const token = getToken();
        const headers = { Authorization: `Bearer ${token}` };

        // Semaine courante
        const { startWeek, endWeek } = getWeekRange();
        const weekRes = await fetch(
          `${API_URL}/api/user-activity?startWeek=${startWeek}&endWeek=${endWeek}`,
          { headers }
        );
        if (!weekRes.ok) throw new Error("Erreur activité semaine");
        const weekData = await weekRes.json();
        setWeekActivity(weekData);

        // 4 dernières semaines
        const { startWeek: start4, endWeek: end4 } = getLast4WeeksRange();
        const last4Res = await fetch(
          `${API_URL}/api/user-activity?startWeek=${start4}&endWeek=${end4}`,
          { headers }
        );
        if (!last4Res.ok) throw new Error("Erreur activité 4 semaines");
        const last4Data = await last4Res.json();
        setLast4Activity(last4Data);

      } catch (err) {
        setActivityError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        setActivityLoading(false);
      }
    }

    fetchActivity();
  }, []);

  // ---------------------------------------------------------------------------
  // États de chargement et d'erreur
  // ---------------------------------------------------------------------------
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

  // ---------------------------------------------------------------------------
  // Données calculées
  // ---------------------------------------------------------------------------
  const weeklyStats = computeWeeklyStats(weekActivity);
  const kmByWeek = groupByWeek(last4Activity);

  // Plage de dates — 4 dernières semaines
  const { startWeek: start4, endWeek: end4 } = getLast4WeeksRange();
  const last4Label = `${formatDate(start4)} - ${formatDate(end4)}`;

  // Plage de dates — semaine courante
  const { startWeek, endWeek } = getWeekRange();
  const weekLabel = `Du ${formatDate(startWeek)} au ${formatDate(endWeek)}`;

  // BPM moyen de la semaine
  const avgBpm = weekActivity.length > 0
    ? Math.round(weekActivity.reduce((sum, s) => sum + s.heartRate.average, 0) / weekActivity.length)
    : 0;

  // Distance moyenne sur 4 semaines
  const avgKm = kmByWeek.length > 0
    ? Math.round(kmByWeek.reduce((sum, w) => sum + w.distance, 0) / kmByWeek.length)
    : 0;

  return (
    <div>

      {/* ── Header profil ── */}
      <div className="profile-header">
        <div className="profile-header-left">
          <img
            src={userInfo.profile.profilePicture}
            alt={userInfo.profile.firstName}
            className="profile-avatar"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/images/default-avatar.png";
            }}
          />
          <div>
            <p className="profile-name">
              {userInfo.profile.firstName} {userInfo.profile.lastName}
            </p>
            <p className="profile-since">
              Membre depuis le {formatDateLong(userInfo.profile.createdAt)}
            </p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <p className="profile-stat-label">Distance totale parcourue</p>
          <div className="profile-stat-value">
            <img src="/icons/running.svg" alt="" style={{ width: "28px", height: "28px" }} />
            {userInfo.statistics.totalDistance} km
          </div>
        </div>
      </div>

      {/* ── Section graphiques ── */}
      <h2 style={{ marginBottom: "1.25rem" }}>Vos dernières performances</h2>

      <div className="charts-grid">

        {/* Graphique Km — 4 dernières semaines */}
        <div className="card">
          <div className="chart-header">
            <div>
              <p className="chart-value primary">{avgKm}km en moyenne</p>
              <p className="card-subtitle">Total des kilomètres 4 dernières semaines</p>
            </div>
            <div className="chart-nav">
              <span>{last4Label}</span>
            </div>
          </div>
          <KmChart data={kmByWeek} />
          <div className="chart-legend">
            <span>
              <span
                className="chart-legend-dot"
                style={{ backgroundColor: "var(--color-bar-km)" }}
              />
              Km
            </span>
          </div>
        </div>

        {/* Graphique BPM — semaine courante */}
        <div className="card">
          <div className="chart-header">
            <div>
              <p className="chart-value accent">{avgBpm} BPM</p>
              <p className="card-subtitle">Fréquence cardiaque moyenne</p>
            </div>
            <div className="chart-nav">
              <span>{last4Label}</span>
            </div>
          </div>
          <BpmChart data={weekActivity} />
          <div className="chart-legend">
            <span>
              <span
                className="chart-legend-dot"
                style={{ backgroundColor: "var(--color-bar-bpm-min)" }}
              />
              Min
            </span>
            <span>
              <span
                className="chart-legend-dot"
                style={{ backgroundColor: "var(--color-bar-bpm-max)" }}
              />
              Max BPM
            </span>
            <span>
              <span
                className="chart-legend-dot"
                style={{ backgroundColor: "var(--color-primary)" }}
              />
              Moy BPM
            </span>
          </div>
        </div>

      </div>

      {/* ── Section Cette semaine ── */}
      <p className="week-section-title">Cette semaine</p>
      <p className="week-section-dates">{weekLabel}</p>

      <div className="week-grid">

        {/* Pie chart + score */}
        <div className="card week-left">
          <p className="week-score">
            x{weeklyStats.sessionsThisWeek}{" "}
            <span>sur objectif de {userInfo.weeklyGoal}</span>
          </p>
          <p className="week-score-label">Courses hebdomadaires réalisées</p>
          <WeeklyPieChart
            done={weeklyStats.sessionsThisWeek}
            total={userInfo.weeklyGoal}
          />
        </div>

        {/* Stats durée + distance */}
        <div className="week-right">
          <div className="week-stat-card">
            <p className="week-stat-label">Durée d'activité</p>
            <p className="week-stat-value">
              {weeklyStats.totalDurationWeek}
              <span>minutes</span>
            </p>
          </div>
          <div className="week-stat-card">
            <p className="week-stat-label">Distance</p>
            <p className="week-stat-value accent">
              {weeklyStats.totalDistanceWeek}
              <span>kilomètres</span>
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
