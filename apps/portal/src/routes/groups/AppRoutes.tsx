// Grupo de rutas principales del dashboard médico
// Solo exporta el componente (sin constantes)

import { AppLayout } from "@/layouts/AppLayout";
import { PatientLayout } from "@/layouts/PatientLayout";

// Componente que se importa con lazy() en routes/index.tsx
export default function AppRoutesGroup() {
    return (
        <AppLayout>
            <PatientLayout />
        </AppLayout>
    );
}
