// Catálogos y versiones legales de la ficha de alta del médico.

export const US_STATES: ReadonlyArray<{ code: string; name: string }> = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'DC', name: 'District of Columbia' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' },
]

export const OTHER_SPECIALTY = 'other'

export const SPECIALTIES: ReadonlyArray<{ value: string; label: string }> = [
  { value: 'endocrinology', label: 'Endocrinología' },
  { value: 'internal-medicine', label: 'Medicina interna' },
  { value: 'family-medicine', label: 'Medicina familiar' },
  { value: 'pediatrics', label: 'Pediatría' },
  { value: 'pediatric-endocrinology', label: 'Endocrinología pediátrica' },
  { value: 'nutrition', label: 'Nutrición' },
  { value: OTHER_SPECIALTY, label: 'Otra' },
]

export const PRACTICE_TYPES = [
  { value: 'private', label: 'Privada' },
  { value: 'group', label: 'Grupal' },
  { value: 'hospital', label: 'Hospital' },
  { value: 'fqhc', label: 'FQHC' },
  { value: 'other', label: 'Otro' },
] as const

export const PRIVATE_PAYERS = [
  { id: 'aetna', label: 'Aetna' },
  { id: 'blueCross', label: 'Blue Cross' },
  { id: 'cigna', label: 'Cigna' },
  { id: 'unitedHealth', label: 'UnitedHealth' },
  { id: 'humana', label: 'Humana' },
  { id: 'anthem', label: 'Anthem' },
] as const

// TODO(producto): catálogo inicial de CPT típicos de CGM/RPM en diabetes.
// Confirmar la lista y los mínimos con producto y alinearla con la pestaña "Reembolso".
export const CPT_CODES: ReadonlyArray<{ code: string; description: string; minimum: string }> = [
  { code: '95249', description: 'Colocación de CGM profesional y entrenamiento al paciente', minimum: '1 vez por período de 30 días' },
  { code: '95250', description: 'CGM profesional: registro y descarga de datos (mín. 72 h)', minimum: '72 h de datos' },
  { code: '95251', description: 'CGM: análisis e interpretación de los datos', minimum: '72 h de datos' },
  { code: '99091', description: 'Recolección y revisión de datos fisiológicos del paciente', minimum: '30 min por 30 días' },
  { code: '99453', description: 'RPM: alta del paciente y entrega del dispositivo', minimum: 'Una vez por episodio' },
  { code: '99454', description: 'RPM: suministro del dispositivo y transmisión de datos', minimum: '16 días de datos en 30 días' },
  { code: '99457', description: 'RPM: gestión del tratamiento, primeros 20 min', minimum: '20 min en el mes' },
  { code: '99458', description: 'RPM: gestión del tratamiento, cada 20 min adicionales', minimum: '20 min adicionales' },
]

// TODO(legal): reemplazar por el texto vigente y su versión cuando legal lo entregue.
export const BAA_VERSION = 'BAA-2026-01'
export const TOS_VERSION = 'TOS-2026-01'
export const DATA_USE_DECLARATION_VERSION = 'DUD-2026-01'

export const MAX_OTHER_NETWORKS = 10
