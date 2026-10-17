import { Suspense, ReactNode, useState } from "react";
import { Outlet } from "react-router";
import Sidebar from "@/components/Sidebar";
import PairPatientModal from "@/components/PairPatientModal";
import PatientLimitModal from "@/components/PatientLimitModal";
import { LoadingFallback } from "@/components/LoadingFallback";
import { usePatient } from "@/contexts/PatientContext";
import { mockDoctor } from "@/data/mockData";
import { PATHS } from "@/routes/paths";
import { Link } from "react-router";

interface AppLayoutProps {
    children?: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
    const { filteredPatients, selectedPatient, setSelectedPatient, searchQuery, setSearchQuery } = usePatient();

    // ====== LÓGICA DE MODALES ======
    // Estado para controlar qué modal está abierto
    const [isPairModalOpen, setIsPairModalOpen] = useState(false);
    const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
    const [patientsCount, setPatientsCount] = useState(filteredPatients.length);

    // Límite de pacientes (hardcodeado por ahora, luego viene del backend)
    const PATIENT_LIMIT = 5;

    // Cuando se aprieta "Agregar paciente"
    const handleAddPatient = () => {
        // Si ya alcanzó el límite, mostrar modal de límite
        if (patientsCount >= PATIENT_LIMIT) {
            setIsLimitModalOpen(true);
            return;
        }
        // Si no, mostrar modal de QR
        setIsPairModalOpen(true);
    };

    // Cuando se vincula un paciente exitosamente
    const handlePairingSuccess = (newPatient: any) => {
        console.log("Paciente vinculado:", newPatient);
        // Incrementar contador de pacientes
        setPatientsCount((prev) => prev + 1);
        // Cerrar modal de QR
        setIsPairModalOpen(false);
    };

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
                    onOpenPairModal={handleAddPatient}
                />

                {/* Main Content */}
                <main className="flex-1 overflow-hidden flex flex-col">
                    <Suspense fallback={<LoadingFallback />}>{children || <Outlet />}</Suspense>
                </main>
            </div>

            {/* Modal de QR */}
            <PairPatientModal
                isOpen={isPairModalOpen}
                onClose={() => setIsPairModalOpen(false)}
                onSuccess={handlePairingSuccess}
            />

            {/* Modal de Límite de Pacientes */}
            <PatientLimitModal
                isOpen={isLimitModalOpen}
                patientLimit={PATIENT_LIMIT}
                onClose={() => setIsLimitModalOpen(false)}
            />
        </div>
    );
}
