// =============================================================================
// SPORTSEE — Page Login (route publique)
// =============================================================================

import { useState } from "react";
import { useNavigate } from "react-router";
import { saveAuth, isAuthenticated } from "../auth/authCookie";

const API_URL = "http://localhost:8000";

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Si déjà connecté, redirige directement
  if (isAuthenticated()) {
    navigate("/dashboard", { replace: true });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Identifiants incorrects");
      }

      const data = await response.json();

      // Sauvegarde token + userId dans les cookies
      saveAuth(data.token, data.userId);

      // Redirige vers le dashboard
      navigate("/dashboard", { replace: true });

    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "320px" }}>
        <h1>SportSee — Connexion</h1>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <input
          type="text"
          placeholder="Nom d'utilisateur"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Connexion..." : "Se connecter"}
        </button>

        {/* Comptes de démo */}
        <details>
          <summary style={{ cursor: "pointer", fontSize: "0.85rem" }}>Comptes de démo</summary>
          <ul style={{ fontSize: "0.8rem", marginTop: "0.5rem" }}>
            <li>sophiemartin / password123</li>
            <li>emmaleroy / password789</li>
            <li>marcdubois / password456</li>
          </ul>
        </details>
      </form>
    </main>
  );
}
