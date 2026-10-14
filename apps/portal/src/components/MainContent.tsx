import { Patient, TabType } from '../types'
import PatientHeader from './PatientHeader'
import NavTabs from './NavTabs'
import Dashboard from './tabs/Dashboard'
import History from './tabs/History'
import Stats from './tabs/Stats'
import Treatment from './tabs/Treatment'
import Profile from './tabs/Profile'

interface MainContentProps {
  patient: Patient
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

export default function MainContent({ patient, activeTab, onTabChange }: MainContentProps) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-sc-bg">
      {/* Patient Header */}
      <PatientHeader patient={patient} />

      {/* Nav Tabs */}
      <NavTabs activeTab={activeTab} onTabChange={onTabChange} />

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          {activeTab === 'dashboard' && <Dashboard patient={patient} />}
          {activeTab === 'history' && <History />}
          {activeTab === 'stats' && <Stats />}
          {activeTab === 'treatment' && <Treatment />}
          {activeTab === 'profile' && <Profile patient={patient} />}
        </div>
      </div>
    </div>
  )
}
