import { glucoseColors } from '@sugarcoach/design-tokens'

interface DashboardProps {
  doctorName?: string
  onLogout?: () => void
}

export function Dashboard({ doctorName = 'Dr. Médico', onLogout }: DashboardProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <header className="bg-slate-900/50 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">SugarCoach</h1>
            <p className="text-white/60 text-sm">Portal para Médicos</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-white">{doctorName}</span>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Glucose Status Cards */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6">
            <div className="text-white/60 text-sm mb-2">Hipoglucemia</div>
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: glucoseColors.hypo }}
              />
              <span className="text-2xl font-bold text-white">-</span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6">
            <div className="text-white/60 text-sm mb-2">Rango Normal</div>
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: glucoseColors.normal }}
              />
              <span className="text-2xl font-bold text-white">-</span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6">
            <div className="text-white/60 text-sm mb-2">Hiperglucemia</div>
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: glucoseColors.hyper }}
              />
              <span className="text-2xl font-bold text-white">-</span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6">
            <div className="text-white/60 text-sm mb-2">Alerta</div>
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: glucoseColors.warning }}
              />
              <span className="text-2xl font-bold text-white">-</span>
            </div>
          </div>
        </div>

        {/* Empty State */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-8 text-center">
          <div className="text-white/60 mb-4">
            <svg
              className="w-16 h-16 mx-auto mb-4 opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">
            Bienvenido al Portal
          </h2>
          <p className="text-white/60">
            Aquí aparecerán los datos de tus pacientes cuando se conecten.
          </p>
        </div>
      </main>
    </div>
  )
}
