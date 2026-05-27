// =============================================================================
// SPORTSEE — Gestion du token JWT via cookie
// =============================================================================

const TOKEN_KEY = "sportsee_token";
const USER_ID_KEY = "sportsee_userId";

// Durée de vie du cookie : 1 jour
const COOKIE_EXPIRY_DAYS = 1;

// ---------------------------------------------------------------------------
// Helpers internes
// ---------------------------------------------------------------------------

function setCookie(name: string, value: string, days: number): void {
  if (typeof document === "undefined") return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [key, value] = cookie.trim().split("=");
    if (key === name) return value ?? null;
  }
  return null;
}

function deleteCookie(name: string): void {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}

// ---------------------------------------------------------------------------
// API publique
// ---------------------------------------------------------------------------

/** Sauvegarde le token et le userId après login */
export function saveAuth(token: string, userId: string): void {
  setCookie(TOKEN_KEY, token, COOKIE_EXPIRY_DAYS);
  setCookie(USER_ID_KEY, String(userId), COOKIE_EXPIRY_DAYS);
}

/** Récupère le token JWT, ou null si absent */
export function getToken(): string | null {
  return getCookie(TOKEN_KEY);
}

/** Récupère le userId stocké, ou null si absent */
export function getUserId(): string | null {
  return getCookie(USER_ID_KEY);
}

/** Vérifie si l'utilisateur est connecté */
export function isAuthenticated(): boolean {
  return getToken() !== null;
}

/** Supprime le token et le userId (logout) */
export function clearAuth(): void {
  deleteCookie(TOKEN_KEY);
  deleteCookie(USER_ID_KEY);
}
