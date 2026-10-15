import { createContext, useContext, useState, ReactNode } from 'react'
import { Patient, TabType } from '../types'
import { mockPatients } from '../data/mockData'

interface PatientContextType {
  selectedPatient: Patient
  setSelectedPatient: (patient: Patient) => void
  activeTab: TabType
  setActiveTab: (tab: TabType) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  filteredPatients: Patient[]
}

const PatientContext = createContext<PatientContextType | undefined>(undefined)

export function PatientProvider({ children }: { children: ReactNode }) {
  
  const [selectedPatient, setSelectedPatient] = useState<Patient>(mockPatients[0])
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredPatients = mockPatients.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <PatientContext.Provider
      value={{
        selectedPatient,
        setSelectedPatient,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        filteredPatients,
      }}
    >
      {children}
    </PatientContext.Provider>
  )
}

export function usePatient() {
  const context = useContext(PatientContext)
  if (!context) {
    throw new Error('usePatient debe usarse dentro de PatientProvider')
  }
  return context
}