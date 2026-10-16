import type { DoctorOnboardingForm } from './schema'

// Solo desarrollo: rellena los inputs de texto con datos de prueba para no tipearlos
// en cada prueba. En el build de producción (import.meta.env.DEV === false) no hace nada.
// Los selects y checkboxes se dejan vacíos a propósito.

const SIGNER = 'Dra. María Pérez'

export function applyDevSample(form: DoctorOnboardingForm): DoctorOnboardingForm {
  if (!import.meta.env.DEV) return form

  return {
    ...form,
    identity: {
      ...form.identity,
      legalFullName: SIGNER,
      dateOfBirth: '1985-03-01',
      homeAddress: { ...form.identity.homeAddress, street: '1 Main St', city: 'Austin', zip: '78701' },
      personalPhone: '(555) 123-4567',
    },
    credentials: {
      ...form.credentials,
      npi: '1234567893',
      subspecialty: 'Diabetes tipo 1',
      practiceName: 'Austin Diabetes Clinic',
      officeAddress: { ...form.credentials.officeAddress, street: '9 Clinic Rd', city: 'Austin', zip: '78702' },
    },
    compliance: {
      ...form.compliance,
      signatureName: SIGNER, // debe coincidir con identity.legalFullName
    },
    networks: {
      ...form.networks,
      medicare: { ...form.networks.medicare, providerNumber: 'MC-123456' },
      medicaid: { ...form.networks.medicaid, providerNumber: 'MD-654321' },
      privatePayers: {
        aetna: { ...form.networks.privatePayers.aetna, providerNumber: 'AET-1001' },
        blueCross: { ...form.networks.privatePayers.blueCross, providerNumber: 'BC-1002' },
        cigna: { ...form.networks.privatePayers.cigna, providerNumber: 'CIG-1003' },
        unitedHealth: { ...form.networks.privatePayers.unitedHealth, providerNumber: 'UHC-1004' },
        humana: { ...form.networks.privatePayers.humana, providerNumber: 'HUM-1005' },
        anthem: { ...form.networks.privatePayers.anthem, providerNumber: 'ANT-1006' },
      },
      ein: '12-3456789',
    },
  }
}
