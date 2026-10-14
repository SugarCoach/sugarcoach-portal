import { Patient } from '../types'
import { getTimeAgo } from '../data/mockData'

interface PatientHeaderProps {
  patient: Patient
}

export default function PatientHeader({ patient }: PatientHeaderProps) {
  return (
    <div className="bg-sc-surface border-b border-sc-border px-6 py-4 shadow-sc-subtle">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-sc-teal-light flex items-center justify-center text-sc-teal-dark font-semibold text-lg flex-shrink-0">
            {patient.avatar}
          </div>

          {/* Info */}
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-sc-text-primary">{patient.name}</h2>
            <p className="text-sm text-sc-text-secondary">
              {patient.age} años · Diabetes {patient.diabetesType}
            </p>
          </div>
        </div>

        {/* Badges and button */}
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-sc-full bg-sc-teal-light text-sc-teal-dark text-xs font-semibold">
            Solo lectura
          </span>
          <span className="px-3 py-1 rounded-sc-full bg-gray-100 text-sc-text-secondary text-xs">
            Sincronizado hace {getTimeAgo(patient.lastSync)}
          </span>
          <button className="px-4 py-2 rounded-sc-md border border-sc-teal text-sc-teal font-medium text-sm hover:bg-sc-teal-light transition-colors">
            ↻ Actualizar
          </button>
        </div>
      </div>
    </div>
  )
}
