import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { FormProvider, useForm, type FieldErrors } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { PATHS } from '@/routes/paths'
import { StepIndicator } from '@/components/features/doctor-onboarding/components/StepIndicator'
import { StepIdentity } from '@/components/features/doctor-onboarding/components/StepIdentity'
import { StepCredentials } from '@/components/features/doctor-onboarding/components/StepCredentials'
import { StepCompliance } from '@/components/features/doctor-onboarding/components/StepCompliance'
import { StepNetworks } from '@/components/features/doctor-onboarding/components/StepNetworks'
import { StepCptCodes } from '@/components/features/doctor-onboarding/components/StepCptCodes'
import { StepReview } from '@/components/features/doctor-onboarding/components/StepReview'
import {
  MOCK_DOCTOR_EMAIL,
  submitOnboarding,
} from '@/components/features/doctor-onboarding/onboardingService'
import {
  clearDraft,
  loadDraft,
  useDraftAutosave,
} from '@/components/features/doctor-onboarding/useOnboardingDraft'
import {
  onboardingSchema,
  STEP_KEYS,
  type DoctorOnboardingForm,
  type StepKey,
} from '@/components/features/doctor-onboarding/schema'
import { sameName } from '@/components/features/doctor-onboarding/validators'

const STEP_LABELS = ['Identidad', 'Credenciales', 'Compliance', 'Redes', 'Códigos CPT', 'Revisión'] as const
const REVIEW_STEP = STEP_KEYS.length

export default function MedicalFormPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [step, setStep] = useState(0)
  const [maxReached, setMaxReached] = useState(0)
  const headingRef = useRef<HTMLDivElement>(null)

  // TODO: el email saldrá del usuario autenticado en Firebase.
  const defaultValues = useMemo(() => loadDraft(MOCK_DOCTOR_EMAIL), [])
  const methods = useForm<DoctorOnboardingForm>({
    resolver: zodResolver(onboardingSchema),
    defaultValues,
    mode: 'onTouched',
    shouldUnregister: false,
  })
  const { trigger, setError, getValues, handleSubmit, watch } = methods

  useDraftAutosave(watch)

  useEffect(() => {
    headingRef.current?.focus()
  }, [step])

  const mutation = useMutation({
    mutationFn: submitOnboarding,
    onSuccess: () => {
      clearDraft()
      queryClient.setQueryData(['onboarding-status'], 'pending_verification')
      navigate(PATHS.onboarding.pending, { replace: true })
    },
  })

  const goTo = (index: number) => {
    setStep(index)
    setMaxReached((m) => Math.max(m, index))
  }

  const goNext = async () => {
    if (step >= REVIEW_STEP) return
    const key: StepKey = STEP_KEYS[step]
    const valid = await trigger(key, { shouldFocus: true })
    if (!valid) return

    // Comprobación cruzada entre bloques: la firma debe coincidir con el nombre legal.
    if (key === 'compliance') {
      const { identity, compliance } = getValues()
      if (!sameName(compliance.signatureName, identity.legalFullName)) {
        setError(
          'compliance.signatureName',
          { type: 'custom', message: 'La firma debe coincidir con tu nombre legal' },
          { shouldFocus: true },
        )
        return
      }
    }
    goTo(step + 1)
  }

  const goBack = () => setStep((s) => Math.max(0, s - 1))

  // Si al enviar queda algún bloque inválido, volvemos al primero con errores.
  const onInvalid = (errors: FieldErrors<DoctorOnboardingForm>) => {
    const first = STEP_KEYS.findIndex((k) => errors[k])
    if (first >= 0) setStep(first)
  }

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (step < REVIEW_STEP) {
      void goNext()
      return
    }
    void handleSubmit((data) => mutation.mutate(data), onInvalid)(event)
  }

  const isReview = step === REVIEW_STEP

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div ref={headingRef} tabIndex={-1} className="outline-none">
        <h2 className="text-2xl font-bold text-sc-text-primary">Ficha del médico</h2>
        <p className="mt-1 text-sm text-sc-text-secondary">
          La completas una sola vez. No podrás usar el portal hasta que verifiquemos tu matrícula.
        </p>
      </div>

      <StepIndicator steps={STEP_LABELS} current={step} maxReached={maxReached} onGoTo={goTo} />

      <FormProvider {...methods}>
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-8">
          {step === 0 && <StepIdentity />}
          {step === 1 && <StepCredentials />}
          {step === 2 && <StepCompliance />}
          {step === 3 && <StepNetworks />}
          {step === 4 && <StepCptCodes />}
          {isReview && <StepReview onEdit={goTo} />}

          {mutation.isError && (
            <p role="alert" className="rounded-sc-md bg-red-50 px-3 py-2 text-sm text-red-700">
              No pudimos enviar tu ficha. Revisa tu conexión e inténtalo de nuevo.
            </p>
          )}

          <div className="flex items-center justify-between border-t border-gray-200 pt-4">
            <button
              type="button"
              onClick={goBack}
              disabled={step === 0 || mutation.isPending}
              className="rounded-sc-md border border-gray-300 bg-white px-4 py-2 text-sm text-sc-text-primary hover:bg-sc-surface-hover disabled:invisible"
            >
              Atrás
            </button>
            {isReview ? (
              <button
                type="submit"
                disabled={mutation.isPending}
                className="rounded-sc-md bg-sc-teal px-5 py-2 text-sm font-semibold text-white hover:bg-sc-teal-dark disabled:opacity-60"
              >
                {mutation.isPending ? 'Enviando...' : 'Enviar ficha'}
              </button>
            ) : (
              <button
                type="submit"
                className="rounded-sc-md bg-sc-teal px-5 py-2 text-sm font-semibold text-white hover:bg-sc-teal-dark"
              >
                Siguiente
              </button>
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
