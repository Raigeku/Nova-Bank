export type Plan = { id: string; monthly: number | null; popular?: boolean };

export const personalPlans: Plan[] = [
  { id: "standard", monthly: 0 },
  { id: "plus", monthly: 3.99 },
  { id: "premium", monthly: 7.99, popular: true },
  { id: "metal", monthly: 13.99 },
];

// monthly: null = custom pricing
export const businessPlans: Plan[] = [
  { id: "basic", monthly: 0 },
  { id: "grow", monthly: 25, popular: true },
  { id: "scale", monthly: 100 },
  { id: "enterprise", monthly: null },
];

// Yearly billing = 2 months free, shown as a per-month price
export const yearlyMonthly = (monthly: number) => Math.round(((monthly * 10) / 12) * 100) / 100;
