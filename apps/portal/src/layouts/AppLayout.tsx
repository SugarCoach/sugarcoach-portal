import { Suspense, ReactNode, useState } from "react";
import { Outlet } from "react-router";
import Sidebar from "@/components/Sidebar";
import PairPatientModal from "@/components/PairPatientModal";
import PatientLimitModal from "@/components/PatientLimitModal";
import { LoadingFallback } from "@/components/LoadingFallback";
import { usePatient } from "@/contexts/PatientContext";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { PATHS } from "@/routes/paths";
import { Link } from "react-router";

interface AppLayoutProps {
    children?: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
    // ====== FROM PR #4: AUTH + TOAST ======
    const { doctor, logout } = useAuth();
    const toast = useToast();

    // ====== FROM DEVELOP: PATIENT CONTEXT ======
    const { filteredPatients, selectedPatient, setSelectedPatient, searchQuery, setSearchQuery } = usePatient();

    // ====== LÓGICA DE MODALES DE PACIENTES (FROM DEVELOP) ======
    const [isPairModalOpen, setIsPairModalOpen] = useState(false);
    const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
    const [patientsCount, setPatientsCount] = useState(filteredPatients.length);

    const PATIENT_LIMIT = 5;

    const handleAddPatient = () => {
        if (patientsCount >= PATIENT_LIMIT) {
            setIsLimitModalOpen(true);
            return;
        }
        setIsPairModalOpen(true);
    };

    const handlePairingSuccess = (newPatient: any) => {
        console.log("Paciente vinculado:", newPatient);
        setPatientsCount((prev) => prev + 1);
        setIsPairModalOpen(false);
    };

    // ====== LOGOUT CON TOAST (FROM PR #4) ======
    const handleLogout = () => {
        logout();
        toast.info("Sesión cerrada");
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
                        <span className="text-lg font-semibold text-sc-text-primary">
                            SugarCoach Portal Médico
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Ver planes (from develop) */}
                        <Link
                            to={PATHS.onboarding.plan}
                            className="px-4 py-2 rounded-lg bg-sc-teal text-white text-sm font-medium hover:bg-sc-teal-dark transition-colors"
                        >
                            Ver planes
                        </Link>

                        {/* Doctor name & avatar (now from auth context) */}
                        <span className="text-sm text-sc-text-secondary">{doctor?.name}</span>
                        <div className="w-10 h-10 rounded-full bg-sc-teal-light flex items-center justify-center text-sc-teal-dark font-semibold">
                            {doctor?.avatar}
                        </div>

                        {/* Logout button (from PR #4) */}
                        <button
                            type="button"
                            onClick={handleLogout}
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
                {/* Sidebar (with patient modal handler) */}
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

            {/* Modal de QR (from develop) */}
            <PairPatientModal
                isOpen={isPairModalOpen}
                onClose={() => setIsPairModalOpen(false)}
                onSuccess={handlePairingSuccess}
            />

            {/* Modal de Límite de Pacientes (from develop) */}
            <PatientLimitModal
                isOpen={isLimitModalOpen}
                patientLimit={PATIENT_LIMIT}
                onClose={() => setIsLimitModalOpen(false)}
            />
        </div>
    );
}