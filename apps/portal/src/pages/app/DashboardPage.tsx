import { useOutletContext } from 'react-router'
import { Patient } from '@/types'
import Dashboard from '@/components/tabs/Dashboard'

export default function DashboardPage() {
  const { patient } = useOutletContext<{ patient: Patient }>()

  return <Dashboard patient={patient} />
}