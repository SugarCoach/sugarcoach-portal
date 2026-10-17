import { useState, useEffect, useRef } from "react";
import { LuSmartphone, LuCheck, LuTriangle, LuLoader, LuX } from "react-icons/lu";

interface PairPatientModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (newPatient: any) => void;
}

type PairingStatus = "loading" | "waiting" | "success" | "expired";

export default function PairPatientModal({ isOpen, onClose, onSuccess }: PairPatientModalProps) {
    const [pairingStatus, setPairingStatus] = useState<PairingStatus>("loading");
    const [qrToken, setQrToken] = useState<string>("DEFAULT_TOKEN");

    // Temporizador de 15 minutos
    const INITIAL_TIME = 15 * 60;
    const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);

    const loadingTimeoutRef = useRef<number | null>(null);

    useEffect(() => {
        let initTimer: number;

        if (isOpen) {
            initTimer = window.setTimeout(() => {
                setPairingStatus("loading");
                setTimeLeft(INITIAL_TIME);
                setQrToken(`SUGARCOACH_SECURE_AUTH_${Date.now()}`);

                loadingTimeoutRef.current = window.setTimeout(() => {
                    setPairingStatus("waiting");
                }, 1000);
            }, 0);
        }

        return () => {
            if (initTimer) clearTimeout(initTimer);
            if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
        };
    }, [isOpen]);

    useEffect(() => {
        let timer: number;
        if (isOpen && pairingStatus === "waiting") {
            timer = window.setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        setPairingStatus("expired");
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isOpen, pairingStatus]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const handleRefreshQR = () => {
        setPairingStatus("loading");
        setTimeLeft(INITIAL_TIME);
        setQrToken(`SUGARCOACH_SECURE_AUTH_${Date.now()}`);

        loadingTimeoutRef.current = window.setTimeout(() => {
            setPairingStatus("waiting");
        }, 800);
    };

    const handleSimulateScanSuccess = () => {
        setPairingStatus("success");
        setTimeout(() => {
            onSuccess({ id: "new-patient", name: "Paciente Vinculado" });
            onClose();
        }, 2000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden border border-gray-100 p-6 relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    disabled={pairingStatus === "success"}
                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600 disabled:opacity-50"
                >
                    <LuX size={20} />
                </button>

                <div className="text-center mb-6">
                    <div className="inline-flex p-3 bg-sc-teal-light rounded-2xl mb-3">
                        <LuSmartphone size={28} className="text-sc-teal" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Vincular Nuevo Paciente</h3>
                    <p className="text-xs text-gray-500 mt-1">Código temporal y seguro asociado a tu cuenta médica.</p>
                </div>

                {/* LOADING STATE */}
                {pairingStatus === "loading" && (
                    <div className="flex flex-col items-center justify-center py-12 gap-3">
                        <LuLoader size={32} className="text-sc-teal animate-spin" />
                        <p className="text-xs text-gray-500">Generando código seguro...</p>
                    </div>
                )}

                {/* WAITING STATE */}
                {pairingStatus === "waiting" && (
                    <div className="flex flex-col items-center justify-center">
                        <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-5 w-full flex flex-col items-center mb-4">
                            <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 mb-3">
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=170x170&data=${qrToken}`}
                                    alt="Código QR de Vinculación"
                                    className="w-40 h-40 object-contain"
                                />
                            </div>

                            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full text-amber-800 text-xs font-medium">
                                <span>⏱️ Validez: {formatTime(timeLeft)}</span>
                            </div>
                        </div>

                        <p className="text-center text-xs text-gray-500 mb-4">
                            Escanea desde la app del paciente. El estado se actualizará automáticamente al aceptar.
                        </p>

                        {/* Botón de simulación (solo en dev) */}
                        {import.meta.env.DEV && (
                            <button
                                onClick={handleSimulateScanSuccess}
                                className="w-full text-xs text-sc-teal hover:text-sc-teal-dark bg-sc-teal-light hover:bg-sc-teal-light/80 py-2 rounded-xl font-medium transition-colors mb-2"
                            >
                                [Simular aceptación desde app móvil]
                            </button>
                        )}
                    </div>
                )}

                {/* EXPIRED STATE */}
                {pairingStatus === "expired" && (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="p-3 bg-red-50 rounded-full mb-3">
                            <LuTriangle size={28} className="text-red-600" />
                        </div>
                        <h4 className="text-sm font-bold text-gray-900 mb-1">El código ha expirado</h4>
                        <p className="text-xs text-gray-500 mb-5">
                            Por seguridad, los códigos QR de vinculación vencen a los 15 minutos.
                        </p>
                        <button
                            onClick={handleRefreshQR}
                            className="w-full bg-sc-teal hover:opacity-90 text-white font-medium py-2.5 rounded-xl text-sm transition-colors"
                        >
                            Generar nuevo código QR
                        </button>
                    </div>
                )}

                {/* SUCCESS STATE */}
                {pairingStatus === "success" && (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="p-3 bg-sc-teal-light rounded-full mb-3">
                            <LuCheck size={28} className="text-sc-teal" />
                        </div>
                        <h4 className="text-sm font-bold text-gray-900 mb-1">¡Vinculación Exitosa!</h4>
                        <p className="text-xs text-gray-500">
                            El paciente ha aceptado la solicitud. Actualizando portal...
                        </p>
                    </div>
                )}

                {/* FOOTER */}
                {pairingStatus !== "success" && (
                    <button
                        onClick={onClose}
                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 rounded-xl text-sm transition-colors mt-4"
                    >
                        Cerrar
                    </button>
                )}
            </div>
        </div>
    );
}
