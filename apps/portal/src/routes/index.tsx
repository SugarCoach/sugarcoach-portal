/* eslint-disable react-refresh/only-export-components */

// Router principal - Lazy loading por grupo + rutas configuradas
// Estructura:
// - Auth group → lazy, carga solo si va a /auth/*
// - Onboarding group → lazy, carga solo si va a /onboarding/*
// - App group → lazy, pero adentro carga todas las 5 páginas juntas (eager)

import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router";
import { LoadingFallback } from "@/components/LoadingFallback";
import { PATHS } from "./paths";
import { authRoutesConfig, onboardingRoutesConfig, appRoutesConfig } from "./groups/routeConfigs";

// ====== LAZY GROUPS ======
const AuthRoutesGroup = lazy(() => import("./groups/AuthRoutes"));
const OnboardingRoutesGroup = lazy(() => import("./groups/OnboardingRoutes"));
const AppRoutesGroup = lazy(() => import("./groups/AppRoutes"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

// ====== ROUTER ======
export const router = createBrowserRouter([
    // --- AUTH (lazy) ---
    {
        path: "/auth",
        element: (
            <Suspense fallback={<LoadingFallback />}>
                <AuthRoutesGroup />
            </Suspense>
        ),
        children: authRoutesConfig,
    },

    // --- ONBOARDING (lazy) ---
    {
        path: "/onboarding",
        element: (
            <Suspense fallback={<LoadingFallback />}>
                <OnboardingRoutesGroup />
            </Suspense>
        ),
        children: onboardingRoutesConfig,
    },

    // --- APP (lazy pero con páginas eager dentro) ---
    {
        path: PATHS.app.root,
        element: (
            <Suspense fallback={<LoadingFallback />}>
                <AppRoutesGroup />
            </Suspense>
        ),
        children: appRoutesConfig,
    },

    // --- 404 ---
    {
        path: "*",
        element: (
            <Suspense fallback={<LoadingFallback />}>
                <NotFoundPage />
            </Suspense>
        ),
    },
]);
