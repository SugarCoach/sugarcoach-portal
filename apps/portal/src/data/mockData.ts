import { Patient, GlucoseMeasurement, PatientTreatment, PatientProfile, DoctorUser } from '../types'

export const mockDoctor: DoctorUser = {
  id: 'doc-1',
  name: 'Dra. Ana García',
  specialty: 'Endocrinóloga',
  verified: true,
  avatar: 'AG',
}

export const mockPatients: Patient[] = [
  {
    id: 'patient-1',
    name: 'Carlos Rodríguez',
    age: 52,
    diabetesType: 'T2',
    lastSync: new Date(Date.now() - 5 * 60000), // 5 min ago
    currentGlucose: 142,
    avatar: 'CR',
  },
  {
    id: 'patient-2',
    name: 'María López',
    age: 34,
    diabetesType: 'T1',
    lastSync: new Date(Date.now() - 2 * 3600000), // 2 hours ago
    currentGlucose: 68,
    avatar: 'ML',
  },
  {
    id: 'patient-3',
    name: 'Jorge Martínez',
    age: 67,
    diabetesType: 'T2',
    lastSync: new Date(Date.now() - 24 * 3600000), // 1 day ago
    currentGlucose: 210,
    avatar: 'JM',
  },
  {
    id: 'patient-4',
    name: 'Sofía Fernández',
    age: 28,
    diabetesType: 'T1',
    lastSync: new Date(Date.now() - 20 * 60000), // 20 min ago
    currentGlucose: 95,
    avatar: 'SF',
  },
]

// Mock glucose measurements for Carlos Rodríguez (default selected patient)
export const mockGlucoseMeasurements: GlucoseMeasurement[] = [
  // Today
  {
    id: 'meas-1',
    value: 145,
    unit: 'mg/dL',
    timestamp: new Date(Date.now() - 30 * 60000),
    carbs: 45,
    insulin: 8,
    mood: 'bien',
    activity: 'caminata 30min',
  },
  {
    id: 'meas-2',
    value: 138,
    unit: 'mg/dL',
    timestamp: new Date(Date.now() - 90 * 60000),
    carbs: 30,
    insulin: 6,
    mood: 'normal',
  },
  {
    id: 'meas-3',
    value: 142,
    unit: 'mg/dL',
    timestamp: new Date(Date.now() - 150 * 60000),
    carbs: 50,
    insulin: 9,
    mood: 'bien',
    activity: 'trabajo',
  },
  {
    id: 'meas-4',
    value: 135,
    unit: 'mg/dL',
    timestamp: new Date(Date.now() - 240 * 60000),
    carbs: 40,
    insulin: 7,
  },
  // Yesterday
  {
    id: 'meas-5',
    value: 152,
    unit: 'mg/dL',
    timestamp: new Date(Date.now() - 24 * 3600000 - 30 * 60000),
    carbs: 55,
    insulin: 10,
    mood: 'cansado',
  },
  {
    id: 'meas-6',
    value: 128,
    unit: 'mg/dL',
    timestamp: new Date(Date.now() - 24 * 3600000 - 120 * 60000),
    carbs: 35,
    insulin: 6,
  },
  {
    id: 'meas-7',
    value: 140,
    unit: 'mg/dL',
    timestamp: new Date(Date.now() - 24 * 3600000 - 240 * 60000),
    carbs: 45,
    insulin: 8,
    activity: 'gym',
  },
  {
    id: 'meas-8',
    value: 145,
    unit: 'mg/dL',
    timestamp: new Date(Date.now() - 24 * 3600000 - 360 * 60000),
    carbs: 50,
    insulin: 9,
  },
  // Day before yesterday
  {
    id: 'meas-9',
    value: 148,
    unit: 'mg/dL',
    timestamp: new Date(Date.now() - 48 * 3600000 - 30 * 60000),
    carbs: 60,
    insulin: 11,
    mood: 'estresado',
  },
  {
    id: 'meas-10',
    value: 132,
    unit: 'mg/dL',
    timestamp: new Date(Date.now() - 48 * 3600000 - 120 * 60000),
    carbs: 38,
    insulin: 6,
  },
  {
    id: 'meas-11',
    value: 143,
    unit: 'mg/dL',
    timestamp: new Date(Date.now() - 48 * 3600000 - 240 * 60000),
    carbs: 48,
    insulin: 8,
    activity: 'caminata',
  },
  {
    id: 'meas-12',
    value: 139,
    unit: 'mg/dL',
    timestamp: new Date(Date.now() - 48 * 3600000 - 360 * 60000),
    carbs: 42,
    insulin: 7,
  },
]

export const mockPatientTreatment: PatientTreatment = {
  insulinBasal: {
    name: 'Lantus',
    dose: 20,
    schedule: ['08:00', '20:00'],
  },
  insulinCorrection: {
    formula: '1 unidad cada 15 mg/dL arriba de 150',
  },
  thresholds: {
    hypo: 70,
    hyper: 180,
  },
  targets: {
    min: 100,
    max: 160,
  },
  notes:
    'Ajustar basal según actividad física. Monitorear cambios en el apetito.',
}

export const mockPatientProfile: PatientProfile = {
  name: 'Carlos Rodríguez',
  email: 'carlos.rodriguez@email.com',
  birthDate: new Date('1971-03-15'),
  diabetesType: 'T2',
  diagnosisDate: new Date('2010-06-20'),
  doctor: 'Dra. Ana García',
}

// Generate chart data for last 7 days
export const generateGlucoseChartData = () => {
  const data = []
  const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
  const today = new Date()

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    data.push({
      date: days[date.getDay()],
      value: Math.round(Math.random() * 80 + 100), // 100-180
      fullDate: date.toLocaleDateString(),
    })
  }
  return data
}

export const glucoseChartData = generateGlucoseChartData()

// Get time ago string
export const getTimeAgo = (date: Date): string => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)

  if (seconds < 60) return 'Ahora'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `Hace ${minutes}min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `Hace ${hours}h`
  const days = Math.floor(hours / 24)
  if (days === 1) return 'Ayer'
  return `Hace ${days} días`
}

// Glucose status helper
export const getGlucoseStatus = (value: number) => {
  if (value < 70) return { status: 'hipoglucemia', color: 'glucose-hypo', bg: 'bg-red-50' }
  if (value > 180) return { status: 'hiperglucemia', color: 'glucose-hyper', bg: 'bg-yellow-50' }
  return { status: 'en rango', color: 'glucose-normal', bg: 'bg-teal-50' }
}
