// =============================================================================
// SPORTSEE — Context API global
// Partage les données essentielles entre tous les composants
// Auteur : Farid Zaffalone — OpenClassrooms Projet 6
// =============================================================================

import { createContext, useState, useEffect, type ReactNode } from "react";
import type { UserInfo } from "../data/mockData";
import { getMockUser, USE_MOCK } from "../data/mockData";
import { getToken, getUserId } from "../auth/authCookie";

// ***********************. a mettre dans un .env
const API_URL = "http://localhost:8000";

// ---------------------------------------------------------------------------
// TYPE — Shape du contexte
// ---------------------------------------------------------------------------

export interface AppContextType {
  userInfo: UserInfo | null;
  isLoading: boolean;
  error: string | null;
  refreshUserInfo: () => void; // permet de forcer un rechargement
}

// ---------------------------------------------------------------------------
// CRÉATION DU CONTEXTE
// ---------------------------------------------------------------------------

export const AppContext = createContext<AppContextType | null>(null);

// ---------------------------------------------------------------------------
// PROVIDER — Enveloppe l'application et fournit les données
// ---------------------------------------------------------------------------

export function AppProvider({ children }: { children: ReactNode }) {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchUserInfo() {
    setIsLoading(true);
    setError(null);

    try {
      if (USE_MOCK) {
        // Mode mock — simule un délai réseau
        await new Promise((resolve) => setTimeout(resolve, 300));
        // ← Récupère les données du bon utilisateur selon le cookie
        const userId = getUserId() ?? "user123";
        const mockUser = getMockUser(userId);
        setUserInfo(mockUser.userInfo);
        return;
      }

      // Mode API réelle
      const token = getToken();
      if (!token) {
        throw new Error("Token manquant");
      }

      const response = await fetch(`${API_URL}/api/user-info`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des données");
      }

      const data: UserInfo = await response.json();
      setUserInfo(data);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setIsLoading(false);
    }
  }

  // Chargement au montage du provider
  useEffect(() => {
    fetchUserInfo();
  }, []);

  return (
    <AppContext.Provider
      value={{
        userInfo,
        isLoading,
        error,
        refreshUserInfo: fetchUserInfo,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
