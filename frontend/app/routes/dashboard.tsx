// =============================================================================
// SPORTSEE — Page Dashboard
// Avec navigation par offset sur les graphiques Km et BPM
// Offsets persistés dans l'URL via query params (React Router v7)
// Auteur : Farid Zaffalone — OpenClassrooms Projet 6
// =============================================================================

import { useEffect } from "react";
import { useSearchParams } from "react-router";
import { useAppContext } from "../context/useAppContext";
import {
  computeWeeklyStats,
  groupByWeek,
  getWeekRange,
  type UserActivity,
} from "../data/mockData";
import {
  fetchWeekActivity,
  fetchLast4WeeksActivity,
  getWeekRangeWithOffset,
  getLast4WeeksRangeWithOffset,
} from "../services/apiService";
import { useState } from "react";
import DashboardHeader from "../components/DashboardHeader/DashboardHeader";
import KmChart from "../components/charts/KmChart";
import BpmChart from "../components/charts/BpmChart";
import WeeklyPieChart from "../components/charts/WeeklyPieChart";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR");
}

export default function DashboardPage() {
  const { userInfo, isLoading: infoLoading, error: infoError } = useAppContext();

  // ---------------------------------------------------------------------------
  // Query params — persistance des offsets dans l'URL
  // Ex: /?kmOffset=-2&bpmOffset=-1
  // ---------------------------------------------------------------------------
  const [searchParams, setSearchParams] = useSearchParams();

  const kmOffset  = parseInt(searchParams.get("kmOffset")  ?? "0");
  const bpmOffset = parseInt(searchParams.get("bpmOffset") ?? "0");

  function setKmOffset(updater: (prev: number) => number) {
    const next = updater(kmOffset);
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      p.set("kmOffset", String(next));
      return p;
    });
  }

  function setBpmOffset(updater: (prev: number) => number) {
    const next = updater(bpmOffset);
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      p.set("bpmOffset", String(next));
      return p;
    });
  }

  // ---------------------------------------------------------------------------
  // State local — données d'activité
  // ---------------------------------------------------------------------------
  const [weekActivity,        setWeekActivity]        = useState<UserActivity>([]);
  const [last4Activity,       setLast4Activity]       = useState<UserActivity>([]);
  const [currentWeekActivity, setCurrentWeekActivity] = useState<UserActivity>([]);
  const [initialLoading,      setInitialLoading]      = useState(true);
  const [activityError,       setActivityError]       = useState<string | null>(null);

  // Semaine courante — offset 0, chargement initial uniquement
  useEffect(() => {
    async function loadCurrentWeek() {
      try {
        const data = await fetchWeekActivity(0);
        setCurrentWeekActivity(data);
      } catch { /* silencieux */ }
    }
    loadCurrentWeek();
  }, []);

  // BPM — se recharge à chaque changement d'offset (y compris depuis l'URL)
  useEffect(() => {
    async function loadBpm() {
      if (bpmOffset === 0 && weekActivity.length === 0) {
        setInitialLoading(true);
      }
      setActivityError(null);
      try {
        const data = await fetchWeekActivity(bpmOffset);
        setWeekActivity(data);
      } catch (err) {
        setActivityError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        setInitialLoading(false);
      }
    }
    loadBpm();
  }, [bpmOffset]);

  // Km — se recharge à chaque changement d'offset (y compris depuis l'URL)
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

  if (infoLoading || initialLoading) {
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

  const weeklyStats = computeWeeklyStats(currentWeekActivity);
  const kmByWeek    = groupByWeek(last4Activity);

  const { label: kmLabel  } = getLast4WeeksRangeWithOffset(kmOffset);
  const { label: bpmLabel } = getWeekRangeWithOffset(bpmOffset);

  const { startWeek, endWeek } = getWeekRange();
  const weekLabel = `Du ${formatDate(startWeek)} au ${formatDate(endWeek)}`;

  const avgBpm = weekActivity.length > 0
    ? Math.round(weekActivity.reduce((sum, s) => sum + s.heartRate.average, 0) / weekActivity.length)
    : 0;

  const avgKm = kmByWeek.length > 0
    ? Math.round(kmByWeek.reduce((sum, w) => sum + w.distance, 0) / kmByWeek.length)
    : 0;

  return (
    <div>

      <DashboardHeader
        firstName={userInfo.profile.firstName}
        lastName={userInfo.profile.lastName}
        createdAt={userInfo.profile.createdAt}
        profilePicture={userInfo.profile.profilePicture}
        totalDistance={userInfo.statistics.totalDistance}
      />

      <h2 style={{ marginBottom: "1.25rem" }}>Vos dernières performances</h2>

      <div className="charts-grid">

        {/* ── Graphique Km ── */}
        <div className="card">
          <div className="chart-header">
            <div>
              <p className="chart-value primary">{avgKm}km en moyenne</p>
              <p className="card-subtitle">Total des kilomètres 4 dernières semaines</p>
            </div>
            <div className="chart-nav">
              <button onClick={() => setKmOffset((o) => o - 1)} aria-label="Période précédente">‹</button>
              <span>{kmLabel}</span>
              <button
                onClick={() => setKmOffset((o) => Math.min(o + 1, 0))}
                disabled={kmOffset === 0}
                aria-label="Période suivante"
              >›</button>
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
            <div className="chart-nav">
              <button onClick={() => setBpmOffset((o) => o - 1)} aria-label="Semaine précédente">‹</button>
              <span>{bpmLabel}</span>
              <button
                onClick={() => setBpmOffset((o) => Math.min(o + 1, 0))}
                disabled={bpmOffset === 0}
                aria-label="Semaine suivante"
              >›</button>
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
