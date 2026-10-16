import { useState } from "react";
import { Link } from "react-router";
import { RadioGroup } from "radix-ui";
import { PATHS } from "@/routes/paths";

type PlanId = "starter" | "growth" | "pro";

interface Plan {
    id: PlanId;
    name: string;
    price: number;
    recommended?: boolean;
}

const plans: Plan[] = [
    { id: "starter", name: "Starter", price: 50 },
    { id: "growth", name: "Growth", price: 75 },
    { id: "pro", name: "Pro", price: 100, recommended: true },
];

export default function PlanSelectionPage() {
    const [selectedPlan, setSelectedPlan] = useState<PlanId>("pro");

    return (
        <div className="relative">
            {/* Fondo superior en diagonal */}
            <div
                className="absolute inset-x-0 top-0 h-72 rounded-sc-lg bg-gradient-to-r from-sc-teal-dark to-sc-teal"
                style={{ clipPath: "polygon(0 0, 100% 0, 100% 55%, 0 100%)" }}
            />

            <div className="relative mx-auto max-w-xl px-4 py-10">
                <Link
                    to={PATHS.app.root}
                    className="mb-6 inline-block text-sm font-medium text-white/90 hover:text-white"
                >
                    ← Volver al portal
                </Link>

                <div className="rounded-sc-lg bg-sc-surface p-6 shadow-sc-subtle">
                    <h2 id="plan-selection-title" className="text-xl font-semibold text-sc-text-primary">
                        Selección de Plan y Pago
                    </h2>
                    <p className="mb-5 mt-1 text-sm text-sc-text-secondary">
                        Elegí el plan que mejor se adapte a tu práctica
                    </p>

                    <RadioGroup.Root
                        value={selectedPlan}
                        onValueChange={(value) => setSelectedPlan(value as PlanId)}
                        aria-labelledby="plan-selection-title"
                        className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3"
                    >
                        {plans.map((plan) => (
                            <RadioGroup.Item
                                key={plan.id}
                                value={plan.id}
                                className="relative rounded-sc-lg border border-sc-border p-4 text-left transition-colors hover:bg-sc-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sc-teal data-[state=checked]:border-sc-teal data-[state=checked]:bg-sc-teal-light"
                            >
                                <RadioGroup.Indicator className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-sc-teal text-xs text-white">
                                    ✓
                                </RadioGroup.Indicator>
                                <div className="text-sm font-medium text-sc-text-primary">{plan.name}</div>
                                <div className="mt-1 text-2xl font-semibold text-sc-text-primary">${plan.price}</div>
                                {plan.recommended && (
                                    <div className="mt-1 text-xs text-sc-text-secondary">Recomendado</div>
                                )}
                            </RadioGroup.Item>
                        ))}
                    </RadioGroup.Root>

                    <button
                        type="button"
                        className="w-full rounded-sc-lg bg-sc-teal py-2.5 font-medium text-white transition-colors hover:bg-sc-teal-dark"
                    >
                        Pagar
                    </button>
                </div>
            </div>
        </div>
    );
}
