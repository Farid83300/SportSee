// =============================================================================
// SPORTSEE — Données mockées
// Structure exacte de l'API P6JS (vérifiée via Postman)
// 3 utilisateurs : Sophie Martin, Emma Leroy, Marc Dubois
// Auteur : Farid Zaffalone — OpenClassrooms Projet 6
// =============================================================================

// ---------------------------------------------------------------------------
// TYPES — Miroir exact des réponses de l'API
// ---------------------------------------------------------------------------

export interface AuthResponse {
  token: string;
  userId: string;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  createdAt: string;
  age: number;
  weight: number;
  height: number;
  profilePicture: string;
}

export interface UserStatistics {
  totalDistance: string;
  totalSessions: number;
  totalDuration: number;
}

export interface UserInfo {
  profile: UserProfile;
  weeklyGoal: number;
  weeklyScore: number | null;
  statistics: UserStatistics;
}

export interface HeartRate {
  min: number;
  max: number;
  average: number;
}

export interface ActivitySession {
  date: string;
  distance: number;
  duration: number;
  heartRate: HeartRate;
  caloriesBurned: number;
}

export type UserActivity = ActivitySession[];

export interface UserProfileExtended {
  gender: string;
}

export interface ComputedStats {
  totalCaloriesBurned: number;
  restDays: number;
  totalDurationFormatted: string;
}

export interface WeeklyComputed {
  sessionsThisWeek: number;
  totalDurationWeek: number;
  totalDistanceWeek: number;
}

// ---------------------------------------------------------------------------
// HELPERS — Calculs côté frontend
// ---------------------------------------------------------------------------

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

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const min = minutes % 60;
  return min > 0 ? `${h}h ${min}min` : `${h}h`;
}

export function computeAllTimeStats(
  activity: UserActivity,
  firstSessionDate: string
): ComputedStats {
  const totalCaloriesBurned = activity.reduce((sum, s) => sum + s.caloriesBurned, 0);
  const start = new Date(firstSessionDate);
  const now = new Date();
  const totalDays = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const restDays = Math.max(0, totalDays - activity.length);
  const totalMinutes = activity.reduce((sum, s) => sum + s.duration, 0);
  return {
    totalCaloriesBurned,
    restDays,
    totalDurationFormatted: formatDuration(totalMinutes),
  };
}

export function computeWeeklyStats(activity: UserActivity): WeeklyComputed {
  return {
    sessionsThisWeek: activity.length,
    totalDurationWeek: activity.reduce((sum, s) => sum + s.duration, 0),
    totalDistanceWeek: parseFloat(
      activity.reduce((sum, s) => sum + s.distance, 0).toFixed(1)
    ),
  };
}

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
    weeks[weekKey] = parseFloat(((weeks[weekKey] || 0) + session.distance).toFixed(1));
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
// TYPE — Map des utilisateurs mockés
// ---------------------------------------------------------------------------

export type MockUserId = "user123" | "user789" | "user456";

export interface MockUser {
  auth: AuthResponse;
  userInfo: UserInfo;
  profileExtended: UserProfileExtended;
  weekActivity: UserActivity;
  last4WeeksActivity: UserActivity;
  allActivity: UserActivity;
}

// ===========================================================================
// UTILISATEUR 1 — Sophie Martin (user123)
// ===========================================================================

const sophieAuth: AuthResponse = { token: "mock-token-sophie", userId: "user123" };

const sophieUserInfo: UserInfo = {
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
  weeklyScore: 0,
  statistics: {
    totalDistance: "2250.2",
    totalSessions: 348,
    totalDuration: 14625,
  },
};

const sophieProfileExtended: UserProfileExtended = { gender: "female" };

const sophieWeekActivity: UserActivity = [
  { date: "2025-05-01", distance: 5, duration: 32, heartRate: { min: 143, max: 179, average: 166 }, caloriesBurned: 358 },
  { date: "2025-05-04", distance: 8.3, duration: 54, heartRate: { min: 139, max: 179, average: 162 }, caloriesBurned: 578 },
];

