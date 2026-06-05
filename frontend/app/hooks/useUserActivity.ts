// =============================================================================
// SPORTSEE — Hook useUserActivity
// Adapte les données chargées selon la page : "dashboard" ou "profile"
// Auteur : Farid Zaffalone — OpenClassrooms Projet 6
// =============================================================================

import { useState, useEffect } from "react";
import {
  fetchWeekActivity,
  fetchLast4WeeksActivity,
  fetchAllActivity,
} from "../services/apiService";
import type { UserActivity } from "../data/mockData";

export type ActivityMode = "dashboard" | "profile";

export interface UseUserActivityResult {
  weekActivity: UserActivity;
  last4WeeksActivity: UserActivity;
  allActivity: UserActivity;
  isLoading: boolean;
  error: string | null;
}

export function useUserActivity(
  mode: ActivityMode,
  createdAt?: string
): UseUserActivityResult {
  const [weekActivity, setWeekActivity] = useState<UserActivity>([]);
  const [last4WeeksActivity, setLast4WeeksActivity] = useState<UserActivity>([]);
  const [allActivity, setAllActivity] = useState<UserActivity>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // [mode, createdAt] en dépendances → se relance si l'un des deux change
  useEffect(() => {
    async function load() {
      setIsLoading(true);
      setError(null);

      try {
        if (mode === "dashboard") {
          // Promise.all lance les deux requêtes en parallèle
          const [week, last4] = await Promise.all([
            fetchWeekActivity(),
            fetchLast4WeeksActivity(),
          ]);
          setWeekActivity(week);
          setLast4WeeksActivity(last4);
        } else {
          // Passe createdAt au service — dates dynamiques, plus de dates en dur
          const all = await fetchAllActivity(createdAt);
          setAllActivity(all);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, [mode, createdAt]);

  return { weekActivity, last4WeeksActivity, allActivity, isLoading, error };
}
