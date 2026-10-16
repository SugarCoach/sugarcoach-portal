import { useState } from "react";
import { Link } from "react-router";
import { RadioGroup } from "radix-ui";
import { PATHS } from "@/routes/paths";

type PlanId = "starter" | "growth" | "professional" | "enterprise";

interface Plan {
    id: PlanId;
    name: string;
    price: number;
    patientLimitLabel: "Hasta" | "Más de";
    patientLimit: number;
    popular?: boolean;
}

const plans: Plan[] = [
    { id: "starter", name: "Starter", price: 50, patientLimitLabel: "Hasta", patientLimit: 10, popular: true },
    { id: "growth", name: "Growth", price: 75, patientLimitLabel: "Hasta", patientLimit: 20 },
    { id: "professional", name: "Professional", price: 100, patientLimitLabel: "Hasta", patientLimit: 50 },
    { id: "enterprise", name: "Enterprise", price: 150, patientLimitLabel: "Más de", patientLimit: 50 },
];

export default function PlanSelectionPage() {
    const [selectedPlan, setSelectedPlan] = useState<PlanId>("starter");

    return (
        <div className="relative">
            {/* Fondo superior en diagonal */}
            <div
                className="absolute inset-x-0 top-0 h-72 rounded-sc-lg bg-gradient-to-r from-sc-teal-dark to-sc-teal"
                style={{ clipPath: "polygon(0 0, 100% 0, 100% 55%, 0 100%)" }}
            />

            <div className="relative mx-auto max-w-4xl px-4 py-10">
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
                    <p className="mb-6 mt-1 text-sm text-sc-text-secondary">
                        Elegí el plan que mejor se adapte a tu práctica
                    </p>

                    <RadioGroup.Root
                        value={selectedPlan}
                        onValueChange={(value) => setSelectedPlan(value as PlanId)}
                        aria-labelledby="plan-selection-title"
                        className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
                    >
                        {plans.map((plan) => (
                            <RadioGroup.Item
                                key={plan.id}
                                value={plan.id}
                                className="relative rounded-sc-lg border border-sc-border bg-sc-bg px-4 py-5 text-center transition-colors hover:bg-sc-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sc-teal data-[state=checked]:border-sc-teal data-[state=checked]:bg-sc-teal-light"
                            >
                                {plan.popular && (
                                    <span className="absolute -top-px right-3 rounded-b-sc-md bg-sc-teal px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                                        Más popular
                                    </span>
                                )}
                                <div className="text-xs font-semibold uppercase tracking-wider text-sc-text-secondary">
                                    {plan.name}
                                </div>
                                <div className="mt-3 flex items-baseline justify-center gap-2 font-mono">
                                    <span className="text-3xl font-bold text-sc-text-primary">${plan.price}</span>
                                    <span className="text-sm text-sc-text-muted">/mes</span>
                                </div>
                                <div className="mt-3 text-sm text-sc-text-secondary">
                                    {plan.patientLimitLabel}{" "}
                                    <strong className="font-semibold text-sc-text-primary">
                                        {plan.patientLimit} pacientes
                                    </strong>
                                </div>
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
