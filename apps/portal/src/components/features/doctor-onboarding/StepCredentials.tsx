import { useFormContext } from 'react-hook-form'
import { OTHER_SPECIALTY, SPECIALTIES, US_STATES } from './constants'
import type { DoctorOnboardingForm } from './schema'
import { AddressFields } from './AddressFields'
import { FieldGroupError, SelectField, StepSection, TextField } from './FormField'

const STATE_OPTIONS = US_STATES.map((s) => ({ value: s.code, label: `${s.name} (${s.code})` }))

export function StepCredentials() {
  const { register, watch } = useFormContext<DoctorOnboardingForm>()
  const specialty = watch('credentials.primarySpecialty')

  return (
    <StepSection
      title="Credenciales médicas"
      description="Verificaremos tu NPI en el NPI Registry (NPPES) de CMS.gov antes de habilitar el portal."
    >
      <TextField
        name="credentials.npi"
        label="Número de matrícula (NPI)"
        inputMode="numeric"
        maxLength={10}
        hint="10 dígitos."
        required
      />
      <SelectField name="credentials.licenseState" label="Estado de licenciatura" options={STATE_OPTIONS} required />

      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-medium text-sc-text-primary">
          Estado(s) donde ejerces<span aria-hidden="true" className="text-red-500"> *</span>
        </legend>
        <div className="grid max-h-48 grid-cols-2 gap-x-4 gap-y-1 overflow-y-auto rounded-sc-md border border-gray-300 bg-white p-3 sm:grid-cols-3">
          {US_STATES.map((s) => (
            <label key={s.code} className="flex cursor-pointer items-center gap-2 text-sm text-sc-text-primary">
              <input
                type="checkbox"
                value={s.code}
                className="h-4 w-4 rounded border-gray-300 accent-sc-teal"
                {...register('credentials.practiceStates')}
              />
              {s.name}
            </label>
          ))}
        </div>
        <FieldGroupError name="credentials.practiceStates" />
      </fieldset>

      <SelectField name="credentials.primarySpecialty" label="Especialidad primaria" options={SPECIALTIES} required />
      {specialty === OTHER_SPECIALTY && (
        <TextField name="credentials.primarySpecialtyOther" label="¿Cuál especialidad?" required />
      )}
      <TextField name="credentials.subspecialty" label="Subespecialidad (opcional)" />
      <TextField name="credentials.practiceName" label="Nombre de la práctica / clínica" autoComplete="organization" required />
      <AddressFields prefix="credentials.officeAddress" legend="Dirección del consultorio" />
    </StepSection>
  )
}
