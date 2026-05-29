// =============================================================================
// SPORTSEE — Context API global
// Utilise le hook useUserInfo via le service API
// Auteur : Farid Zaffalone — OpenClassrooms Projet 6
// =============================================================================

import { createContext, type ReactNode } from "react";
import { useUserInfo, type UseUserInfoResult } from "../hooks/useUserInfo";

// ---------------------------------------------------------------------------
// TYPE — Shape du contexte
// ---------------------------------------------------------------------------

export interface AppContextType {
  userInfo: UseUserInfoResult["userInfo"];
  isLoading: boolean;
  error: string | null;
  refreshUserInfo: () => void;
}

// ---------------------------------------------------------------------------
// CRÉATION DU CONTEXTE
// ---------------------------------------------------------------------------

export const AppContext = createContext<AppContextType | null>(null);

// ---------------------------------------------------------------------------
// PROVIDER — Enveloppe l'application et fournit les données
// ---------------------------------------------------------------------------

export function AppProvider({ children }: { children: ReactNode }) {
  const { userInfo, isLoading, error, refresh } = useUserInfo();

  return (
    <AppContext.Provider
      value={{
        userInfo,
        isLoading,
        error,
        refreshUserInfo: refresh,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
