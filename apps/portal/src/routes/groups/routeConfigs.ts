// Configuraciones de rutas para cada grupo
// Se importan en routes/index.tsx
// Separadas para que los archivos de componentes solo exporten componentes

import type { RouteObject } from "react-router";
import { Navigate } from "react-router";
import { createElement } from "react";
import { PATHS } from "../paths";
import LoginPage from "@/pages/auth/LoginPage";
import SignupPage from "@/pages/auth/SignupPage";
import PlanSelectionPage from "@/pages/onboarding/PlanSelectionPage";
import MedicalFormPage from "@/pages/onboarding/MedicalFormPage";
import PendingVerificationPage from "@/pages/onboarding/PendingVerificationPage";
import DashboardPage from "@/pages/app/DashboardPage";
import HistoryPage from "@/pages/app/HistoryPage";
import StatsPage from "@/pages/app/StatsPage";
import TreatmentPage from "@/pages/app/TreatmentPage";
import ProfilePage from "@/pages/app/ProfilePage";

// Auth routes config
export const authRoutesConfig: RouteObject[] = [
    { path: PATHS.auth.login, element: createElement(LoginPage) },
    { path: PATHS.auth.signup, element: createElement(SignupPage) },
];

// Onboarding routes config
export const onboardingRoutesConfig: RouteObject[] = [
    { path: PATHS.onboarding.plan, element: createElement(PlanSelectionPage) },
    { path: PATHS.onboarding.medicalForm, element: createElement(MedicalFormPage) },
    { path: PATHS.onboarding.pending, element: createElement(PendingVerificationPage) },
];

// App routes config
export const appRoutesConfig: RouteObject[] = [
    {
        index: true,
        element: createElement(Navigate, { to: PATHS.app.dashboard, replace: true }),
    },
    { path: "dashboard", element: createElement(DashboardPage) },
    { path: "history", element: createElement(HistoryPage) },
    { path: "stats", element: createElement(StatsPage) },
    { path: "treatment", element: createElement(TreatmentPage) },
    { path: "profile", element: createElement(ProfilePage) },
];
