// =============================================================================
// SPORTSEE — Service API centralisé
// Tous les appels réseau passent par ici
// Switch USE_MOCK transparent pour les composants
// Auteur : Farid Zaffalone — OpenClassrooms Projet 6
// =============================================================================

import {
  USE_MOCK,
  getMockUser,
  getWeekRange,
  getLast4WeeksRange,
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
// GET /api/user-info
// Retourne le profil, les stats et le weeklyGoal de l'utilisateur connecté
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
// GET /api/user-activity — semaine courante
// ---------------------------------------------------------------------------
export async function fetchWeekActivity(): Promise<UserActivity> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 200));
    const userId = getUserId() ?? "user123";
    return getMockUser(userId).weekActivity;
  }

  const { startWeek, endWeek } = getWeekRange();
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
// GET /api/user-activity — 4 dernières semaines
// ---------------------------------------------------------------------------
export async function fetchLast4WeeksActivity(): Promise<UserActivity> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 200));
    const userId = getUserId() ?? "user123";
    return getMockUser(userId).last4WeeksActivity;
  }

  const { startWeek, endWeek } = getLast4WeeksRange();
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
