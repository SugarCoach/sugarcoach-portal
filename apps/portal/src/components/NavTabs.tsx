// Componente de tabs para navegar entre Dashboard, History, Stats, Treatment, Profile
// ARREGLO: Ahora usa useNavigate para cambiar la ruta real, no solo el estado
// Resultado: Los botones navegan a /app/dashboard, /app/history, etc.

import { useNavigate } from 'react-router'
import { TabType } from '@/types'
import { getTabPath } from '@/routes/paths'

interface NavTabsProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

const tabs: { id: TabType; label: string }[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'history', label: 'Historial' },
  { id: 'stats', label: 'Estadísticas' },
  { id: 'treatment', label: 'Tratamiento' },
  { id: 'profile', label: 'Perfil' },
]

export default function NavTabs({ activeTab, onTabChange }: NavTabsProps) {
  const navigate = useNavigate()

  // Maneja el click en un tab:
  // 1. Actualiza el estado en el Context (activeTab)
  // 2. Navega a la ruta real con React Router
  const handleTabChange = (tab: TabType) => {
    onTabChange(tab)
    navigate(getTabPath(tab))
  }

  return (
    <div className="bg-sc-surface border-b border-gray-200 px-6">
      <div className="flex gap-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`py-4 px-1 font-medium text-sm transition-colors border-b-2 ${
              activeTab === tab.id
                ? 'text-sc-teal border-b-sc-teal'
                : 'text-sc-text-secondary border-b-transparent hover:text-sc-text-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}