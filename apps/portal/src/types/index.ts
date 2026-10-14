export interface Patient {
  id: string
  name: string
  age: number
  diabetesType: 'T1' | 'T2'
  lastSync: Date
  currentGlucose: number
  avatar?: string
}

export interface GlucoseMeasurement {
  id: string
  value: number
  unit: 'mg/dL'
  timestamp: Date
  carbs?: number
  insulin?: number
  mood?: string
  activity?: string
}

export interface PatientTreatment {
  insulinBasal: {
    name: string
    dose: number
    schedule: string[]
  }
  insulinCorrection: {
    formula: string
  }
  thresholds: {
    hypo: number
    hyper: number
  }
  targets: {
    min: number
    max: number
  }
  notes: string
}

export interface PatientProfile {
  name: string
  email: string
  birthDate: Date
  diabetesType: 'T1' | 'T2'
  diagnosisDate: Date
  doctor: string
}

export type TabType = 'dashboard' | 'history' | 'stats' | 'treatment' | 'profile'

export interface DoctorUser {
  id: string
  name: string
  specialty: string
  verified: boolean
  avatar?: string
}
