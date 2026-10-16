import { useFormContext } from 'react-hook-form'
import { CPT_CODES } from '../constants'
import type { DoctorOnboardingForm } from '../schema'
import { FieldGroupError, StepSection } from './FormField'

export function StepCptCodes() {
  const { register } = useFormContext<DoctorOnboardingForm>()

  return (
    <StepSection
      title="Códigos de reembolso activos"
      description='Elige los códigos CPT que usas. Solo recibirás alertas de la pestaña "Reembolso" para los códigos seleccionados.'
    >
      <fieldset className="flex flex-col gap-3">
        <legend className="sr-only">Códigos CPT a seguir</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {CPT_CODES.map((c) => (
            <label
              key={c.code}
              className="flex cursor-pointer items-start gap-3 rounded-sc-lg border border-gray-200 bg-white p-4 has-[:checked]:border-sc-teal has-[:checked]:bg-sc-teal-light"
            >
              <input
                type="checkbox"
                value={c.code}
                className="mt-1 h-4 w-4 rounded border-gray-300 accent-sc-teal"
                {...register('cpt.activeCptCodes')}
              />
              <span className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold text-sc-text-primary">CPT {c.code}</span>
                <span className="text-sm text-sc-text-secondary">{c.description}</span>
                <span className="text-xs text-sc-text-muted">Mínimo: {c.minimum}</span>
              </span>
            </label>
          ))}
        </div>
        <FieldGroupError name="cpt.activeCptCodes" />
      </fieldset>
    </StepSection>
  )
}
