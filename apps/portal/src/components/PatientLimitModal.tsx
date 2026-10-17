// Modal de límite con React Icons (CORREGIDO)
import { useNavigate } from "react-router";
import { LuTriangle, LuX } from "react-icons/lu";
import { PATHS } from "@/routes/paths";

interface PatientLimitModalProps {
    isOpen: boolean;
    patientLimit: number;
    onClose: () => void;
}

export default function PatientLimitModal({ isOpen, patientLimit, onClose }: PatientLimitModalProps) {
    const navigate = useNavigate();

    const handleChangePlan = () => {
        onClose();
        navigate(PATHS.onboarding.plan);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden border border-gray-100 p-6 relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600"
                >
                    <LuX size={20} />
                </button>

                <div className="text-center mb-6">
                    <div className="inline-flex p-3 bg-red-50 rounded-2xl mb-3">
                        <LuTriangle size={28} className="text-red-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Has alcanzado el límite de pacientes</h3>
                    <p className="text-xs text-gray-500 mt-2">
                        Tu plan permite un máximo de <strong>{patientLimit} pacientes</strong>. Consulta otros planes
                        para ampliar este límite.
                    </p>
                </div>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={onClose}
                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 rounded-xl text-sm transition-colors"
                    >
                        Cerrar
                    </button>

                    <button
                        onClick={handleChangePlan}
                        className="w-full bg-sc-teal hover:opacity-90 text-white font-medium py-2.5 rounded-xl text-sm transition-colors"
                    >
                        Consultar planes
                    </button>
                </div>
            </div>
        </div>
    );
}