const sophieLast4WeeksActivity: UserActivity = [
  { date: "2025-04-28", distance: 6.7, duration: 43, heartRate: { min: 141, max: 178, average: 163 }, caloriesBurned: 472 },
  { date: "2025-05-01", distance: 5, duration: 32, heartRate: { min: 143, max: 179, average: 166 }, caloriesBurned: 358 },
  { date: "2025-05-04", distance: 8.3, duration: 54, heartRate: { min: 139, max: 179, average: 162 }, caloriesBurned: 578 },
  { date: "2025-05-11", distance: 10.2, duration: 68, heartRate: { min: 137, max: 180, average: 160 }, caloriesBurned: 705 },
  { date: "2025-05-18", distance: 7, duration: 45, heartRate: { min: 140, max: 178, average: 163 }, caloriesBurned: 490 },
  { date: "2025-05-24", distance: 5.2, duration: 34, heartRate: { min: 142, max: 178, average: 165 }, caloriesBurned: 370 },
];

const sophieAllActivity: UserActivity = [
  { date: "2025-01-04", distance: 5.8, duration: 38, heartRate: { min: 140, max: 178, average: 163 }, caloriesBurned: 422 },
  { date: "2025-01-05", distance: 3.2, duration: 20, heartRate: { min: 148, max: 184, average: 171 }, caloriesBurned: 248 },
  { date: "2025-01-09", distance: 6.4, duration: 42, heartRate: { min: 140, max: 176, average: 163 }, caloriesBurned: 468 },
  { date: "2025-01-12", distance: 7.5, duration: 50, heartRate: { min: 138, max: 178, average: 162 }, caloriesBurned: 532 },
  { date: "2025-01-19", distance: 5.1, duration: 34, heartRate: { min: 141, max: 177, average: 165 }, caloriesBurned: 378 },
  { date: "2025-01-25", distance: 4.8, duration: 32, heartRate: { min: 143, max: 179, average: 166 }, caloriesBurned: 352 },
  { date: "2025-01-26", distance: 3.5, duration: 22, heartRate: { min: 146, max: 183, average: 170 }, caloriesBurned: 265 },
  { date: "2025-02-02", distance: 6.2, duration: 40, heartRate: { min: 142, max: 177, average: 164 }, caloriesBurned: 455 },
  { date: "2025-02-05", distance: 8, duration: 52, heartRate: { min: 140, max: 178, average: 162 }, caloriesBurned: 565 },
  { date: "2025-02-08", distance: 4.5, duration: 30, heartRate: { min: 144, max: 180, average: 167 }, caloriesBurned: 335 },
  { date: "2025-02-15", distance: 9.2, duration: 62, heartRate: { min: 138, max: 179, average: 161 }, caloriesBurned: 645 },
  { date: "2025-02-22", distance: 5.5, duration: 36, heartRate: { min: 142, max: 178, average: 165 }, caloriesBurned: 398 },
  { date: "2025-02-23", distance: 3.8, duration: 25, heartRate: { min: 145, max: 182, average: 168 }, caloriesBurned: 285 },
  { date: "2025-03-01", distance: 7.8, duration: 50, heartRate: { min: 140, max: 178, average: 162 }, caloriesBurned: 545 },
  { date: "2025-03-09", distance: 10.5, duration: 68, heartRate: { min: 136, max: 179, average: 159 }, caloriesBurned: 720 },
  { date: "2025-03-27", distance: 11, duration: 72, heartRate: { min: 135, max: 179, average: 158 }, caloriesBurned: 755 },
  { date: "2025-04-06", distance: 7.2, duration: 46, heartRate: { min: 139, max: 179, average: 163 }, caloriesBurned: 495 },
  { date: "2025-04-27", distance: 6.7, duration: 43, heartRate: { min: 141, max: 178, average: 163 }, caloriesBurned: 472 },
  { date: "2025-05-01", distance: 5, duration: 32, heartRate: { min: 143, max: 179, average: 166 }, caloriesBurned: 358 },
  { date: "2025-05-04", distance: 8.3, duration: 54, heartRate: { min: 139, max: 179, average: 162 }, caloriesBurned: 578 },
  { date: "2025-05-11", distance: 10.2, duration: 68, heartRate: { min: 137, max: 180, average: 160 }, caloriesBurned: 705 },
  { date: "2025-05-18", distance: 7, duration: 45, heartRate: { min: 140, max: 178, average: 163 }, caloriesBurned: 490 },
  { date: "2025-05-24", distance: 5.2, duration: 34, heartRate: { min: 142, max: 178, average: 165 }, caloriesBurned: 370 },
  { date: "2025-05-29", distance: 6.5, duration: 42, heartRate: { min: 141, max: 178, average: 164 }, caloriesBurned: 460 },
];

