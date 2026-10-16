import { SelectField, TextField, type FieldName } from './FormField'
import { US_STATES } from '../constants'

const STATE_OPTIONS = US_STATES.map((s) => ({ value: s.code, label: `${s.name} (${s.code})` }))

interface AddressFieldsProps {
  prefix: 'identity.homeAddress' | 'credentials.officeAddress'
  legend: string
}

export function AddressFields({ prefix, legend }: AddressFieldsProps) {
  const f = (key: 'street' | 'city' | 'state' | 'zip') => `${prefix}.${key}` as FieldName
  return (
    <fieldset className="flex flex-col gap-4">
      <legend className="mb-1 text-sm font-medium text-sc-text-primary">{legend}</legend>
      <TextField name={f('street')} label="Calle y número" autoComplete="street-address" required />
      <div className="grid gap-4 sm:grid-cols-3">
        <TextField name={f('city')} label="Ciudad" required />
        <SelectField name={f('state')} label="Estado" options={STATE_OPTIONS} required />
        <TextField name={f('zip')} label="ZIP" inputMode="numeric" autoComplete="postal-code" required />
      </div>
    </fieldset>
  )
}
