import { BAA_VERSION, DATA_USE_DECLARATION_VERSION, TOS_VERSION } from './constants'
import type { DoctorOnboardingForm } from './schema'

// MOCK: hoy todo ocurre en el navegador. Al conectar el BFF solo cambia este archivo
// (POST/GET /api/v1/doctors/onboarding); las firmas de las funciones se mantienen.

export type OnboardingStatus = 'not_started' | 'pending_verification' | 'verified'

export interface OnboardingSubmission extends DoctorOnboardingForm {
  signedAt: string
  documentVersions: { baa: string; tos: string; dataUseDeclaration: string }
  // La IP de firma NO se envía desde el cliente: la registra el BFF al recibir la ficha.
}

const STATUS_KEY = 'sc.doctorOnboarding.status'
const MOCK_LATENCY_MS = 600

// TODO: reemplazar por el email del usuario autenticado en Firebase.
export const MOCK_DOCTOR_EMAIL = 'doctor@sugarcoach.local'

function readStatus(): OnboardingStatus {
  try {
    const v = sessionStorage.getItem(STATUS_KEY)
    if (v === 'pending_verification' || v === 'verified') return v
  } catch {
    // sessionStorage no disponible (modo privado, etc.)
  }
  return 'not_started'
}

export function isOnboardingGateDisabled(): boolean {
  return import.meta.env.VITE_SKIP_ONBOARDING_GATE === 'true'
}

export async function getOnboardingStatus(): Promise<OnboardingStatus> {
  if (isOnboardingGateDisabled()) return 'verified'
  return readStatus()
}

export async function submitOnboarding(form: DoctorOnboardingForm): Promise<void> {
  const submission: OnboardingSubmission = {
    ...form,
    signedAt: new Date().toISOString(),
    documentVersions: {
      baa: BAA_VERSION,
      tos: TOS_VERSION,
      dataUseDeclaration: DATA_USE_DECLARATION_VERSION,
    },
  }
  await new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY_MS))
  // No se loguea el payload: contiene datos personales.
  void submission
  try {
    sessionStorage.setItem(STATUS_KEY, 'pending_verification')
  } catch {
    // sin persistencia: el mock simplemente no recuerda el estado
  }
}
