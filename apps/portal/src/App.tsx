import { RouterProvider } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PatientProvider } from '@/contexts/PatientContext'
import { router } from '@/routes'

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PatientProvider>
        <RouterProvider router={router} />
      </PatientProvider>
    </QueryClientProvider>
  )
}
