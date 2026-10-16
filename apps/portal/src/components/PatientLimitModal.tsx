
interface PatientLimitModalProps {
  patientLimit: number;
  onClose: () => void;
  onChangePlan: () => void;
}

export default function PatientLimitModal({
  patientLimit,
  onClose,
  onChangePlan,
}: PatientLimitModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h2 className="mb-3 text-xl font-bold">
          Has alcanzado el límite de pacientes
        </h2>

        <p className="mb-6 text-gray-600">
          Tu plan permite un máximo de {patientLimit} pacientes.
          Consulta otros planes para ampliar este límite.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border px-4 py-2"
          >
            Cerrar
          </button>

          <button
            onClick={onChangePlan}
            className="rounded-lg bg-purple-700 px-4 py-2 text-white"
          >
            Consultar planes
          </button>
        </div>
      </div>
    </div>
  );
}
