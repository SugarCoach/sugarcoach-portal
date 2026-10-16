// Grupo de rutas principales del dashboard médico
// Solo exporta el componente (sin constantes)

import { useQuery } from "@tanstack/react-query";
import { Navigate } from "react-router";
import { AppLayout } from "@/layouts/AppLayout";
import { PatientLayout } from "@/layouts/PatientLayout";
import { LoadingFallback } from "@/components/LoadingFallback";
import { getOnboardingStatus } from "@/features/doctor-onboarding/onboardingService";
import { PATHS } from "../paths";

// Componente que se importa con lazy() en routes/index.tsx
export default function AppRoutesGroup() {
    // El médico no puede usar el portal hasta completar la ficha y ser verificado.
    const { data: status, isPending } = useQuery({
        queryKey: ["onboarding-status"],
        queryFn: getOnboardingStatus,
    });

    if (isPending) return <LoadingFallback />;
    if (status === "not_started") return <Navigate to={PATHS.onboarding.medicalForm} replace />;
    if (status === "pending_verification") return <Navigate to={PATHS.onboarding.pending} replace />;

    return (
        <AppLayout>
            <PatientLayout />
        </AppLayout>
    );
}
