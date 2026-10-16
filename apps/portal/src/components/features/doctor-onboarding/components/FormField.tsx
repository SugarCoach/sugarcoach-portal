import type { InputHTMLAttributes, ReactNode } from 'react'
import { get, useFormContext, type FieldPath } from 'react-hook-form'
import type { DoctorOnboardingForm } from '../schema'

export type FieldName = FieldPath<DoctorOnboardingForm>

const inputClass =
  'w-full rounded-sc-md border border-gray-300 bg-white px-3 py-2 text-sm text-sc-text-primary ' +
  'placeholder:text-sc-text-muted focus:border-sc-teal focus:outline-none focus:ring-2 focus:ring-sc-teal/30 ' +
  'disabled:cursor-not-allowed disabled:bg-gray-100 aria-[invalid=true]:border-red-500'

const idOf = (name: string) => `f-${name.replace(/\./g, '-')}`

function useFieldError(name: FieldName): string | undefined {
  const {
    formState: { errors },
  } = useFormContext<DoctorOnboardingForm>()
  const error = get(errors, name) as { message?: string } | undefined
  return error?.message
}

interface FieldShellProps {
  name: FieldName
  label: string
  hint?: string
  required?: boolean
  error?: string
  children: ReactNode
}

function FieldShell({ name, label, hint, required, error, children }: FieldShellProps) {
  const id = idOf(name)
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-sc-text-primary">
        {label}
        {required && <span aria-hidden="true" className="text-red-500"> *</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-sc-text-secondary">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}

function describedBy(name: FieldName, hasHint: boolean, error?: string) {
  const id = idOf(name)
  if (error) return `${id}-error`
  return hasHint ? `${id}-hint` : undefined
}

interface TextFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'name' | 'id' | 'required'> {
  name: FieldName
  label: string
  hint?: string
  required?: boolean
}

export function TextField({ name, label, hint, required, ...inputProps }: TextFieldProps) {
  const { register } = useFormContext<DoctorOnboardingForm>()
  const error = useFieldError(name)
  return (
    <FieldShell name={name} label={label} hint={hint} required={required} error={error}>
      <input
        id={idOf(name)}
        className={inputClass}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(name, !!hint, error)}
        aria-required={required}
        {...inputProps}
        {...register(name)}
      />
    </FieldShell>
  )
}

interface SelectFieldProps {
  name: FieldName
  label: string
  options: ReadonlyArray<{ value: string; label: string }>
  placeholder?: string
  hint?: string
  required?: boolean
  disabled?: boolean
}

export function SelectField({
  name,
  label,
  options,
  placeholder = 'Selecciona...',
  hint,
  required,
  disabled,
}: SelectFieldProps) {
  const { register } = useFormContext<DoctorOnboardingForm>()
  const error = useFieldError(name)
  return (
    <FieldShell name={name} label={label} hint={hint} required={required} error={error}>
      <select
        id={idOf(name)}
        className={inputClass}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(name, !!hint, error)}
        aria-required={required}
        {...register(name)}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </FieldShell>
  )
}

interface CheckboxFieldProps {
  name: FieldName
  label: ReactNode
  hint?: string
}

export function CheckboxField({ name, label, hint }: CheckboxFieldProps) {
  const { register } = useFormContext<DoctorOnboardingForm>()
  const error = useFieldError(name)
  const id = idOf(name)
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="flex cursor-pointer items-start gap-2 text-sm text-sc-text-primary">
        <input
          id={id}
          type="checkbox"
          className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-sc-teal"
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(name, !!hint, error)}
          {...register(name)}
        />
        <span>{label}</span>
      </label>
      {hint && !error && (
        <p id={`${id}-hint`} className="ml-6 text-xs text-sc-text-secondary">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="ml-6 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}

export function StepSection({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-5">
      <header>
        <h3 className="text-lg font-semibold text-sc-text-primary">{title}</h3>
        {description && <p className="mt-1 text-sm text-sc-text-secondary">{description}</p>}
      </header>
      {children}
    </section>
  )
}

export function FieldGroupError({ name }: { name: FieldName }) {
  const error = useFieldError(name)
  if (!error) return null
  return (
    <p role="alert" className="text-xs text-red-600">
      {error}
    </p>
  )
}
