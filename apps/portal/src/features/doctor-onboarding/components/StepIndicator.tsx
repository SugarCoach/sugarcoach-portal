interface StepIndicatorProps {
  steps: ReadonlyArray<string>
  current: number
  /** Pasos a los que se puede volver (ya completados). */
  maxReached: number
  onGoTo: (index: number) => void
}

export function StepIndicator({ steps, current, maxReached, onGoTo }: StepIndicatorProps) {
  return (
    <nav aria-label="Progreso de la ficha">
      <p className="mb-2 text-sm text-sc-text-secondary">
        Paso {current + 1} de {steps.length}: <span className="font-medium text-sc-text-primary">{steps[current]}</span>
      </p>
      <ol className="flex gap-2">
        {steps.map((label, i) => {
          const reachable = i <= maxReached && i !== current
          const state = i === current ? 'bg-sc-teal' : i < current || i <= maxReached ? 'bg-sc-teal/50' : 'bg-gray-200'
          return (
            <li key={label} className="flex-1">
              <button
                type="button"
                disabled={!reachable}
                onClick={() => onGoTo(i)}
                aria-current={i === current ? 'step' : undefined}
                aria-label={`${i + 1}. ${label}`}
                className={`h-2 w-full rounded-sc-full ${state} ${reachable ? 'cursor-pointer' : 'cursor-default'}`}
              />
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
