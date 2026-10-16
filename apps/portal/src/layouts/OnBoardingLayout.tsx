// Ahora acepta children
import { Suspense, ReactNode } from "react";
import { Outlet } from "react-router";
import { LoadingFallback } from "@/components/LoadingFallback";

interface OnboardingLayoutProps {
    children?: ReactNode;
}

export function OnboardingLayout({ children }: OnboardingLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col bg-gray-50">
            <header className="border-b border-gray-200 bg-white p-4 shadow-sm">
                <h1 className="text-lg font-semibold text-gray-900">SugarCoach — Onboarding</h1>
            </header>
            <main className="flex-1 p-6">
                <Suspense fallback={<LoadingFallback />}>{children || <Outlet />}</Suspense>
            </main>
        </div>
    );
}
