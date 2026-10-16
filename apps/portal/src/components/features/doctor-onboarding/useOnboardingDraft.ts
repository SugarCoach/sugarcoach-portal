import { useEffect } from 'react'
import type { UseFormWatch } from 'react-hook-form'
import { applyDevSample } from './devSampleValues'
import { emptyOnboardingForm, type DoctorOnboardingForm } from './schema'

// El borrador contiene datos personales (DOB, domicilio, EIN): se guarda en
// sessionStorage (muere con la pestaña) y NUNCA incluye la firma ni las aceptaciones legales.

const DRAFT_KEY = 'sc.doctorOnboarding.draft'
const DEBOUNCE_MS = 500

function stripLegal(form: DoctorOnboardingForm): DoctorOnboardingForm {
  return { ...form, compliance: emptyOnboardingForm('').compliance }
}

export function loadDraft(email: string): DoctorOnboardingForm {
  const base = applyDevSample(emptyOnboardingForm(email))
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY)
    if (!raw) return base
    const saved = JSON.parse(raw) as Partial<DoctorOnboardingForm>
    return {
      identity: { ...base.identity, ...saved.identity, email },
      credentials: { ...base.credentials, ...saved.credentials },
      compliance: base.compliance,
      networks: { ...base.networks, ...saved.networks },
      cpt: { ...base.cpt, ...saved.cpt },
    }
  } catch {
    return base
  }
}

export function clearDraft() {
  try {
    sessionStorage.removeItem(DRAFT_KEY)
  } catch {
    // nada que limpiar
  }
}

/** Guarda el borrador (con debounce) cada vez que cambia el formulario. */
export function useDraftAutosave(watch: UseFormWatch<DoctorOnboardingForm>) {
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined
    const subscription = watch((value) => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        try {
          sessionStorage.setItem(DRAFT_KEY, JSON.stringify(stripLegal(value as DoctorOnboardingForm)))
        } catch {
          // sin persistencia: el formulario sigue funcionando
        }
      }, DEBOUNCE_MS)
    })
    return () => {
      clearTimeout(timer)
      subscription.unsubscribe()
    }
  }, [watch])
}
