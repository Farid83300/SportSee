// =============================================================================
// SPORTSEE — Page Dashboard (route protégée)
// Placeholder — sera développé dans les étapes suivantes
// =============================================================================

import { useNavigate } from "react-router";
import { clearAuth } from "../auth/authCookie";
import { useAppContext } from "../context/useAppContext"; // ← ajouter

export default function DashboardPage() {
  const navigate = useNavigate();
  const { userInfo, isLoading, error } = useAppContext(); // ← ajouter

  function handleLogout() {
    clearAuth();
    navigate("/login", { replace: true });
  }

  if (isLoading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error}</p>;

  return (
    <main>
      <h1>Bonjour {userInfo?.profile.firstName} !</h1>
      <p>Objectif semaine : {userInfo?.weeklyGoal} séances</p>
      <p>Score semaine : {userInfo?.weeklyScore}%</p>
      <button onClick={handleLogout}>Se déconnecter</button>
    </main>
  );
}
