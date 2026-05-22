// =============================================================================
// SPORTSEE — Données mockées
// Structure exacte de l'API P6JS (vérifiée via Postman)
// Auteur : Farid Zaffalone — OpenClassrooms Projet 6
// =============================================================================

// ---------------------------------------------------------------------------
// TYPES — Miroir exact des réponses de l'API
// ---------------------------------------------------------------------------

// POST /api/login
export interface AuthResponse {
  token: string;
  userId: string; // "user123" — string, pas un number
}

// GET /api/user-info
export interface UserProfile {
  firstName: string;
  lastName: string;
  createdAt: string;      // ISO date "YYYY-MM-DD"
  age: number;
  weight: number;         // kg
  height: number;         // cm
  profilePicture: string; // URL complète
}

export interface UserStatistics {
  totalDistance: string; // ⚠️ string dans l'API, ex: "2250.2"
  totalSessions: number;
  totalDuration: number; // en minutes
}

export interface UserInfo {
  profile: UserProfile;
  weeklyGoal: number;    // retourné par l'API ✅
  weeklyScore: number;   // retourné par l'API ✅ (0-100)
  statistics: UserStatistics;
}

// GET /api/user-activity
export interface HeartRate {
  min: number;
  max: number;
  average: number;
}

export interface ActivitySession {
  date: string;          // ISO date "YYYY-MM-DD"
  distance: number;      // km
  duration: number;      // minutes
  heartRate: HeartRate;
  caloriesBurned: number;
}

export type UserActivity = ActivitySession[];

// ---------------------------------------------------------------------------
// TYPES — Données calculées côté frontend (non retournées par l'API)
// ---------------------------------------------------------------------------

export interface UserProfileExtended {
  gender: string;              // ⚠️ absent de l'API → mocké
}

export interface ComputedStats {
  totalCaloriesBurned: number; // calculé depuis toutes les sessions
  restDays: number;            // calculé : jours écoulés - totalSessions
  totalDurationFormatted: string; // ex: "27h 15min"
}

export interface WeeklyComputed {
  sessionsThisWeek: number;
  totalDurationWeek: number;   // minutes
  totalDistanceWeek: number;   // km
}

// ---------------------------------------------------------------------------
// HELPERS — Calculs côté frontend
// ---------------------------------------------------------------------------

/** Plage de la semaine courante (lundi → dimanche) */
export function getWeekRange(): { startWeek: string; endWeek: string } {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  const toISO = (d: Date) => d.toISOString().split("T")[0];
  return { startWeek: toISO(monday), endWeek: toISO(sunday) };
}

/** Plage des 4 dernières semaines complètes */
export function getLast4WeeksRange(): { startWeek: string; endWeek: string } {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  const thisMonday = new Date(now);
  thisMonday.setDate(now.getDate() + diffToMonday);
  thisMonday.setHours(0, 0, 0, 0);

  const fourWeeksAgo = new Date(thisMonday);
  fourWeeksAgo.setDate(thisMonday.getDate() - 28);

  const toISO = (d: Date) => d.toISOString().split("T")[0];
  return { startWeek: toISO(fourWeeksAgo), endWeek: toISO(now) };
}

/** Convertit des minutes en "Xh Ymin" */
export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const min = minutes % 60;
  return min > 0 ? `${h}h ${min}min` : `${h}h`;
}

/** Calcule les stats globales depuis toutes les sessions */
export function computeAllTimeStats(
  activity: UserActivity,
  firstSessionDate: string
): ComputedStats {
  const totalCaloriesBurned = activity.reduce(
    (sum, s) => sum + s.caloriesBurned,
    0
  );

  // Jours de repos = jours écoulés depuis la 1ère session - nb de sessions
  const start = new Date(firstSessionDate);
  const now = new Date();
  const totalDays = Math.floor(
    (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );
  const restDays = Math.max(0, totalDays - activity.length);

  const totalMinutes = activity.reduce((sum, s) => sum + s.duration, 0);

  return {
    totalCaloriesBurned,
    restDays,
    totalDurationFormatted: formatDuration(totalMinutes),
  };
}

/** Calcule les stats de la semaine depuis les sessions filtrées */
export function computeWeeklyStats(activity: UserActivity): WeeklyComputed {
  return {
    sessionsThisWeek: activity.length,
    totalDurationWeek: activity.reduce((sum, s) => sum + s.duration, 0),
    totalDistanceWeek: parseFloat(
      activity.reduce((sum, s) => sum + s.distance, 0).toFixed(1)
    ),
  };
}

/** Agrège les sessions par semaine pour le graphique Km (S1/S2/S3/S4) */
export function groupByWeek(
  activity: UserActivity
): { week: string; distance: number }[] {
  const weeks: Record<string, number> = {};

  activity.forEach((session) => {
    const date = new Date(session.date);
    const dayOfWeek = date.getDay();
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(date);
    monday.setDate(date.getDate() + diffToMonday);
    const weekKey = monday.toISOString().split("T")[0];
    weeks[weekKey] = parseFloat(
      ((weeks[weekKey] || 0) + session.distance).toFixed(1)
    );
  });

  return Object.entries(weeks)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, distance], i) => ({ week: `S${i + 1}`, distance }));
}

