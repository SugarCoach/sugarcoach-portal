import { Patient } from '../../types'
import { glucoseChartData, mockGlucoseMeasurements, getGlucoseStatus } from '../../data/mockData'
import { Area, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface DashboardProps {
  patient: Patient
}

export default function Dashboard({ patient }: DashboardProps) {
  const status = getGlucoseStatus(patient.currentGlucose)
  const lastMeasurements = mockGlucoseMeasurements.slice(0, 7)
  const avgGlucose = Math.round(
    lastMeasurements.reduce((sum, m) => sum + m.value, 0) / lastMeasurements.length
  )
  const timeInRange = 72
  const avgCarbs = 185

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left: Glucose Ring */}
      <div className="bg-sc-surface rounded-sc-lg shadow-sc-subtle p-6 flex flex-col items-center">
        <div className="relative w-48 h-48 flex items-center justify-center">
          {/* SVG Ring */}
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {/* Background ring */}
            <circle
              cx="100"
              cy="100"
              r="85"
              fill="none"
              stroke="rgba(0,212,170,0.1)"
              strokeWidth="8"
            />
            {/* Progress ring */}
            <circle
              cx="100"
              cy="100"
              r="85"
              fill="none"
              stroke={
                status.color === 'glucose-hypo'
                  ? '#FF4757'
                  : status.color === 'glucose-hyper'
                    ? '#FFA502'
                    : '#00D4AA'
              }
              strokeWidth="8"
              strokeDasharray={`${(patient.currentGlucose / 300) * 534} 534`}
              strokeLinecap="round"
              transform="rotate(-90 100 100)"
            />
          </svg>

          {/* Center value */}
          <div className="absolute flex flex-col items-center">
            <div
              className="font-mono text-5xl font-bold"
              style={{
                color:
                  status.color === 'glucose-hypo'
                    ? '#FF4757'
                    : status.color === 'glucose-hyper'
                      ? '#FFA502'
                      : '#00D4AA',
              }}
            >
              {patient.currentGlucose}
            </div>
            <div className="text-xs text-sc-text-muted">mg/dL</div>
          </div>
        </div>

        {/* Status badge */}
        <div className={`mt-4 px-3 py-1 rounded-sc-full text-xs font-semibold ${status.bg}`}>
          <span
            style={{
              color:
                status.color === 'glucose-hypo'
                  ? '#FF4757'
                  : status.color === 'glucose-hyper'
                    ? '#FFA502'
                    : '#009E80',
            }}
          >
            {status.status.charAt(0).toUpperCase() + status.status.slice(1)}
          </span>
        </div>
      </div>

      {/* Right: Stat Cards */}
      <div className="flex flex-col gap-4">
        {/* Card 1: Average */}
        <div className="bg-sc-surface rounded-sc-lg shadow-sc-subtle p-4">
          <div className="text-xs uppercase text-sc-text-secondary font-semibold tracking-wide">
            Promedio Glucemia
          </div>
          <div className="mt-2 font-mono text-3xl font-bold text-sc-text-primary">
            {avgGlucose}
            <span className="text-sm text-sc-text-muted ml-1">mg/dL</span>
          </div>
          <div className="text-xs text-sc-text-muted">últimos 7 días</div>
        </div>

        {/* Card 2: Time in range */}
        <div className="bg-sc-surface rounded-sc-lg shadow-sc-subtle p-4">
          <div className="text-xs uppercase text-sc-text-secondary font-semibold tracking-wide">
            Tiempo en Rango
          </div>
          <div className="mt-2 font-mono text-3xl font-bold text-sc-text-primary">{timeInRange}%</div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-sc-teal h-2 rounded-full"
              style={{ width: `${timeInRange}%` }}
            ></div>
          </div>
        </div>

        {/* Card 3: Carbs */}
        <div className="bg-sc-surface rounded-sc-lg shadow-sc-subtle p-4">
          <div className="text-xs uppercase text-sc-text-secondary font-semibold tracking-wide">
            Carbohidratos
          </div>
          <div className="mt-2 font-mono text-3xl font-bold text-sc-text-primary">
            {avgCarbs}
            <span className="text-sm text-sc-text-muted ml-1">g</span>
          </div>
          <div className="text-xs text-sc-text-muted">promedio/día</div>
        </div>
      </div>

      {/* Full width chart */}
      <div className="lg:col-span-2 bg-sc-surface rounded-sc-lg shadow-sc-subtle p-6">
        <h3 className="text-sm font-semibold text-sc-text-primary mb-4">Glucemia — últimos 7 días</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={glucoseChartData}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00D4AA" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#00D4AA" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="0" stroke="rgba(0,0,0,0.04)" vertical={false} />
            <XAxis dataKey="date" stroke="#6B7280" style={{ fontSize: '12px' }} />
            <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFFFFF',
                border: '1px solid rgba(0,0,0,0.08)',
                borderRadius: '6px',
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#00D4AA"
              fill="url(#colorValue)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
