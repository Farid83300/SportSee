// =============================================================================
// SPORTSEE — Hook personnalisé pour consommer le contexte
// Auteur : Farid Zaffalone — OpenClassrooms Projet 6
// =============================================================================

import { useContext } from "react";
import { AppContext, type AppContextType } from "./AppContext";

/**
 * Hook à utiliser dans tous les composants qui ont besoin des données globales.
 * Lance une erreur si utilisé en dehors du AppProvider.
 *
 * Exemple d'utilisation :
 * const { userInfo, isLoading, error } = useAppContext();
 */
export function useAppContext(): AppContextType {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error(
      "useAppContext doit être utilisé à l'intérieur d'un <AppProvider>"
    );
  }

  return context;
}
