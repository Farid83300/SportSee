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
  fetchProfileExtendedGender,
} from "../services/apiService";
import type { UserActivity } from "../data/mockData";

export type ActivityMode = "dashboard" | "profile";

export interface UseUserActivityResult {
  weekActivity: UserActivity;
  last4WeeksActivity: UserActivity;
  allActivity: UserActivity;
  gender: string;
  isLoading: boolean;
  error: string | null;
}

export function useUserActivity(mode: ActivityMode): UseUserActivityResult {
  const [weekActivity, setWeekActivity] = useState<UserActivity>([]);
  const [last4WeeksActivity, setLast4WeeksActivity] = useState<UserActivity>([]);
  const [allActivity, setAllActivity] = useState<UserActivity>([]);
  const [gender, setGender] = useState<string>("female");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // [mode] en dépendance → se relance si on change de page
  useEffect(() => {
    async function load() {
      setIsLoading(true);
      setError(null);

      try {
        // Genre absent de l'API → toujours mocké, pas de requête réseau
        setGender(fetchProfileExtendedGender());

        if (mode === "dashboard") {
          // Promise.all lance les deux requêtes en parallèle
          const [week, last4] = await Promise.all([
            fetchWeekActivity(),
            fetchLast4WeeksActivity(),
          ]);
          setWeekActivity(week);
          setLast4WeeksActivity(last4);
        } else {
          const all = await fetchAllActivity();
          setAllActivity(all);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, [mode]);

  return { weekActivity, last4WeeksActivity, allActivity, gender, isLoading, error };
}
