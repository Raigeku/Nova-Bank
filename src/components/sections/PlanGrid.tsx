"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useFormatter, useTranslations } from "next-intl";
import { Check } from "lucide-react";
import Reveal from "@/components/Reveal";
import TiltCard from "@/components/TiltCard";
import { type Plan, yearlyMonthly } from "@/lib/plans";

export default function PlanGrid({ ns, plans }: { ns: "personal" | "business"; plans: Plan[] }) {
  const t = useTranslations(ns);
  const tp = useTranslations("plans");
  const format = useFormatter();
  const [yearly, setYearly] = useState(false);

  return (
    <section id="plans" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-24 sm:px-6">
      <Reveal className="text-center">
        <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">{t("plansTitle")}</h2>
        <div role="radiogroup" aria-label={tp("billing")} className="mt-8 inline-flex rounded-full border border-border bg-card p-1">
          {[false, true].map((y) => (
            <button
              key={String(y)}
              type="button"
              role="radio"
              aria-checked={yearly === y}
              onClick={() => setYearly(y)}
              className="relative rounded-full px-5 py-2 text-sm font-medium"
            >
              {yearly === y && <motion.span layoutId={`billing-${ns}`} className="absolute inset-0 rounded-full bg-fg" transition={{ type: "spring", bounce: 0.25, duration: 0.5 }} />}
              <span className={`relative ${yearly === y ? "text-bg" : ""}`}>{y ? tp("yearly") : tp("monthly")}</span>
            </button>
          ))}
        </div>
        <p className="mt-3 text-sm text-accent">{tp("save")}</p>
      </Reveal>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan, i) => {
          const price = plan.monthly === null ? null : yearly ? yearlyMonthly(plan.monthly) : plan.monthly;
          const label = price === null ? tp("custom") : price === 0 ? tp("free") : format.number(price, { style: "currency", currency: "EUR" });
          const features = t.raw(`plans.${plan.id}.features`) as string[];
          return (
            <Reveal key={plan.id} delay={i * 0.08} className="h-full">
              <TiltCard
                max={8}
                className={`flex h-full flex-col rounded-3xl border p-7 ${
                  plan.popular ? "bg-brand border-transparent text-white shadow-2xl shadow-accent/30 lg:-translate-y-4" : "border-border bg-card"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">{t(`plans.${plan.id}.name`)}</h3>
                  {plan.popular && <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur">{tp("popular")}</span>}
                </div>
                <p className={`mt-2 text-sm ${plan.popular ? "text-white/80" : "text-muted"}`}>{t(`plans.${plan.id}.tagline`)}</p>

                <div className="mt-6 flex h-12 items-end gap-1 overflow-hidden">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={label}
                      initial={{ y: 40, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -40, opacity: 0 }}
                      transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
                      className="text-4xl font-semibold tracking-tight tabular-nums"
                    >
                      {label}
                    </motion.span>
                  </AnimatePresence>
                  {!!price && <span className={`pb-1 text-sm ${plan.popular ? "text-white/80" : "text-muted"}`}>{tp("perMonth")}</span>}
                </div>

                <ul className="mt-6 flex flex-1 flex-col gap-3 text-sm">
                  {features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <Check className={`h-4 w-4 shrink-0 translate-y-0.5 ${plan.popular ? "" : "text-accent"}`} />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* shortcut: no sign-up flow exists yet, so this button has no action */}
                <button
                  type="button"
                  className={`mt-8 rounded-full px-5 py-3 text-sm font-semibold transition hover:scale-[1.03] ${plan.popular ? "bg-white text-black" : "bg-fg text-bg"}`}
                >
                  {price === null ? tp("contact") : tp("choose")}
                </button>
              </TiltCard>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
