import { z } from 'zod'
import { OTHER_SPECIALTY, PRACTICE_TYPES, PRIVATE_PAYERS, US_STATES } from './constants'
import { isAdult, isValidEin, isValidNpi, isValidUsPhone, isValidZip, sameName } from './validators'

// Cada bloque es su propio z.object (con sus refinamientos) para que la validación
// cruzada de un bloque corra aunque los demás bloques todavía estén vacíos.

const stateCode = z
  .string()
  .refine((v) => US_STATES.some((s) => s.code === v), 'Selecciona un estado')

const required = (msg: string) => z.string().trim().min(1, msg)

const addressSchema = z.object({
  street: required('Ingresa la dirección'),
  city: required('Ingresa la ciudad'),
  state: stateCode,
  zip: z.string().trim().refine(isValidZip, 'ZIP inválido (12345 o 12345-6789)'),
})

const mustBeTrue = (msg: string) => z.boolean().refine((v) => v === true, msg)

// ---------- Bloque 1 — Identidad personal ----------
export const identitySchema = z.object({
  legalFullName: required('Ingresa tu nombre completo legal'),
  dateOfBirth: z
    .string()
    .min(1, 'Ingresa tu fecha de nacimiento')
    .refine((v) => isAdult(v), 'Debes ser mayor de 18 años'),
  homeAddress: addressSchema,
  personalPhone: z.string().trim().refine(isValidUsPhone, 'Teléfono inválido (10 dígitos)'),
  // Solo lectura: viene del usuario autenticado en Firebase.
  email: z.string().email('Email inválido'),
})

// ---------- Bloque 2 — Credenciales médicas ----------
export const credentialsSchema = z
  .object({
    npi: z.string().trim().refine(isValidNpi, 'NPI inválido (10 dígitos con dígito verificador)'),
    licenseState: stateCode,
    practiceStates: z.array(z.string()).min(1, 'Selecciona al menos un estado'),
    primarySpecialty: required('Selecciona tu especialidad'),
    primarySpecialtyOther: z.string().trim(),
    subspecialty: z.string().trim(),
    practiceName: required('Ingresa el nombre de la práctica o clínica'),
    officeAddress: addressSchema,
  })
  .superRefine((v, ctx) => {
    if (v.primarySpecialty === OTHER_SPECIALTY && !v.primarySpecialtyOther) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['primarySpecialtyOther'],
        message: 'Indica tu especialidad',
      })
    }
  })

// ---------- Bloque 3 — Compliance HIPAA ----------
export const complianceSchema = z.object({
  baaAccepted: mustBeTrue('Debes aceptar el Business Associate Agreement'),
  legitimateUseDeclared: mustBeTrue('Debes aceptar la declaración de uso legítimo de datos'),
  tosAccepted: mustBeTrue('Debes aceptar los Términos de Servicio'),
  signatureName: required('Escribe tu nombre legal para firmar'),
})

// ---------- Bloque 4 — Redes de salud y aseguradoras ----------
const payerEntrySchema = z.object({
  enabled: z.boolean(),
  providerNumber: z.string().trim(),
})

const privatePayersShape = Object.fromEntries(
  PRIVATE_PAYERS.map((p) => [p.id, payerEntrySchema]),
) as Record<(typeof PRIVATE_PAYERS)[number]['id'], typeof payerEntrySchema>

export const networksSchema = z
  .object({
    practiceType: z.enum(PRACTICE_TYPES.map((t) => t.value) as [string, ...string[]], {
      errorMap: () => ({ message: 'Selecciona el tipo de práctica' }),
    }),
    practiceTypeOther: z.string().trim(),
    medicare: z.object({ enrolled: z.boolean(), providerNumber: z.string().trim() }),
    medicaid: z.object({
      enrolled: z.boolean(),
      state: z.string(),
      providerNumber: z.string().trim(),
    }),
    privatePayers: z.object(privatePayersShape),
    otherNetworks: z.array(
      z.object({
        name: required('Ingresa el nombre de la red'),
        providerNumber: z.string().trim(),
      }),
    ),
    ein: z.string().trim().refine(isValidEin, 'EIN inválido (formato XX-XXXXXXX)'),
  })
  .superRefine((v, ctx) => {
    const missing = (path: (string | number)[], message: string) =>
      ctx.addIssue({ code: z.ZodIssueCode.custom, path, message })

    if (v.practiceType === 'other' && !v.practiceTypeOther) {
      missing(['practiceTypeOther'], 'Describe el tipo de práctica')
    }
    if (v.medicare.enrolled && !v.medicare.providerNumber) {
      missing(['medicare', 'providerNumber'], 'Ingresa el número de provider de Medicare')
    }
    if (v.medicaid.enrolled) {
      if (!US_STATES.some((s) => s.code === v.medicaid.state)) {
        missing(['medicaid', 'state'], 'Selecciona el estado de Medicaid')
      }
      if (!v.medicaid.providerNumber) {
        missing(['medicaid', 'providerNumber'], 'Ingresa el número de provider de Medicaid')
      }
    }
    for (const payer of PRIVATE_PAYERS) {
      const entry = v.privatePayers[payer.id]
      if (entry.enabled && !entry.providerNumber) {
        missing(['privatePayers', payer.id, 'providerNumber'], `Ingresa el número de provider de ${payer.label}`)
      }
    }
  })

// ---------- Bloque 5 — Códigos de reembolso activos ----------
export const cptSchema = z.object({
  activeCptCodes: z.array(z.string()).min(1, 'Selecciona al menos un código CPT'),
})

// ---------- Formulario completo ----------
export const onboardingSchema = z
  .object({
    identity: identitySchema,
    credentials: credentialsSchema,
    compliance: complianceSchema,
    networks: networksSchema,
    cpt: cptSchema,
  })
  .superRefine((v, ctx) => {
    // Red de seguridad al enviar; en el wizard el paso 3 hace la misma comprobación.
    if (!sameName(v.compliance.signatureName, v.identity.legalFullName)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['compliance', 'signatureName'],
        message: 'La firma debe coincidir con tu nombre legal',
      })
    }
  })

export type DoctorOnboardingForm = z.infer<typeof onboardingSchema>

export const STEP_KEYS = ['identity', 'credentials', 'compliance', 'networks', 'cpt'] as const
export type StepKey = (typeof STEP_KEYS)[number]

const emptyAddress = { street: '', city: '', state: '', zip: '' }

export function emptyOnboardingForm(email: string): DoctorOnboardingForm {
  return {
    identity: {
      legalFullName: '',
      dateOfBirth: '',
      homeAddress: { ...emptyAddress },
      personalPhone: '',
      email,
    },
    credentials: {
      npi: '',
      licenseState: '',
      practiceStates: [],
      primarySpecialty: '',
      primarySpecialtyOther: '',
      subspecialty: '',
      practiceName: '',
      officeAddress: { ...emptyAddress },
    },
    compliance: {
      baaAccepted: false,
      legitimateUseDeclared: false,
      tosAccepted: false,
      signatureName: '',
    },
    networks: {
      practiceType: '' as DoctorOnboardingForm['networks']['practiceType'],
      practiceTypeOther: '',
      medicare: { enrolled: false, providerNumber: '' },
      medicaid: { enrolled: false, state: '', providerNumber: '' },
      privatePayers: Object.fromEntries(
        PRIVATE_PAYERS.map((p) => [p.id, { enabled: false, providerNumber: '' }]),
      ) as DoctorOnboardingForm['networks']['privatePayers'],
      otherNetworks: [],
      ein: '',
    },
    cpt: { activeCptCodes: [] },
  }
}
