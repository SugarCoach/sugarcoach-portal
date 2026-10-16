import { useFieldArray, useFormContext } from 'react-hook-form'
import { MAX_OTHER_NETWORKS, PRACTICE_TYPES, PRIVATE_PAYERS, US_STATES } from '../constants'
import type { DoctorOnboardingForm } from '../schema'
import { CheckboxField, SelectField, StepSection, TextField } from './FormField'

const STATE_OPTIONS = US_STATES.map((s) => ({ value: s.code, label: `${s.name} (${s.code})` }))

export function StepNetworks() {
  const { control, watch } = useFormContext<DoctorOnboardingForm>()
  const { fields, append, remove } = useFieldArray({ control, name: 'networks.otherNetworks' })

  const practiceType = watch('networks.practiceType')
  const medicareEnrolled = watch('networks.medicare.enrolled')
  const medicaidEnrolled = watch('networks.medicaid.enrolled')

  return (
    <StepSection
      title="Redes de salud y aseguradoras"
      description="Indica con qué pagadoras trabajas. Los números de provider se usan para el seguimiento de reembolsos."
    >
      <SelectField
        name="networks.practiceType"
        label="Tipo de práctica"
        options={PRACTICE_TYPES}
        required
      />
      {practiceType === 'other' && (
        <TextField name="networks.practiceTypeOther" label="Describe el tipo de práctica" required />
      )}

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-1 text-sm font-medium text-sc-text-primary">Redes / pagadoras</legend>

        <div className="flex flex-col gap-3 rounded-sc-lg border border-gray-200 bg-white p-4">
          <CheckboxField name="networks.medicare.enrolled" label="Medicare" />
          {medicareEnrolled && (
            <TextField name="networks.medicare.providerNumber" label="Número de provider (Medicare)" required />
          )}
        </div>

        <div className="flex flex-col gap-3 rounded-sc-lg border border-gray-200 bg-white p-4">
          <CheckboxField name="networks.medicaid.enrolled" label="Medicaid" />
          {medicaidEnrolled && (
            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField name="networks.medicaid.state" label="Estado de Medicaid" options={STATE_OPTIONS} required />
              <TextField name="networks.medicaid.providerNumber" label="Número de provider (Medicaid)" required />
            </div>
          )}
        </div>

        {PRIVATE_PAYERS.map((payer) => (
          <PayerRow key={payer.id} id={payer.id} label={payer.label} />
        ))}
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-1 text-sm font-medium text-sc-text-primary">Otras redes</legend>
        {fields.map((field, index) => (
          <div key={field.id} className="grid items-end gap-3 sm:grid-cols-[1fr_1fr_auto]">
            <TextField name={`networks.otherNetworks.${index}.name`} label="Nombre de la red" required />
            <TextField name={`networks.otherNetworks.${index}.providerNumber`} label="Número de provider" />
            <button
              type="button"
              onClick={() => remove(index)}
              className="rounded-sc-md px-3 py-2 text-sm text-red-600 hover:bg-red-50"
              aria-label={`Quitar red ${index + 1}`}
            >
              Quitar
            </button>
          </div>
        ))}
        {fields.length < MAX_OTHER_NETWORKS && (
          <button
            type="button"
            onClick={() => append({ name: '', providerNumber: '' })}
            className="self-start rounded-sc-md border border-gray-300 bg-white px-3 py-2 text-sm text-sc-text-primary hover:bg-sc-surface-hover"
          >
            + Agregar otra red
          </button>
        )}
      </fieldset>

      <TextField
        name="networks.ein"
        label="Tax ID del consultorio (EIN)"
        placeholder="12-3456789"
        inputMode="numeric"
        maxLength={10}
        hint="Se usa para la facturación de reembolsos."
        required
      />
    </StepSection>
  )
}

function PayerRow({ id, label }: { id: (typeof PRIVATE_PAYERS)[number]['id']; label: string }) {
  const { watch } = useFormContext<DoctorOnboardingForm>()
  const enabled = watch(`networks.privatePayers.${id}.enabled`)
  return (
    <div className="flex flex-col gap-3 rounded-sc-lg border border-gray-200 bg-white p-4">
      <CheckboxField name={`networks.privatePayers.${id}.enabled`} label={label} />
      {enabled && (
        <TextField
          name={`networks.privatePayers.${id}.providerNumber`}
          label={`Número de provider (${label})`}
          required
        />
      )}
    </div>
  )
}
