// =============================================================================
// SPORTSEE — Page Dashboard
// Avec navigation par offset sur les graphiques Km et BPM
// Auteur : Farid Zaffalone — OpenClassrooms Projet 6
// =============================================================================

import { useState, useEffect } from "react";
import { useAppContext } from "../context/useAppContext";
import {
  computeWeeklyStats,
  groupByWeek,
  getWeekRange,
  getLast4WeeksRange,
  type UserActivity,
} from "../data/mockData";
import {
  fetchWeekActivity,
  fetchLast4WeeksActivity,
  getWeekRangeWithOffset,
  getLast4WeeksRangeWithOffset,
} from "../services/apiService";
import KmChart from "../components/charts/KmChart";
import BpmChart from "../components/charts/BpmChart";
import WeeklyPieChart from "../components/charts/WeeklyPieChart";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR");
}

function formatDateLong(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric", month: "long", year: "numeric",
  });
}

export default function DashboardPage() {
  const { userInfo, isLoading: infoLoading, error: infoError } = useAppContext();

  // ---------------------------------------------------------------------------
  // États de navigation
  // 0 = période courante, -1 = période précédente, -2 = encore avant, etc.
  // ---------------------------------------------------------------------------
  const [kmOffset, setKmOffset] = useState(0);
  const [bpmOffset, setBpmOffset] = useState(0);

  // ---------------------------------------------------------------------------
  // Données d'activité avec navigation
  // ---------------------------------------------------------------------------
  const [weekActivity, setWeekActivity] = useState<UserActivity>([]);
  const [last4Activity, setLast4Activity] = useState<UserActivity>([]);
  const [activityLoading, setActivityLoading] = useState(true);
  const [activityError, setActivityError] = useState<string | null>(null);

  // Semaine courante (pie chart + stats) — toujours offset 0
  const [currentWeekActivity, setCurrentWeekActivity] = useState<UserActivity>([]);

  useEffect(() => {
    async function loadCurrentWeek() {
      try {
        const data = await fetchWeekActivity(0);
        setCurrentWeekActivity(data);
      } catch { /* silencieux */ }
    }
    loadCurrentWeek();
  }, []);

  // Chargement BPM selon offset
  useEffect(() => {
    async function loadBpm() {
      setActivityLoading(true);
      setActivityError(null);
      try {
        const data = await fetchWeekActivity(bpmOffset);
        setWeekActivity(data);
      } catch (err) {
        setActivityError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        setActivityLoading(false);
      }
    }
    loadBpm();
  }, [bpmOffset]);

  // Chargement Km selon offset
  useEffect(() => {
    async function loadKm() {
      try {
        const data = await fetchLast4WeeksActivity(kmOffset);
        setLast4Activity(data);
      } catch (err) {
        setActivityError(err instanceof Error ? err.message : "Erreur inconnue");
      }
    }
    loadKm();
  }, [kmOffset]);

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
  const weeklyStats = computeWeeklyStats(currentWeekActivity);
  const kmByWeek = groupByWeek(last4Activity);

  // Labels avec offset
  const { label: kmLabel } = getLast4WeeksRangeWithOffset(kmOffset);
  const { label: bpmLabel } = getWeekRangeWithOffset(bpmOffset);

  // Label semaine courante (pie chart)
  const { startWeek, endWeek } = getWeekRange();
  const weekLabel = `Du ${formatDate(startWeek)} au ${formatDate(endWeek)}`;

  // BPM moyen
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

        {/* ── Graphique Km ── */}
        <div className="card">
          <div className="chart-header">
            <div>
              <p className="chart-value primary">{avgKm}km en moyenne</p>
              <p className="card-subtitle">Total des kilomètres 4 dernières semaines</p>
            </div>
            {/* Navigation Km */}
            <div className="chart-nav">
              <button onClick={() => setKmOffset((o) => o - 1)} aria-label="Période précédente">
                ‹
              </button>
              <span>{kmLabel}</span>
              <button
                onClick={() => setKmOffset((o) => Math.min(o + 1, 0))}
                disabled={kmOffset === 0}
                aria-label="Période suivante"
              >
                ›
              </button>
            </div>
          </div>
          <KmChart data={kmByWeek} />
          <div className="chart-legend">
            <span>
              <span className="chart-legend-dot" style={{ backgroundColor: "var(--color-bar-km)" }} />
              Km
            </span>
          </div>
        </div>

        {/* ── Graphique BPM ── */}
        <div className="card">
          <div className="chart-header">
            <div>
              <p className="chart-value accent">{avgBpm} BPM</p>
              <p className="card-subtitle">Fréquence cardiaque moyenne</p>
            </div>
            {/* Navigation BPM */}
            <div className="chart-nav">
              <button onClick={() => setBpmOffset((o) => o - 1)} aria-label="Semaine précédente">
                ‹
              </button>
              <span>{bpmLabel}</span>
              <button
                onClick={() => setBpmOffset((o) => Math.min(o + 1, 0))}
                disabled={bpmOffset === 0}
                aria-label="Semaine suivante"
              >
                ›
              </button>
            </div>
          </div>
          <BpmChart data={weekActivity} />
          <div className="chart-legend">
            <span>
              <span className="chart-legend-dot" style={{ backgroundColor: "var(--color-bar-bpm-min)" }} />
              Min
            </span>
            <span>
              <span className="chart-legend-dot" style={{ backgroundColor: "var(--color-bar-bpm-max)" }} />
              Max BPM
            </span>
            <span>
              <span className="chart-legend-dot" style={{ backgroundColor: "var(--color-primary)" }} />
              Moy BPM
            </span>
          </div>
        </div>

      </div>

      {/* ── Section Cette semaine ── */}
      <p className="week-section-title">Cette semaine</p>
      <p className="week-section-dates">{weekLabel}</p>

      <div className="week-grid">

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
