// Simplificar: SIEMPRE usar <Outlet context>, nunca children
import { Outlet } from 'react-router'
import PatientHeader from '@/components/PatientHeader'
import NavTabs from '@/components/NavTabs'
import { usePatient } from '@/contexts/PatientContext'

export function PatientLayout() {
  const { selectedPatient, activeTab, setActiveTab } = usePatient()

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-sc-bg">
      {/* Patient Header */}
      <PatientHeader patient={selectedPatient} />

      {/* Nav Tabs */}
      <NavTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          {/* Siempre pasa el context, nunca accepta children */}
          <Outlet context={{ patient: selectedPatient }} />
        </div>
      </div>
    </div>
  )
}