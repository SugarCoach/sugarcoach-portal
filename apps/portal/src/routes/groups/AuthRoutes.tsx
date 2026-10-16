// Grupo de rutas de autenticación
// Solo exporta el componente (sin constantes)
// Las constantes están en routeConfigs.ts

import { Outlet } from "react-router";
import { AuthLayout } from "@/layouts/AuthLayout";

// Componente que se importa con lazy() en routes/index.tsx
export default function AuthRoutesGroup() {
    return (
        <AuthLayout>
            <Outlet />
        </AuthLayout>
    );
}
