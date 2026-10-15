import { useState } from 'react'

type PlanId = 'starter' | 'growth' | 'pro'

interface Plan {
  id: PlanId
  name: string
  price: number
  recommended?: boolean
}

const plans: Plan[] = [
  { id: 'starter', name: 'Starter', price: 50 },
  { id: 'growth', name: 'Growth', price: 75 },
  { id: 'pro', name: 'Pro', price: 100, recommended: true },
]

interface PlanSelectionProps {
  onBack: () => void
}

export default function PlanSelection({ onBack }: PlanSelectionProps) {
  const [selectedPlan, setSelectedPlan] = useState<PlanId>('pro')

  return (
    <div className="relative flex-1 overflow-y-auto bg-sc-bg">
      {/* Fondo superior en diagonal */}
      <div
        className="absolute inset-x-0 top-0 h-72 bg-gradient-to-r from-sc-teal-dark to-sc-teal"
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 55%, 0 100%)' }}
      />

      <div className="relative max-w-xl mx-auto px-4 py-10">
        <button
          type="button"
          onClick={onBack}
          className="mb-6 text-sm font-medium text-white/90 hover:text-white"
        >
          ← Volver al portal
        </button>

        <div className="bg-sc-surface rounded-sc-lg shadow-sc-subtle p-6">
          <h1 className="text-xl font-semibold text-sc-text-primary">Selección de Plan y Pago</h1>
          <p className="text-sm text-sc-text-secondary mt-1 mb-5">
            Elegí el plan que mejor se adapte a tu práctica
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
            {plans.map((plan) => {
              const isSelected = plan.id === selectedPlan
              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`relative text-left p-4 rounded-sc-lg border transition-colors ${
                    isSelected
                      ? 'border-sc-teal bg-sc-teal-light'
                      : 'border-sc-border hover:bg-sc-surface-hover'
                  }`}
                >
                  {isSelected && (
                    <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-sc-teal text-white text-xs flex items-center justify-center">
                      ✓
                    </span>
                  )}
                  <div className="text-sm font-medium text-sc-text-primary">{plan.name}</div>
                  <div className="text-2xl font-semibold text-sc-text-primary mt-1">${plan.price}</div>
                  {plan.recommended && (
                    <div className="text-xs text-sc-text-secondary mt-1">Recomendado</div>
                  )}
                </button>
              )
            })}
          </div>

          <button
            type="button"
            className="w-full py-2.5 rounded-sc-lg bg-sc-teal text-white font-medium hover:bg-sc-teal-dark transition-colors"
          >
            Pagar
          </button>
        </div>
      </div>
    </div>
  )
}
