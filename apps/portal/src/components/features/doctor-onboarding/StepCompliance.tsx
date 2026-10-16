import { BAA_VERSION, DATA_USE_DECLARATION_VERSION, TOS_VERSION } from './constants'
import { CheckboxField, StepSection, TextField } from './FormField'

// TODO(legal): mostrar/enlazar el texto completo de cada documento cuando legal lo entregue.
// Hoy solo se muestra un resumen y la versión que quedará registrada junto con la firma.

export function StepCompliance() {
  return (
    <StepSection
      title="Compliance HIPAA"
      description="Necesitamos tu aceptación para tratar información de salud protegida (PHI) en el portal."
    >
      <div className="flex flex-col gap-4 rounded-sc-lg border border-gray-200 bg-white p-4">
        <CheckboxField
          name="compliance.baaAccepted"
          label="Acepto el Business Associate Agreement (BAA) de SugarCoach"
          hint={`Versión ${BAA_VERSION}`}
        />
        <CheckboxField
          name="compliance.legitimateUseDeclared"
          label="Declaro que usaré los datos de salud solo con fines legítimos de atención médica"
          hint={`Versión ${DATA_USE_DECLARATION_VERSION}`}
        />
        <CheckboxField
          name="compliance.tosAccepted"
          label="Acepto los Términos de Servicio del portal"
          hint={`Versión ${TOS_VERSION}`}
        />
      </div>

      <TextField
        name="compliance.signatureName"
        label="Firma (escribe tu nombre legal)"
        autoComplete="off"
        hint="Debe coincidir con el nombre legal del paso 1."
        required
      />

      <p className="rounded-sc-md bg-sc-teal-light px-3 py-2 text-xs text-sc-teal-dark">
        La fecha y la dirección IP de la firma se registran automáticamente al enviar la ficha.
      </p>
    </StepSection>
  )
}
