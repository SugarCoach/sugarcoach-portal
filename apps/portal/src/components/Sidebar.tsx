import { Patient } from "../types";
import { getTimeAgo } from "../data/mockData";
import PatientLimitModal from "./PatientLimitModal";
import { planLimits, SubscriptionType } from "./planLimits";
const currentSubscription: SubscriptionType = "starter";
const pacientLimit = planLimits[currentSubscription].patientsTotal;
interface SidebarProps {
    patients: Patient[];
    selectedPatient: Patient;
    onSelectPatient: (patient: Patient) => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    onOpenPairModal: () => void; // Solo emite la señal para abrir el modal
}

export default function Sidebar({
    patients,
    selectedPatient,
    onSelectPatient,
    searchQuery,
    onSearchChange,
    onOpenPairModal,
}: SidebarProps) {
    return (
        <div className="w-80 bg-sc-surface border-r border-sc-border flex flex-col overflow-hidden">
            {/* Search */}
            <div className="p-4 border-b border-sc-border">
                {/* Botón superior de Agregar paciente y Barra de Búsqueda */}
                <div className="py-4 border-b border-sc-border flex flex-col gap-3">
                    <PatientLimitModal
                        patientCount={patients.length}
                        patientLimit={pacientLimit}
                        onClose={() => {}}
                        onChangePlan={() => {}}
                    />

                    <button
                        onClick={onOpenPairModal}
                        className="w-full flex items-center justify-center gap-2 bg-sc-teal hover:opacity-90 text-white font-medium py-2.5 px-4 
                        rounded-md transition-colors shadow-sm text-sm"
                    >
                        <span>➕</span>
                        <span>Agregar paciente</span>
                    </button>

                    <input
                        type="text"
                        placeholder="Buscar paciente..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full px-3 py-2 rounded-sc-md bg-sc-bg border border-sc-border text-sc-text-primary placeholder-sc-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-sc-teal"
                    />
                </div>

                {/* Patient List */}
                <div className="flex-1 overflow-y-auto">
                    {patients.map((patient) => (
                        <button
                            key={patient.id}
                            onClick={() => onSelectPatient(patient)}
                            className={`w-full text-left px-4 py-3 border-l-4 transition-colors ${
                                selectedPatient.id === patient.id
                                    ? "bg-sc-surface-hover border-l-sc-teal"
                                    : "bg-sc-surface border-l-transparent hover:bg-sc-surface-hover"
                            }`}
                        >
                            <div className="flex items-start gap-3">
                                {/* Avatar */}
                                <div className="w-10 h-10 rounded-full bg-sc-teal-light flex items-center justify-center text-sc-teal-dark font-semibold text-sm flex-shrink-0 mt-0.5">
                                    {patient.avatar}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-sc-text-primary truncate">{patient.name}</div>
                                    <div className="text-xs text-sc-text-muted">
                                        Sincronizado {getTimeAgo(patient.lastSync)}
                                    </div>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
