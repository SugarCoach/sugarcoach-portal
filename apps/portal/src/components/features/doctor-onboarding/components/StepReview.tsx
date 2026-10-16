import type { ReactNode } from 'react'
import { useFormContext } from 'react-hook-form'
import { CPT_CODES, PRACTICE_TYPES, PRIVATE_PAYERS, SPECIALTIES, US_STATES } from '../constants'
import type { DoctorOnboardingForm } from '../schema'
import { StepSection } from './FormField'

const stateName = (code: string) => US_STATES.find((s) => s.code === code)?.name ?? code

function Block({ title, onEdit, children }: { title: string; onEdit: () => void; children: ReactNode }) {
  return (
    <div className="rounded-sc-lg border border-gray-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-sc-text-primary">{title}</h4>
        <button type="button" onClick={onEdit} className="text-sm text-sc-teal-dark hover:underline">
          Editar
        </button>
      </div>
      <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">{children}</dl>
    </div>
  )
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <dt className="text-xs text-sc-text-secondary">{label}</dt>
      <dd className="text-sc-text-primary">{value || '—'}</dd>
    </div>
  )
}

const addr = (a: { street: string; city: string; state: string; zip: string }) =>
  `${a.street}, ${a.city}, ${a.state} ${a.zip}`

export function StepReview({ onEdit }: { onEdit: (stepIndex: number) => void }) {
  const { getValues } = useFormContext<DoctorOnboardingForm>()
  const v = getValues()

  const specialty =
    v.credentials.primarySpecialty === 'other'
      ? v.credentials.primarySpecialtyOther
      : SPECIALTIES.find((s) => s.value === v.credentials.primarySpecialty)?.label

  const payers = [
    v.networks.medicare.enrolled && `Medicare (${v.networks.medicare.providerNumber})`,
    v.networks.medicaid.enrolled &&
      `Medicaid ${v.networks.medicaid.state} (${v.networks.medicaid.providerNumber})`,
    ...PRIVATE_PAYERS.filter((p) => v.networks.privatePayers[p.id].enabled).map(
      (p) => `${p.label} (${v.networks.privatePayers[p.id].providerNumber})`,
    ),
    ...v.networks.otherNetworks.map((n) => (n.providerNumber ? `${n.name} (${n.providerNumber})` : n.name)),
  ].filter(Boolean)

  return (
    <StepSection
      title="Revisa y envía"
      description="Verifica tus datos. Al enviar, el equipo de SugarCoach validará tu NPI en NPPES (objetivo: 1 día hábil)."
    >
      <Block title="1. Identidad personal" onEdit={() => onEdit(0)}>
        <Row label="Nombre legal" value={v.identity.legalFullName} />
        <Row label="Fecha de nacimiento" value={v.identity.dateOfBirth} />
        <Row label="Dirección" value={addr(v.identity.homeAddress)} />
        <Row label="Teléfono" value={v.identity.personalPhone} />
        <Row label="Email" value={v.identity.email} />
      </Block>

      <Block title="2. Credenciales médicas" onEdit={() => onEdit(1)}>
        <Row label="NPI" value={v.credentials.npi} />
        <Row label="Licencia en" value={stateName(v.credentials.licenseState)} />
        <Row label="Ejerce en" value={v.credentials.practiceStates.join(', ')} />
        <Row label="Especialidad" value={specialty} />
        <Row label="Subespecialidad" value={v.credentials.subspecialty} />
        <Row label="Práctica / clínica" value={v.credentials.practiceName} />
        <Row label="Consultorio" value={addr(v.credentials.officeAddress)} />
      </Block>

      <Block title="3. Compliance HIPAA" onEdit={() => onEdit(2)}>
        <Row label="BAA, uso legítimo y Términos" value="Aceptados" />
        <Row label="Firma" value={v.compliance.signatureName} />
      </Block>

      <Block title="4. Redes y aseguradoras" onEdit={() => onEdit(3)}>
        <Row
          label="Tipo de práctica"
          value={
            v.networks.practiceType === 'other'
              ? v.networks.practiceTypeOther
              : PRACTICE_TYPES.find((t) => t.value === v.networks.practiceType)?.label
          }
        />
        <Row label="EIN" value={v.networks.ein} />
        <Row label="Pagadoras" value={payers.length ? payers.join(' · ') : 'Ninguna'} />
      </Block>

      <Block title="5. Códigos CPT" onEdit={() => onEdit(4)}>
        <Row
          label="Códigos activos"
          value={v.cpt.activeCptCodes
            .map((code) => CPT_CODES.find((c) => c.code === code)?.code ?? code)
            .join(', ')}
        />
      </Block>
    </StepSection>
  )
}
