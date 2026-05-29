// =============================================================================
// SPORTSEE — Hook useUserInfo
// Récupère les infos utilisateur via le service API
// Auteur : Farid Zaffalone — OpenClassrooms Projet 6
// =============================================================================

import { useState, useEffect } from "react";
import { fetchUserInfo } from "../services/apiService";
import type { UserInfo } from "../data/mockData";

export interface UseUserInfoResult {
  userInfo: UserInfo | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useUserInfo(): UseUserInfoResult {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchUserInfo();
      setUserInfo(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return { userInfo, isLoading, error, refresh: load };
}
