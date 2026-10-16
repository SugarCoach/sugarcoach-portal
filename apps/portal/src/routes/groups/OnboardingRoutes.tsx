// Grupo de rutas de onboarding
// Solo exporta el componente (sin constantes)

import { Outlet } from "react-router";
import { OnboardingLayout } from "@/layouts/OnBoardingLayout";

// Componente que se importa con lazy() en routes/index.tsx
export default function OnboardingRoutesGroup() {
    return (
        <OnboardingLayout>
            <Outlet />
        </OnboardingLayout>
    );
}
