import { Patient } from '../../types'

interface ProfileProps {
  patient: Patient
}

export default function Profile({ patient }: ProfileProps) {
  const profileData = {
    personal: [
      { label: 'Nombre Completo', value: patient.name },
      { label: 'Edad', value: `${patient.age} años` },
      { label: 'Tipo de Diabetes', value: `Diabetes ${patient.diabetesType}` },
      { label: 'Fecha de Diagnóstico', value: '15 de marzo 2020' },
    ],
    contact: [
      { label: 'Email', value: 'patient@example.com' },
      { label: 'Teléfono', value: '+34 612 345 678' },
      { label: 'Dirección', value: 'Calle Principal 123, Madrid' },
      { label: 'Código Postal', value: '28001' },
    ],
    medical: [
      { label: 'Doctor Asignado', value: 'Dra. Ana García' },
      { label: 'Especialidad', value: 'Endocrinología' },
      { label: 'Hospital', value: 'Hospital Clínico de Madrid' },
      { label: 'Teléfono Doctor', value: '+34 91 227 2000' },
    ],
    emergency: [
      { label: 'Contacto de Emergencia', value: 'Juan Rodríguez García' },
      { label: 'Relación', value: 'Esposo' },
      { label: 'Teléfono', value: '+34 612 987 654' },
    ],
  }

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Avatar Section */}
      <div className="bg-sc-surface rounded-sc-lg shadow-sc-subtle p-6 flex flex-col items-center justify-center">
        <div className="w-24 h-24 rounded-full bg-sc-teal-light flex items-center justify-center text-sc-teal-dark font-semibold text-4xl mb-4">
          {patient.avatar}
        </div>
        <h3 className="text-lg font-semibold text-sc-text-primary text-center">{patient.name}</h3>
        <p className="text-sm text-sc-text-secondary text-center mt-1">
          Paciente desde 2020
        </p>
      </div>

      {/* Personal Info */}
      <div className="bg-sc-surface rounded-sc-lg shadow-sc-subtle p-6">
        <h3 className="text-sm font-semibold text-sc-text-primary mb-4 pb-3 border-b border-sc-border">
          Información Personal
        </h3>
        <div className="space-y-4">
          {profileData.personal.map((item, idx) => (
            <div key={idx}>
              <div className="text-xs text-sc-text-secondary font-semibold uppercase tracking-wide mb-1">
                {item.label}
              </div>
              <div className="text-sm text-sc-text-primary">{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-sc-surface rounded-sc-lg shadow-sc-subtle p-6">
        <h3 className="text-sm font-semibold text-sc-text-primary mb-4 pb-3 border-b border-sc-border">
          Información de Contacto
        </h3>
        <div className="space-y-4">
          {profileData.contact.map((item, idx) => (
            <div key={idx}>
              <div className="text-xs text-sc-text-secondary font-semibold uppercase tracking-wide mb-1">
                {item.label}
              </div>
              <div className="text-sm text-sc-text-primary">{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Medical Info */}
      <div className="bg-sc-surface rounded-sc-lg shadow-sc-subtle p-6">
        <h3 className="text-sm font-semibold text-sc-text-primary mb-4 pb-3 border-b border-sc-border">
          Información Médica
        </h3>
        <div className="space-y-4">
          {profileData.medical.map((item, idx) => (
            <div key={idx}>
              <div className="text-xs text-sc-text-secondary font-semibold uppercase tracking-wide mb-1">
                {item.label}
              </div>
              <div className="text-sm text-sc-text-primary">{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="bg-sc-surface rounded-sc-lg shadow-sc-subtle p-6">
        <h3 className="text-sm font-semibold text-sc-text-primary mb-4 pb-3 border-b border-sc-border">
          Contacto de Emergencia
        </h3>
        <div className="space-y-4">
          {profileData.emergency.map((item, idx) => (
            <div key={idx}>
              <div className="text-xs text-sc-text-secondary font-semibold uppercase tracking-wide mb-1">
                {item.label}
              </div>
              <div className="text-sm text-sc-text-primary">{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
