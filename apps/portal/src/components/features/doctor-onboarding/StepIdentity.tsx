import { AddressFields } from './AddressFields'
import { StepSection, TextField } from './FormField'

export function StepIdentity() {
  return (
    <StepSection
      title="Identidad personal"
      description="Tus datos personales legales. Solo se usan para verificar tu identidad profesional."
    >
      <TextField
        name="identity.legalFullName"
        label="Nombre completo legal"
        autoComplete="name"
        hint="Tal como figura en tu licencia médica."
        required
      />
      <TextField name="identity.dateOfBirth" label="Fecha de nacimiento" type="date" autoComplete="bday" required />
      <AddressFields prefix="identity.homeAddress" legend="Dirección particular" />
      <TextField
        name="identity.personalPhone"
        label="Teléfono personal"
        type="tel"
        autoComplete="tel"
        placeholder="(555) 123-4567"
        required
      />
      <TextField
        name="identity.email"
        label="Email"
        type="email"
        readOnly
        hint="Verificado por Firebase. Para cambiarlo, hazlo desde tu cuenta."
      />
    </StepSection>
  )
}
