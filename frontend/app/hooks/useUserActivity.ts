// =============================================================================
// SPORTSEE — Hook useUserActivity
// Récupère l'activité utilisateur via le service API
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

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      setError(null);

      try {
        // Genre étendu — toujours chargé
        setGender(fetchProfileExtendedGender());

        if (mode === "dashboard") {
          // Dashboard — semaine courante + 4 dernières semaines
          const [week, last4] = await Promise.all([
            fetchWeekActivity(),
            fetchLast4WeeksActivity(),
          ]);
          setWeekActivity(week);
          setLast4WeeksActivity(last4);
        } else {
          // Profil — toute l'activité annuelle
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
