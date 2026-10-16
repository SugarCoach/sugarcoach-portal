// Ahora acepta children
import { Suspense, ReactNode, useState } from "react";
import { Link, Outlet } from "react-router";
import Sidebar from "@/components/Sidebar";
import PairPatientModal from "@/components/PairPatientModal"; // <-- 2. Importamos tu nuevo modal
import { LoadingFallback } from "@/components/LoadingFallback";
import { usePatient } from "@/contexts/PatientContext";
import { mockDoctor } from "@/data/mockData";
import { PATHS } from "@/routes/paths";

interface AppLayoutProps {
    children?: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
    const { filteredPatients, selectedPatient, setSelectedPatient, searchQuery, setSearchQuery } = usePatient();

    const [isPairModalOpen, setIsPairModalOpen] = useState(false);

    return (
        <div className="flex h-screen w-full bg-sc-bg">
            {/* Top Bar */}
            <div className="fixed top-0 left-0 right-0 h-16 bg-sc-surface border-b border-sc-border z-40">
                <div className="h-full px-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-sc-teal flex items-center justify-center text-white font-bold text-sm">
                            SC
                        </div>
                        <span className="text-lg font-semibold text-sc-text-primary">SugarCoach Portal Médico</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            to={PATHS.onboarding.plan}
                            className="px-4 py-2 rounded-lg bg-sc-teal text-white text-sm font-medium hover:bg-sc-teal-dark transition-colors"
                        >
                            Ver planes
                        </Link>
                        <span className="text-sm text-sc-text-secondary">{mockDoctor.name}</span>
                        <div className="w-10 h-10 rounded-full bg-sc-teal-light flex items-center justify-center text-sc-teal-dark font-semibold">
                            {mockDoctor.avatar}
                        </div>
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
                    onOpenPairModal={() => setIsPairModalOpen(true)}
                />

                {/* Main Content */}
                <main className="flex-1 overflow-hidden flex flex-col">
                    <Suspense fallback={<LoadingFallback />}>{children || <Outlet />}</Suspense>
                </main>
            </div>

            <PairPatientModal
                isOpen={isPairModalOpen}
                onClose={() => setIsPairModalOpen(false)}
                onSuccess={(newPatient) => {
                    console.log('Paciente vinculado:', newPatient);
                    // Aquí en el futuro puedes disparar una función para actualizar la lista de pacientes
                }}
            />
        </div>
    );
}