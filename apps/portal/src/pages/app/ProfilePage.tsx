import { useOutletContext } from 'react-router'
import { Patient } from '@/types'
import Profile from '@/components/tabs/Profile'

export default function ProfilePage() {
  const { patient } = useOutletContext<{ patient: Patient }>()

  return <Profile patient={patient} />
}