// ===========================================================================
// UTILISATEUR 2 — Emma Leroy (user789)
// ===========================================================================

const emmaAuth: AuthResponse = { token: "mock-token-emma", userId: "user789" };

const emmaUserInfo: UserInfo = {
  profile: {
    firstName: "Emma",
    lastName: "Leroy",
    createdAt: "2025-01-01",
    age: 28,
    weight: 62,
    height: 170,
    profilePicture: "http://localhost:8000/images/emma.jpg",
  },
  weeklyGoal: 3,
  weeklyScore: null,
  statistics: {
    totalDistance: "3791.4",
    totalSessions: 607,
    totalDuration: 22624,
  },
};

const emmaProfileExtended: UserProfileExtended = { gender: "female" };

// Semaine courante — aucune session cette semaine
const emmaWeekActivity: UserActivity = [];

const emmaLast4WeeksActivity: UserActivity = [
  { date: "2025-05-11", distance: 4.3, duration: 31, heartRate: { min: 124, max: 148, average: 135 }, caloriesBurned: 220 },
  { date: "2025-05-25", distance: 3.4, duration: 24, heartRate: { min: 120, max: 144, average: 131 }, caloriesBurned: 180 },
];

const emmaAllActivity: UserActivity = [
  { date: "2025-01-02", distance: 5.5, duration: 33, heartRate: { min: 140, max: 175, average: 158 }, caloriesBurned: 370 },
  { date: "2025-01-04", distance: 6.2, duration: 37, heartRate: { min: 142, max: 178, average: 160 }, caloriesBurned: 410 },
  { date: "2025-01-06", distance: 4.8, duration: 29, heartRate: { min: 138, max: 172, average: 155 }, caloriesBurned: 320 },
  { date: "2025-01-09", distance: 7, duration: 42, heartRate: { min: 141, max: 177, average: 162 }, caloriesBurned: 470 },
  { date: "2025-01-12", distance: 5.9, duration: 36, heartRate: { min: 140, max: 176, average: 159 }, caloriesBurned: 390 },
  { date: "2025-01-15", distance: 6.5, duration: 39, heartRate: { min: 143, max: 179, average: 161 }, caloriesBurned: 430 },
  { date: "2025-01-18", distance: 5.2, duration: 31, heartRate: { min: 139, max: 174, average: 157 }, caloriesBurned: 350 },
  { date: "2025-01-21", distance: 7.3, duration: 44, heartRate: { min: 142, max: 178, average: 163 }, caloriesBurned: 480 },
  { date: "2025-01-24", distance: 6, duration: 36, heartRate: { min: 140, max: 175, average: 159 }, caloriesBurned: 400 },
  { date: "2025-01-27", distance: 5.7, duration: 34, heartRate: { min: 141, max: 177, average: 160 }, caloriesBurned: 380 },
  { date: "2025-01-30", distance: 6.8, duration: 40, heartRate: { min: 143, max: 179, average: 162 }, caloriesBurned: 440 },
  { date: "2025-02-02", distance: 5.4, duration: 32, heartRate: { min: 139, max: 174, average: 157 }, caloriesBurned: 345 },
  { date: "2025-02-05", distance: 7.1, duration: 43, heartRate: { min: 142, max: 178, average: 163 }, caloriesBurned: 465 },
  { date: "2025-02-08", distance: 6.3, duration: 38, heartRate: { min: 140, max: 176, average: 160 }, caloriesBurned: 415 },
  { date: "2025-02-11", distance: 5.6, duration: 34, heartRate: { min: 141, max: 177, average: 159 }, caloriesBurned: 375 },
  { date: "2025-02-14", distance: 6.9, duration: 41, heartRate: { min: 143, max: 179, average: 162 }, caloriesBurned: 435 },
  { date: "2025-02-17", distance: 5.3, duration: 31, heartRate: { min: 139, max: 174, average: 156 }, caloriesBurned: 340 },
  { date: "2025-02-20", distance: 7.2, duration: 44, heartRate: { min: 142, max: 178, average: 163 }, caloriesBurned: 480 },
  { date: "2025-02-23", distance: 6.1, duration: 36, heartRate: { min: 140, max: 175, average: 159 }, caloriesBurned: 395 },
  { date: "2025-02-26", distance: 5.8, duration: 34, heartRate: { min: 141, max: 177, average: 160 }, caloriesBurned: 380 },
  { date: "2025-03-01", distance: 6.7, duration: 40, heartRate: { min: 143, max: 179, average: 162 }, caloriesBurned: 435 },
  { date: "2025-03-04", distance: 5.5, duration: 32, heartRate: { min: 139, max: 174, average: 157 }, caloriesBurned: 350 },
  { date: "2025-03-07", distance: 7, duration: 42, heartRate: { min: 142, max: 178, average: 163 }, caloriesBurned: 470 },
  { date: "2025-03-10", distance: 6.2, duration: 37, heartRate: { min: 140, max: 176, average: 160 }, caloriesBurned: 410 },
  { date: "2025-03-13", distance: 5.9, duration: 35, heartRate: { min: 141, max: 177, average: 159 }, caloriesBurned: 390 },
  { date: "2025-03-16", distance: 6.8, duration: 41, heartRate: { min: 143, max: 179, average: 162 }, caloriesBurned: 440 },
  { date: "2025-03-19", distance: 5.6, duration: 33, heartRate: { min: 139, max: 174, average: 157 }, caloriesBurned: 355 },
  { date: "2025-03-22", distance: 7.3, duration: 44, heartRate: { min: 142, max: 178, average: 163 }, caloriesBurned: 485 },
  { date: "2025-03-25", distance: 6, duration: 36, heartRate: { min: 140, max: 175, average: 159 }, caloriesBurned: 400 },
  { date: "2025-03-28", distance: 5.7, duration: 34, heartRate: { min: 141, max: 177, average: 160 }, caloriesBurned: 380 },
  { date: "2025-03-31", distance: 6.9, duration: 41, heartRate: { min: 143, max: 179, average: 162 }, caloriesBurned: 435 },
  { date: "2025-04-03", distance: 5.4, duration: 32, heartRate: { min: 139, max: 174, average: 157 }, caloriesBurned: 345 },
  { date: "2025-04-06", distance: 7.1, duration: 43, heartRate: { min: 142, max: 178, average: 163 }, caloriesBurned: 465 },
  { date: "2025-04-09", distance: 6.3, duration: 38, heartRate: { min: 140, max: 176, average: 160 }, caloriesBurned: 415 },
  { date: "2025-04-12", distance: 5.6, duration: 34, heartRate: { min: 141, max: 177, average: 159 }, caloriesBurned: 375 },
  { date: "2025-04-15", distance: 6.8, duration: 40, heartRate: { min: 143, max: 179, average: 162 }, caloriesBurned: 440 },
  { date: "2025-04-18", distance: 5.3, duration: 31, heartRate: { min: 139, max: 174, average: 156 }, caloriesBurned: 340 },
  { date: "2025-04-21", distance: 7.2, duration: 44, heartRate: { min: 142, max: 178, average: 163 }, caloriesBurned: 480 },
  { date: "2025-04-24", distance: 6.1, duration: 36, heartRate: { min: 140, max: 175, average: 159 }, caloriesBurned: 395 },
  { date: "2025-04-27", distance: 5.8, duration: 34, heartRate: { min: 141, max: 177, average: 160 }, caloriesBurned: 380 },
  { date: "2025-04-30", distance: 6.7, duration: 40, heartRate: { min: 143, max: 179, average: 162 }, caloriesBurned: 435 },
  { date: "2025-05-03", distance: 5.5, duration: 32, heartRate: { min: 139, max: 174, average: 157 }, caloriesBurned: 350 },
  { date: "2025-05-06", distance: 7, duration: 42, heartRate: { min: 142, max: 178, average: 163 }, caloriesBurned: 470 },
  { date: "2025-05-09", distance: 6.2, duration: 37, heartRate: { min: 140, max: 176, average: 160 }, caloriesBurned: 410 },
  { date: "2025-05-11", distance: 4.3, duration: 31, heartRate: { min: 124, max: 148, average: 135 }, caloriesBurned: 220 },
  { date: "2025-05-25", distance: 3.4, duration: 24, heartRate: { min: 120, max: 144, average: 131 }, caloriesBurned: 180 },
];

