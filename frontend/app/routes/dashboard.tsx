// =============================================================================
// SPORTSEE — Page Dashboard (route protégée)
// Placeholder — sera développé dans les étapes suivantes
// =============================================================================

import { useNavigate } from "react-router";
import { clearAuth, getUserId } from "../auth/authCookie";

export default function DashboardPage() {
  const navigate = useNavigate();
  const userId = getUserId();

  function handleLogout() {
    clearAuth();
    navigate("/login", { replace: true });
  }

  return (
    <main>
      <h1>Dashboard SportSee</h1>
      <p>Utilisateur ID : {userId}</p>
      <button onClick={handleLogout}>Se déconnecter</button>
    </main>
  );
}
