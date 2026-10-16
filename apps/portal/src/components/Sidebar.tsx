import { useState, useEffect } from 'react'
import { Patient } from '../types'
import { getTimeAgo } from '../data/mockData'

interface SidebarProps {
  patients: Patient[]
  selectedPatient: Patient
  onSelectPatient: (patient: Patient) => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

type PairingStatus = 'loading' | 'waiting' | 'success' | 'expired'

export default function Sidebar({
  patients,
  selectedPatient,
  onSelectPatient,
  searchQuery,
  onSearchChange,
}: SidebarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [pairingStatus, setPairingStatus] = useState<PairingStatus>('loading')
  const [qrToken, setQrToken] = useState<string>('DEFAULT_TOKEN')
  
  // Temporizador de 15 minutos (900 segundos)
  const INITIAL_TIME = 15 * 60
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME)

  const handleOpenModal = () => {
    setIsModalOpen(true)
    setPairingStatus('loading')
    setTimeLeft(INITIAL_TIME)
    setQrToken(`SUGARCOACH_SECURE_AUTH_${Date.now()}`)

    setTimeout(() => {
      setPairingStatus('waiting')
    }, 1000)
  }

  useEffect(() => {
    let timer: number
    if (isModalOpen && pairingStatus === 'waiting') {
      timer = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            setPairingStatus('expired')
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isModalOpen, pairingStatus])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleRefreshQR = () => {
    setPairingStatus('loading')
    setTimeLeft(INITIAL_TIME)
    setQrToken(`SUGARCOACH_SECURE_AUTH_${Date.now()}`)
    setTimeout(() => {
      setPairingStatus('waiting')
    }, 800)
  }

  const handleSimulateScanSuccess = () => {
    setPairingStatus('success')
    setTimeout(() => {
      setIsModalOpen(false)
    }, 2000)
  }

  return (
    <div className="w-80 bg-sc-surface border-r border-sc-border flex flex-col overflow-hidden">
      {/* Botón superior de Agregar paciente y Barra de Búsqueda */}
      <div className="p-4 border-b border-sc-border flex flex-col gap-3">
        <button
          onClick={handleOpenModal}
          className="w-full flex items-center justify-center gap-2 bg-sc-teal hover:opacity-90 text-white font-medium py-2.5 px-4 rounded-xl transition-colors shadow-sm text-sm"
        >
          <span>➕</span>
          <span>Agregar paciente (Vincular)</span>
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
                ? 'bg-sc-surface-hover border-l-sc-teal'
                : 'bg-sc-surface border-l-transparent hover:bg-sc-surface-hover'
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

      {/* ======================================================= */}
      {/* MODAL DE VINCULACIÓN */}
      {/* ======================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden border border-gray-100 p-6 relative">
            
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-colors font-bold"
            >
              ✕
            </button>

            <div className="text-center mb-5">
              <div className="inline-flex p-3 bg-teal-50 text-[#00A389] rounded-2xl mb-2 text-xl">
                📱
              </div>
              <h3 className="text-lg font-bold text-gray-900">Vincular Nuevo Paciente</h3>
              <p className="text-xs text-gray-500 mt-1">
                Código temporal y seguro asociado a tu cuenta médica.
              </p>
            </div>

            {pairingStatus === 'loading' && (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <div className="w-8 h-8 border-4 border-[#00A389] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs text-gray-500">Generando código seguro...</p>
              </div>
            )}

            {pairingStatus === 'waiting' && (
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
                    <span>⏱️ Validez: <strong className="font-bold">{formatTime(timeLeft)}</strong> min</span>
                  </div>
                </div>

                <p className="text-center text-xs text-gray-500 mb-4">
                  Escanea desde la app del paciente. El estado se actualizará automáticamente al aceptar.
                </p>

                <button
                  onClick={handleSimulateScanSuccess}
                  className="w-full text-xs text-teal-600 hover:text-teal-700 bg-teal-50 hover:bg-teal-100 py-2 rounded-xl font-medium transition-colors mb-2"
                >
                  [Simular aceptación desde app móvil]
                </button>
              </div>
            )}

            {pairingStatus === 'expired' && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="p-3 bg-red-50 text-red-600 rounded-full mb-3 text-xl">
                  ⚠️
                </div>
                <h4 className="text-sm font-bold text-gray-900 mb-1">El código ha expirado</h4>
                <p className="text-xs text-gray-500 mb-5">
                  Por seguridad, los códigos QR de vinculación vencen a los 15 minutos.
                </p>
                <button
                  onClick={handleRefreshQR}
                  className="w-full bg-[#00A389] hover:opacity-90 text-white font-medium py-2.5 rounded-xl text-sm transition-colors mb-2"
                >
                  Generar nuevo código QR
                </button>
              </div>
            )}

            {pairingStatus === 'success' && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="p-3 bg-teal-50 text-[#00A389] rounded-full mb-3 text-xl">
                  ✅
                </div>
                <h4 className="text-sm font-bold text-gray-900 mb-1">¡Vinculación Exitosa!</h4>
                <p className="text-xs text-gray-500">
                  El paciente ha aceptado la solicitud. Actualizando portal...
                </p>
              </div>
            )}

            {pairingStatus !== 'success' && (
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 rounded-xl text-sm transition-colors mt-2"
              >
                Cerrar
              </button>
            )}

          </div>
        </div>
      )}
    </div>
  )
}
