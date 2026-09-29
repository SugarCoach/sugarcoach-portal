import { glucoseColors, glassmorphismStyles } from '@sugarcoach/design-tokens'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <main className="container mx-auto px-4 py-20">
        <div className={`rounded-2xl p-8 ${glassmorphismStyles.combined}`}>
          <h1 className="text-4xl font-bold text-white mb-4">
            SugarCoach Portal
          </h1>
          <p className="text-white/80 mb-8">
            Doctor Portal for Managing Patient Glucose Data
          </p>

          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="p-4 rounded-lg" style={{ backgroundColor: glucoseColors.hypo }}>
              <p className="font-semibold">Hypoglycemia</p>
              <p className="text-sm">&lt; 70 mg/dL</p>
            </div>
            <div className="p-4 rounded-lg" style={{ backgroundColor: glucoseColors.normal }}>
              <p className="font-semibold">Normal</p>
              <p className="text-sm">70-180 mg/dL</p>
            </div>
            <div className="p-4 rounded-lg" style={{ backgroundColor: glucoseColors.hyper }}>
              <p className="font-semibold">Hyperglycemia</p>
              <p className="text-sm">&gt; 180 mg/dL</p>
            </div>
            <div className="p-4 rounded-lg" style={{ backgroundColor: glucoseColors.warning }}>
              <p className="font-semibold">Warning</p>
              <p className="text-sm">&gt; 250 mg/dL</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
