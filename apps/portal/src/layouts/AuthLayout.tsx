// Ahora acepta children (el contenido que va adentro)
import { Suspense, ReactNode } from "react";
import { Outlet } from "react-router";
import { LoadingFallback } from "@/components/LoadingFallback";

interface AuthLayoutProps {
    children?: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <Suspense fallback={<LoadingFallback />}>{children || <Outlet />}</Suspense>
        </div>
    );
}
