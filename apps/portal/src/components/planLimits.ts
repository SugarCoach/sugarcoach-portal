
export const planLimits = {
  starter: {
    subscription: 'Starter',
    patientsTotal: 10,
  },
  professional: {
    subscription: 'Professional',
    patientsTotal: 50,
  },
  premium: {
    subscription: 'Premium',
    patientsTotal: 100,
  },
} as const

export type SubscriptionType = keyof typeof planLimits
