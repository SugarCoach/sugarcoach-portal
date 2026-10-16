import { RouterProvider } from 'react-router'
import { PatientProvider } from '@/contexts/PatientContext'
import { router } from '@/routes'

export default function App() {
  return (
    <PatientProvider>
      <RouterProvider router={router} />
    </PatientProvider>
  )
}