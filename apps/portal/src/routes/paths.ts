// Constantes de rutas centralizadas - Una sola fuente de verdad
// Si una URL cambia, se cambia acá y todo funciona
import { TabType } from "@/types";

export const PATHS = {
    auth: {
        login: "/auth/login",
        signup: "/auth/signup",
    },
    onboarding: {
        plan: "/onboarding/plan",
        medicalForm: "/onboarding/medical-form",
        pending: "/onboarding/pending",
    },
    app: {
        root: "/app",
        dashboard: "/app/dashboard",
        history: "/app/history",
        stats: "/app/stats",
        treatment: "/app/treatment",
        profile: "/app/profile",
        patient: (id: string) => `/app/patients/${id}`,
    },
} as const;

// Helper: Convierte TabType a ruta real
// Usado por NavTabs para saber dónde navegar
export const getTabPath = (tab: TabType): string => {
    const pathMap: Record<TabType, string> = {
        dashboard: PATHS.app.dashboard,
        history: PATHS.app.history,
        stats: PATHS.app.stats,
        treatment: PATHS.app.treatment,
        profile: PATHS.app.profile,
    };
    return pathMap[tab];
};
