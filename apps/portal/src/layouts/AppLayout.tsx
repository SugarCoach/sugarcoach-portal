// Ahora acepta children
import { Suspense, ReactNode } from "react";
import { Outlet } from "react-router";
import Sidebar from "@/components/Sidebar";
import { LoadingFallback } from "@/components/LoadingFallback";
import { usePatient } from "@/contexts/PatientContext";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "@/hooks/useToast";

interface AppLayoutProps {
    children?: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
    const { doctor, logout } = useAuth();
    const { filteredPatients, selectedPatient, setSelectedPatient, searchQuery, setSearchQuery } = usePatient();
    const toast = useToast();

    return (
        <div className="flex h-screen w-full bg-sc-bg">
            {/* Top Bar */}
            <div className="fixed top-0 left-0 right-0 h-16 bg-sc-surface border-b border-sc-border z-40">
                <div className="h-full px-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-sc-teal flex items-center justify-center text-white font-bold text-sm">
                    SC
                    </div>
                    <span className="text-lg font-semibold text-sc-text-primary">
                    SugarCoach Portal Médico
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-sc-text-secondary">
                    {doctor?.name}
                    </span>
                    <div className="w-10 h-10 rounded-full bg-sc-teal-light flex items-center justify-center text-sc-teal-dark font-semibold">
                    {doctor?.avatar}
                    </div>
                    <button
                    type="button"
                    onClick={() => {
                        logout();
                        toast.info("Sesión cerrada");
                    }}
                    aria-label="Cerrar sesión"
                    title="Cerrar sesión"
                    className="flex h-10 w-10 items-center justify-center rounded-full text-sc-text-secondary transition hover:bg-sc-bg hover:text-sc-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-sc-teal"
                    >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                    >
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    </button>
                </div>
                </div>
            </div>

            {/* Main Layout */}
            <div className="flex flex-1 mt-16">
                {/* Sidebar */}
                <Sidebar
                    patients={filteredPatients}
                    selectedPatient={selectedPatient}
                    onSelectPatient={setSelectedPatient}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                />

                {/* Main Content */}
                <main className="flex-1 overflow-hidden flex flex-col">
                    <Suspense fallback={<LoadingFallback />}>{children || <Outlet />}</Suspense>
                </main>
            </div>
        </div>
    );
}