// ===========================================================================
// UTILISATEUR 3 — Marc Dubois (user456)
// ===========================================================================

const marcAuth: AuthResponse = { token: "mock-token-marc", userId: "user456" };

const marcUserInfo: UserInfo = {
  profile: {
    firstName: "Marc",
    lastName: "Dubois",
    createdAt: "2025-01-01",
    age: 45,
    weight: 85,
    height: 180,
    profilePicture: "http://localhost:8000/images/marc.jpg",
  },
  weeklyGoal: 2,
  weeklyScore: null,
  statistics: {
    totalDistance: "501.7",
    totalSessions: 130,
    totalDuration: 3555,
  },
};

const marcProfileExtended: UserProfileExtended = { gender: "male" };

const marcWeekActivity: UserActivity = [
  { date: "2025-05-11", distance: 4.3, duration: 31, heartRate: { min: 124, max: 148, average: 135 }, caloriesBurned: 220 },
  { date: "2025-05-25", distance: 3.4, duration: 24, heartRate: { min: 120, max: 144, average: 131 }, caloriesBurned: 180 },
];

const marcLast4WeeksActivity: UserActivity = [
  { date: "2025-05-11", distance: 4.3, duration: 31, heartRate: { min: 124, max: 148, average: 135 }, caloriesBurned: 220 },
  { date: "2025-05-25", distance: 3.4, duration: 24, heartRate: { min: 120, max: 144, average: 131 }, caloriesBurned: 180 },
];

