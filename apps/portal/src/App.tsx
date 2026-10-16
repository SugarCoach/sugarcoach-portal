import { useState } from 'react'
import { mockPatients, mockDoctor } from './data/mockData'
import { Patient, TabType } from './types'
import { planLimits, SubscriptionType } from './components/planLimits'
import Sidebar from './components/Sidebar'
import MainContent from './components/MainContent'

export default function App() {
  const [selectedPatient, setSelectedPatient] = useState<Patient>(mockPatients[0])
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredPatients = mockPatients.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex h-screen bg-sc-bg">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-sc-surface border-b border-sc-border z-40">
        <div className="h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-sc-teal flex items-center justify-center text-white font-bold text-sm">
              SC
            </div>
            <span className="text-lg font-semibold text-sc-text-primary">SugarCoach Portal Médico</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-sc-text-secondary">{mockDoctor.name}</span>
            <div className="w-10 h-10 rounded-full bg-sc-teal-light flex items-center justify-center text-sc-teal-dark font-semibold">
              {mockDoctor.avatar}
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 mt-16">
        {/* Sidebar */}
        <Sidebar
          patients={filteredPatients}
          selectedPatient={selectedPatient}
          onSelectPatient={setSelectedPatient}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Main Content */}
        <MainContent
          patient={selectedPatient}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>
    </div>
  )
}