// ---------------------------------------------------------------------------
// MOCK — Authentification
// ---------------------------------------------------------------------------

export const mockAuthResponse: AuthResponse = {
  token: "mock-jwt-token-dev-only",
  userId: "user123",
};

// ---------------------------------------------------------------------------
// MOCK — GET /api/user-info
// ✅ weeklyGoal et weeklyScore sont bien retournés par l'API
// ---------------------------------------------------------------------------

export const mockUserInfo: UserInfo = {
  profile: {
    firstName: "Sophie",
    lastName: "Martin",
    createdAt: "2025-01-01",
    age: 32,
    weight: 60,
    height: 165,
    profilePicture: "http://localhost:8000/images/sophie.jpg",
  },
  weeklyGoal: 2,
  weeklyScore: 0,   // 0 car aucune session cette semaine (données passées)
  statistics: {
    totalDistance: "2250.2",
    totalSessions: 348,
    totalDuration: 14625,
  },
};

// ---------------------------------------------------------------------------
// MOCK — Données étendues du profil (absent de l'API → mocké)
// ⚠️ gender n'est pas retourné par /api/user-info
// ---------------------------------------------------------------------------

export const mockUserProfileExtended: UserProfileExtended = {
  gender: "female",
};

// ---------------------------------------------------------------------------
// MOCK — GET /api/user-activity (semaine courante)
// ---------------------------------------------------------------------------

export const mockUserActivity: UserActivity = [
  {
    date: "2025-05-01",
    distance: 5,
    duration: 32,
    heartRate: { min: 143, max: 179, average: 166 },
    caloriesBurned: 358,
  },
  {
    date: "2025-05-04",
    distance: 8.3,
    duration: 54,
    heartRate: { min: 139, max: 179, average: 162 },
    caloriesBurned: 578,
  },
];

// ---------------------------------------------------------------------------
// MOCK — GET /api/user-activity (4 dernières semaines pour graphique Km)
// ---------------------------------------------------------------------------

export const mockLast4WeeksActivity: UserActivity = [
  { date: "2025-04-28", distance: 6.7, duration: 43, heartRate: { min: 141, max: 178, average: 163 }, caloriesBurned: 472 },
  { date: "2025-05-01", distance: 5,   duration: 32, heartRate: { min: 143, max: 179, average: 166 }, caloriesBurned: 358 },
  { date: "2025-05-04", distance: 8.3, duration: 54, heartRate: { min: 139, max: 179, average: 162 }, caloriesBurned: 578 },
  { date: "2025-05-11", distance: 10.2,duration: 68, heartRate: { min: 137, max: 180, average: 160 }, caloriesBurned: 705 },
  { date: "2025-05-18", distance: 7,   duration: 45, heartRate: { min: 140, max: 178, average: 163 }, caloriesBurned: 490 },
  { date: "2025-05-24", distance: 5.2, duration: 34, heartRate: { min: 142, max: 178, average: 165 }, caloriesBurned: 370 },
];

// ---------------------------------------------------------------------------
// HELPER — Switch mock / API réelle
// Mettre USE_MOCK à false pour utiliser la vraie API backend
// ---------------------------------------------------------------------------

export const USE_MOCK = true;

export const MOCK_DATA = {
  auth: mockAuthResponse,
  userInfo: mockUserInfo,
  userProfileExtended: mockUserProfileExtended,
  userActivity: mockUserActivity,
  last4WeeksActivity: mockLast4WeeksActivity,
} as const;
