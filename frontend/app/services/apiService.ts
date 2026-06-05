// =============================================================================
// SPORTSEE — Service API centralisé
// Tous les appels réseau passent par ici
// Switch USE_MOCK transparent pour les composants
// Cache en mémoire — idempotence : un seul appel API par clé de données
// Auteur : Farid Zaffalone — OpenClassrooms Projet 6
// =============================================================================

import {
  USE_MOCK,
  getMockUser,
  type UserInfo,
  type UserActivity,
} from "../data/mockData";
import { getToken, getUserId } from "../auth/authCookie";

// ⚠️ À déplacer dans un fichier .env
const API_URL = "http://localhost:8000";

// ---------------------------------------------------------------------------
// Cache en mémoire — idempotence
// Clé = identifiant unique de la requête (ex: "userInfo", "week:0", "4weeks:-1")
// Valeur = données déjà chargées
// Vidé à la déconnexion via clearCache()
// ---------------------------------------------------------------------------
const cache = new Map<string, unknown>();

export function clearCache(): void {
  cache.clear();
}

// ---------------------------------------------------------------------------
// Helper interne — headers d'authentification
// ---------------------------------------------------------------------------
function authHeaders(): { Authorization: string } {
  const token = getToken();
  if (!token) throw new Error("Token manquant — veuillez vous reconnecter");
  return { Authorization: `Bearer ${token}` };
}

// ---------------------------------------------------------------------------
// Helper — calcule une plage de dates avec offset en semaines
// offset = 0 → semaine courante, -1 → semaine précédente, etc.
// ---------------------------------------------------------------------------
export function getWeekRangeWithOffset(offset: number = 0): {
  startWeek: string;
  endWeek: string;
  label: string;
} {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday + offset * 7);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  const toISO = (d: Date) => d.toISOString().split("T")[0];
  const toLabel = (d: Date) =>
    d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });

  return {
    startWeek: toISO(monday),
    endWeek: toISO(sunday),
    label: `${toLabel(monday)} - ${toLabel(sunday)}`,
  };
}

// ---------------------------------------------------------------------------
// Helper — calcule une plage de 4 semaines avec offset
// offset = 0 → 4 dernières semaines, -1 → 4 semaines d'avant, etc.
// ---------------------------------------------------------------------------
export function getLast4WeeksRangeWithOffset(offset: number = 0): {
  startWeek: string;
  endWeek: string;
  label: string;
} {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  const thisMonday = new Date(now);
  thisMonday.setDate(now.getDate() + diffToMonday + offset * 28);
  thisMonday.setHours(0, 0, 0, 0);

  const endDate = new Date(thisMonday);
  endDate.setDate(thisMonday.getDate() + 27);
  endDate.setHours(23, 59, 59, 999);

  const startDate = new Date(thisMonday);

  const toISO = (d: Date) => d.toISOString().split("T")[0];
  const toLabel = (d: Date) =>
    d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });

  return {
    startWeek: toISO(startDate),
    endWeek: toISO(endDate),
    label: `${toLabel(startDate)} - ${toLabel(endDate)}`,
  };
}

// ---------------------------------------------------------------------------
// GET /api/user-info
// Idempotent — un seul appel par session
// ---------------------------------------------------------------------------
export async function fetchUserInfo(): Promise<UserInfo> {
  const cacheKey = "userInfo";

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey) as UserInfo;
  }

  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300));
    const userId = getUserId() ?? "user123";
    const data = getMockUser(userId).userInfo;
    cache.set(cacheKey, data);
    return data;
  }

  const response = await fetch(`${API_URL}/api/user-info`, {
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Erreur ${response.status} — impossible de récupérer les infos utilisateur`);
  }

  const data = await response.json();
  cache.set(cacheKey, data);
  return data;
}

// ---------------------------------------------------------------------------
// GET /api/user-activity — semaine avec offset
// Idempotent — une clé par offset
// ---------------------------------------------------------------------------
export async function fetchWeekActivity(offset: number = 0): Promise<UserActivity> {
  const cacheKey = `week:${offset}`;

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey) as UserActivity;
  }

  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 200));
    const userId = getUserId() ?? "user123";
    const data = getMockUser(userId).weekActivity;
    cache.set(cacheKey, data);
    return data;
  }

  const { startWeek, endWeek } = getWeekRangeWithOffset(offset);
  const response = await fetch(
    `${API_URL}/api/user-activity?startWeek=${startWeek}&endWeek=${endWeek}`,
    { headers: authHeaders() }
  );

  if (!response.ok) {
    throw new Error(`Erreur ${response.status} — impossible de récupérer l'activité de la semaine`);
  }

  const data = await response.json();
  cache.set(cacheKey, data);
  return data;
}

// ---------------------------------------------------------------------------
// GET /api/user-activity — 4 semaines avec offset
// Idempotent — une clé par offset
// ---------------------------------------------------------------------------
export async function fetchLast4WeeksActivity(offset: number = 0): Promise<UserActivity> {
  const cacheKey = `4weeks:${offset}`;

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey) as UserActivity;
  }

  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 200));
    const userId = getUserId() ?? "user123";
    const data = getMockUser(userId).last4WeeksActivity;
    cache.set(cacheKey, data);
    return data;
  }

  const { startWeek, endWeek } = getLast4WeeksRangeWithOffset(offset);
  const response = await fetch(
    `${API_URL}/api/user-activity?startWeek=${startWeek}&endWeek=${endWeek}`,
    { headers: authHeaders() }
  );

  if (!response.ok) {
    throw new Error(`Erreur ${response.status} — impossible de récupérer l'activité des 4 semaines`);
  }

  const data = await response.json();
  cache.set(cacheKey, data);
  return data;
}

// ---------------------------------------------------------------------------
// GET /api/user-activity — depuis la création du compte jusqu'à aujourd'hui
// startWeek = createdAt de l'utilisateur, endWeek = date du jour
// Idempotent — une seule clé
// ---------------------------------------------------------------------------
export async function fetchAllActivity(createdAt: string = "2025-01-01"): Promise<UserActivity> {
  const cacheKey = "allActivity";

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey) as UserActivity;
  }

  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 200));
    const userId = getUserId() ?? "user123";
    const data = getMockUser(userId).allActivity;
    cache.set(cacheKey, data);
    return data;
  }

  // Date de fin = aujourd'hui dynamiquement
  const endWeek = new Date().toISOString().split("T")[0];

  const response = await fetch(
    `${API_URL}/api/user-activity?startWeek=${createdAt}&endWeek=${endWeek}`,
    { headers: authHeaders() }
  );

  if (!response.ok) {
    throw new Error(`Erreur ${response.status} — impossible de récupérer toute l'activité`);
  }

  const data = await response.json();
  cache.set(cacheKey, data);
  return data;
}

// ---------------------------------------------------------------------------
// Helper — détermine le genre depuis l'URL de la photo de profil
// Gender absent de l'API → déduit depuis le nom du fichier image
// ---------------------------------------------------------------------------
export function inferGenderFromPicture(profilePicture: string): string {
  if (/sophie|emma|marie|julie|sarah|laura|alice|camille/i.test(profilePicture)) {
    return "female";
  }
  return "male"; // fallback par défaut
}