const marcAllActivity: UserActivity = [
  { date: "2025-01-05", distance: 3, duration: 22, heartRate: { min: 120, max: 145, average: 132 }, caloriesBurned: 180 },
  { date: "2025-01-19", distance: 4.2, duration: 30, heartRate: { min: 122, max: 148, average: 135 }, caloriesBurned: 220 },
  { date: "2025-02-02", distance: 3.5, duration: 25, heartRate: { min: 121, max: 146, average: 133 }, caloriesBurned: 190 },
  { date: "2025-02-16", distance: 4, duration: 28, heartRate: { min: 123, max: 147, average: 134 }, caloriesBurned: 210 },
  { date: "2025-03-02", distance: 3.2, duration: 23, heartRate: { min: 120, max: 144, average: 131 }, caloriesBurned: 175 },
  { date: "2025-03-16", distance: 4.5, duration: 32, heartRate: { min: 124, max: 149, average: 136 }, caloriesBurned: 230 },
  { date: "2025-03-30", distance: 3.8, duration: 27, heartRate: { min: 122, max: 146, average: 133 }, caloriesBurned: 195 },
  { date: "2025-04-13", distance: 4.1, duration: 29, heartRate: { min: 123, max: 147, average: 134 }, caloriesBurned: 210 },
  { date: "2025-04-27", distance: 3.6, duration: 25, heartRate: { min: 121, max: 145, average: 132 }, caloriesBurned: 185 },
  { date: "2025-05-11", distance: 4.3, duration: 31, heartRate: { min: 124, max: 148, average: 135 }, caloriesBurned: 220 },
  { date: "2025-05-25", distance: 3.4, duration: 24, heartRate: { min: 120, max: 144, average: 131 }, caloriesBurned: 180 },
  { date: "2025-06-08", distance: 4, duration: 28, heartRate: { min: 123, max: 147, average: 134 }, caloriesBurned: 210 },
  { date: "2025-06-22", distance: 3.7, duration: 26, heartRate: { min: 122, max: 146, average: 133 }, caloriesBurned: 190 },
  { date: "2025-07-06", distance: 4.2, duration: 30, heartRate: { min: 124, max: 148, average: 135 }, caloriesBurned: 220 },
  { date: "2025-07-20", distance: 3.5, duration: 25, heartRate: { min: 121, max: 145, average: 132 }, caloriesBurned: 185 },
  { date: "2025-08-03", distance: 4.1, duration: 29, heartRate: { min: 123, max: 147, average: 134 }, caloriesBurned: 210 },
  { date: "2025-08-17", distance: 3.8, duration: 27, heartRate: { min: 122, max: 146, average: 133 }, caloriesBurned: 195 },
  { date: "2025-08-31", distance: 4, duration: 28, heartRate: { min: 123, max: 147, average: 134 }, caloriesBurned: 210 },
  { date: "2025-09-14", distance: 3.6, duration: 25, heartRate: { min: 121, max: 145, average: 132 }, caloriesBurned: 185 },
  { date: "2025-09-28", distance: 4.3, duration: 31, heartRate: { min: 124, max: 148, average: 135 }, caloriesBurned: 220 },
  { date: "2025-10-12", distance: 3.4, duration: 24, heartRate: { min: 120, max: 144, average: 131 }, caloriesBurned: 180 },
  { date: "2025-10-26", distance: 4.1, duration: 29, heartRate: { min: 123, max: 147, average: 134 }, caloriesBurned: 210 },
  { date: "2025-11-09", distance: 3.7, duration: 26, heartRate: { min: 122, max: 146, average: 133 }, caloriesBurned: 190 },
  { date: "2025-11-23", distance: 4, duration: 28, heartRate: { min: 123, max: 147, average: 134 }, caloriesBurned: 210 },
  { date: "2025-12-07", distance: 3.5, duration: 25, heartRate: { min: 121, max: 145, average: 132 }, caloriesBurned: 185 },
  { date: "2025-12-21", distance: 4.2, duration: 30, heartRate: { min: 124, max: 148, average: 135 }, caloriesBurned: 220 },
];

