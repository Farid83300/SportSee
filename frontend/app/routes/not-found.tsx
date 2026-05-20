// =============================================================================
// SPORTSEE — Page 404 Not Found
// =============================================================================

import { Link } from "react-router";

export default function NotFoundPage() {
  return (
    <main style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
      <h1>404</h1>
      <p>Cette page n'existe pas.</p>
      <Link to="/dashboard">Retour au dashboard</Link>
    </main>
  );
}
