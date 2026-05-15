// =============================================================================
// SPORTSEE — Données mockées
// Miroir exact de la structure retournée par l'API P6JS
// Endpoint: GET /api/user-info  |  GET /api/user-activity
// Auteur : Farid Zaffalone — OpenClassrooms Projet 6
// =============================================================================

// ---------------------------------------------------------------------------
// TYPES — Interface des données de l'API
// ---------------------------------------------------------------------------

export interface UserKeyData {
    calorieCount: number;   // kcal
    proteinCount: number;   // g
    carbohydrateCount: number; // g
    lipidCount: number;     // g
}

export interface UserGoal {
    type: "cardio" | "energy" | "strength" | "speed" | "endurance";
    currentValue: number;
    targetValue: number;
}

export interface UserInfo {
    userId: number;
    userInfos: {
        firstName: string;
        lastName: string;
        age: number;
    };
    score: number;         // entre 0 et 1 (ex: 0.12 = 12%)
    keyData: UserKeyData;
    goals: UserGoal[];
}

export interface ActivitySession {
    day: string;           // ISO date "YYYY-MM-DD"
    kilogram: number;      // poids en kg
    calories: number;      // calories brûlées
    distance: number;      // distance en km
    duration: number;      // durée en minutes
}

export interface UserActivity {
    userId: number;
    sessions: ActivitySession[];
}

// ---------------------------------------------------------------------------
// MOCK — Utilisateur 1 : Sophie Martin
// ---------------------------------------------------------------------------

export const mockUserInfo: UserInfo = {
    userId: 1,
    userInfos: {
        firstName: "Sophie",
        lastName: "Martin",
        age: 28,
    },
    // Score de complétion de l'objectif journalier (0 à 1)
    score: 0.72,
    keyData: {
        calorieCount: 1930,
        proteinCount: 155,
        carbohydrateCount: 290,
        lipidCount: 50,
    },
    goals: [
        { type: "cardio", currentValue: 45, targetValue: 60 },
        { type: "energy", currentValue: 72, targetValue: 100 },
        { type: "strength", currentValue: 38, targetValue: 80 },
        { type: "speed", currentValue: 60, targetValue: 70 },
        { type: "endurance", currentValue: 55, targetValue: 90 },
    ],
};

// ---------------------------------------------------------------------------
// MOCK — Activité sur une semaine (7 jours)
// Endpoint: GET /api/user-activity?startWeek=2024-01-08&endWeek=2024-01-14
// ---------------------------------------------------------------------------

export const mockUserActivity: UserActivity = {
    userId: 1,
    sessions: [
        { day: "2024-01-08", kilogram: 62.0, calories: 240, distance: 4.2, duration: 30 },
        { day: "2024-01-09", kilogram: 62.3, calories: 380, distance: 6.8, duration: 48 },
        { day: "2024-01-10", kilogram: 61.8, calories: 175, distance: 3.1, duration: 22 },
        { day: "2024-01-11", kilogram: 62.5, calories: 490, distance: 8.5, duration: 62 },
        { day: "2024-01-12", kilogram: 62.1, calories: 290, distance: 5.0, duration: 37 },
        { day: "2024-01-13", kilogram: 61.9, calories: 520, distance: 9.2, duration: 68 },
        { day: "2024-01-14", kilogram: 62.2, calories: 150, distance: 2.8, duration: 18 },
    ],
};

// ---------------------------------------------------------------------------
// MOCK — Token JWT simulé (pour le développement sans backend)
// En production, ce token est obtenu via POST /login
// ---------------------------------------------------------------------------

export const mockAuthToken = {
    token: "mock-jwt-token-dev-only",
    userId: 1,
};

// ---------------------------------------------------------------------------
// HELPER — Accès rapide aux données du mock
// Utilisé dans le service API pour basculer mock ↔ API réelle
// ---------------------------------------------------------------------------

export const MOCK_DATA = {
    userInfo: mockUserInfo,
    userActivity: mockUserActivity,
    auth: mockAuthToken,
} as const;
