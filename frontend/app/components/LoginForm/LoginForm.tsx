// =============================================================================
// SPORTSEE — Composant LoginForm
// Formulaire de connexion isolé et réutilisable
// Auteur : Farid Zaffalone — OpenClassrooms Projet 6
// =============================================================================

import { useState } from "react";
import { useNavigate } from "react-router";
import { saveAuth } from "../../auth/authCookie";
import { USE_MOCK, mockAuthResponse } from "../../data/mockData";

const API_URL = "http://localhost:8000";

// ---------------------------------------------------------------------------
// Helper — extrait le username depuis un email
// La maquette affiche "Adresse email" mais l'API attend un "username"
// ---------------------------------------------------------------------------
function emailToUsername(email: string): string {
  return email.includes("@") ? email.split("@")[0] : email;
}

export default function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (USE_MOCK) {
        // Mode mock — simule une connexion réussie
        await new Promise((resolve) => setTimeout(resolve, 500));
        saveAuth(mockAuthResponse.token, mockAuthResponse.userId);
        navigate("/", { replace: true });
        return;
      }

      // Mode API réelle
      const username = emailToUsername(email);

      const response = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Identifiants incorrects");
      }

      const data = await response.json();
      saveAuth(data.token, data.userId);
      navigate("/", { replace: true });

    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-card">
      <h1>
        Transformez<br />
        vos stats en résultats
      </h1>

      <form className="login-form" onSubmit={handleSubmit}>
        <h2 style={{ fontSize: "1.125rem", fontWeight: 600, color: "var(--color-text)" }}>
          Se connecter
        </h2>

        {/* Message d'erreur */}
        {error && <p className="form-error">{error}</p>}

        {/* Email */}
        <div className="form-group">
          <label className="form-label" htmlFor="email">
            Adresse email
          </label>
          <input
            id="email"
            type="text"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        {/* Mot de passe */}
        <div className="form-group">
          <label className="form-label" htmlFor="password">
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>

        {/* Bouton de soumission */}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>

        {/* Lien mot de passe oublié */}
        <span className="form-link">Mot de passe oublié ?</span>
      </form>

      {/* Comptes de démo — visible uniquement en mode mock */}
      {USE_MOCK && (
        <details style={{ marginTop: "1.5rem" }}>
          <summary style={{ cursor: "pointer", fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
            Comptes de démo
          </summary>
          <ul style={{ fontSize: "0.8rem", marginTop: "0.5rem", color: "var(--color-text-muted)", listStyle: "none", lineHeight: 2 }}>
            <li>sophiemartin@sportsee.fr / password123</li>
            <li>emmaleroy@sportsee.fr / password789</li>
            <li>marcdubois@sportsee.fr / password456</li>
          </ul>
        </details>
      )}
    </div>
  );
}
