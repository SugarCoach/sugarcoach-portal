import { mockGlucoseMeasurements, getGlucoseStatus } from '../../data/mockData'

export default function History() {
  const groupedByDate: { [key: string]: typeof mockGlucoseMeasurements } = {}

  mockGlucoseMeasurements.forEach((m) => {
    const dateKey = m.timestamp.toLocaleDateString('es-ES', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })
    if (!groupedByDate[dateKey]) groupedByDate[dateKey] = []
    groupedByDate[dateKey].push(m)
  })

  return (
    <div className="space-y-6">
      {Object.entries(groupedByDate).map(([dateKey, measurements]) => (
        <div key={dateKey}>
          {/* Date separator */}
          <div className="flex items-center gap-4 mb-3">
            <div className="flex-1 h-px bg-sc-border"></div>
            <span className="text-xs font-semibold text-sc-text-secondary">{dateKey}</span>
            <div className="flex-1 h-px bg-sc-border"></div>
          </div>

          {/* Measurements */}
          <div className="space-y-2">
            {measurements.map((m) => {
              const status = getGlucoseStatus(m.value)
              const borderColor =
                status.color === 'glucose-hypo'
                  ? 'border-l-red-500'
                  : status.color === 'glucose-hyper'
                    ? 'border-l-yellow-500'
                    : 'border-l-sc-teal'

              return (
                <div key={m.id} className={`bg-sc-surface rounded-sc-lg p-4 border-l-4 ${borderColor} shadow-sc-min`}>
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-xs text-sc-text-secondary font-mono">
                      {m.timestamp.toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                    <div className="font-mono text-2xl font-bold flex-1" style={{
                      color:
                        status.color === 'glucose-hypo'
                          ? '#FF4757'
                          : status.color === 'glucose-hyper'
                            ? '#FFA502'
                            : '#009E80',
                    }}>
                      {m.value}
                    </div>
                    <div className="flex gap-1 flex-wrap justify-end">
                      {m.carbs && (
                        <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-sc-md text-xs">
                          {m.carbs}g CHO
                        </span>
                      )}
                      {m.insulin && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-sc-md text-xs">
                          {m.insulin}U INS
                        </span>
                      )}
                      {m.mood && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-sc-md text-xs">
                          {m.mood}
                        </span>
                      )}
                      {m.activity && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-sc-md text-xs">
                          {m.activity}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