// ===========================================================================
// MAP GLOBALE — Accès par userId
// ===========================================================================

export const MOCK_USERS: Record<MockUserId, MockUser> = {
  "user123": {
    auth: sophieAuth,
    userInfo: sophieUserInfo,
    profileExtended: sophieProfileExtended,
    weekActivity: sophieWeekActivity,
    last4WeeksActivity: sophieLast4WeeksActivity,
    allActivity: sophieAllActivity,
  },
  "user789": {
    auth: emmaAuth,
    userInfo: emmaUserInfo,
    profileExtended: emmaProfileExtended,
    weekActivity: emmaWeekActivity,
    last4WeeksActivity: emmaLast4WeeksActivity,
    allActivity: emmaAllActivity,
  },
  "user456": {
    auth: marcAuth,
    userInfo: marcUserInfo,
    profileExtended: marcProfileExtended,
    weekActivity: marcWeekActivity,
    last4WeeksActivity: marcLast4WeeksActivity,
    allActivity: marcAllActivity,
  },
};

// ---------------------------------------------------------------------------
// HELPER — Récupère les données mock de l'utilisateur connecté
// ---------------------------------------------------------------------------

export function getMockUser(userId: string): MockUser {
  const user = MOCK_USERS[userId as MockUserId];
  // Fallback sur Sophie si userId inconnu
  return user ?? MOCK_USERS["user123"];
}



// ---------------------------------------------------------------------------
// SWITCH — mock / API réelle
// ---------------------------------------------------------------------------

export const USE_MOCK = true;

export const MOCK_DATA = {
  users: MOCK_USERS,
  getMockUser,
} as const;
