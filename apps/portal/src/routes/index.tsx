/* eslint-disable react-refresh/only-export-components */

// Router principal - Lazy loading por grupo + rutas configuradas
// Estructura:
// - Auth group → lazy, carga solo si va a /auth/*
// - Onboarding group → lazy, carga solo si va a /onboarding/*
// - App group → lazy, pero adentro carga todas las 5 páginas juntas (eager)

import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router";
import { LoadingFallback } from "@/components/LoadingFallback";
import { ProtectedRoute, PublicOnlyRoute } from "@/components/auth/ProtectedRoute";
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
            <PublicOnlyRoute>
                <Suspense fallback={<LoadingFallback />}>
                    <AuthRoutesGroup />
                </Suspense>
            </PublicOnlyRoute>
        ),
        children: authRoutesConfig,
    },

    // --- ONBOARDING (lazy) ---
    {
        path: "/onboarding",
        element: (
            // <PublicOnlyRoute>  SE COMENTO AHORA SOLAMENTE PARA PODER PROBAR EL ONBOARDING ESTANDO AUN LOGUEADO
                <Suspense fallback={<LoadingFallback />}>
                    <OnboardingRoutesGroup />
                </Suspense>
            // </PublicOnlyRoute>
        ),
        children: onboardingRoutesConfig,
    },

    // --- APP (lazy pero con páginas eager dentro) ---
    {
        path: PATHS.app.root,
        element: (
            <ProtectedRoute>
                <Suspense fallback={<LoadingFallback />}>
                    <AppRoutesGroup />
                </Suspense>
            </ProtectedRoute>
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
