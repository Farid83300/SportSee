// =============================================================================
// SPORTSEE — Service API centralisé
// Tous les appels réseau passent par ici
// Switch USE_MOCK transparent pour les composants
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
// ---------------------------------------------------------------------------
export async function fetchUserInfo(): Promise<UserInfo> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300));
    const userId = getUserId() ?? "user123";
    return getMockUser(userId).userInfo;
  }

  const response = await fetch(`${API_URL}/api/user-info`, {
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Erreur ${response.status} — impossible de récupérer les infos utilisateur`);
  }

  return response.json();
}

// ---------------------------------------------------------------------------
// GET /api/user-activity — semaine avec offset
// ---------------------------------------------------------------------------
export async function fetchWeekActivity(offset: number = 0): Promise<UserActivity> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 200));
    const userId = getUserId() ?? "user123";
    // En mock, on retourne toujours la même semaine (offset ignoré)
    return getMockUser(userId).weekActivity;
  }

  const { startWeek, endWeek } = getWeekRangeWithOffset(offset);
  const response = await fetch(
    `${API_URL}/api/user-activity?startWeek=${startWeek}&endWeek=${endWeek}`,
    { headers: authHeaders() }
  );

  if (!response.ok) {
    throw new Error(`Erreur ${response.status} — impossible de récupérer l'activité de la semaine`);
  }

  return response.json();
}

// ---------------------------------------------------------------------------
// GET /api/user-activity — 4 semaines avec offset
// ---------------------------------------------------------------------------
export async function fetchLast4WeeksActivity(offset: number = 0): Promise<UserActivity> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 200));
    const userId = getUserId() ?? "user123";
    return getMockUser(userId).last4WeeksActivity;
  }

  const { startWeek, endWeek } = getLast4WeeksRangeWithOffset(offset);
  const response = await fetch(
    `${API_URL}/api/user-activity?startWeek=${startWeek}&endWeek=${endWeek}`,
    { headers: authHeaders() }
  );

  if (!response.ok) {
    throw new Error(`Erreur ${response.status} — impossible de récupérer l'activité des 4 semaines`);
  }

  return response.json();
}

// ---------------------------------------------------------------------------
// GET /api/user-activity — toute l'année (page profil)
// ---------------------------------------------------------------------------
export async function fetchAllActivity(): Promise<UserActivity> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 200));
    const userId = getUserId() ?? "user123";
    return getMockUser(userId).allActivity;
  }

  const response = await fetch(
    `${API_URL}/api/user-activity?startWeek=2025-01-01&endWeek=2025-12-31`,
    { headers: authHeaders() }
  );

  if (!response.ok) {
    throw new Error(`Erreur ${response.status} — impossible de récupérer toute l'activité`);
  }

  return response.json();
}

// ---------------------------------------------------------------------------
// Helper — genre étendu (absent de l'API → mocké)
// ---------------------------------------------------------------------------
export function fetchProfileExtendedGender(): string {
  const userId = getUserId() ?? "user123";
  return getMockUser(userId).profileExtended.gender;
}
