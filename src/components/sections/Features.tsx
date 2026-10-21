"use client";

import { useTranslations } from "next-intl";
import { ChartPie, Code, CreditCard, Globe, PiggyBank, Receipt, ShieldCheck, Users, Zap } from "lucide-react";
import Reveal from "@/components/Reveal";
import TiltCard from "@/components/TiltCard";

const icons = { zap: Zap, globe: Globe, shield: ShieldCheck, piggy: PiggyBank, card: CreditCard, chart: ChartPie, users: Users, code: Code, receipt: Receipt };

type Item = { icon: keyof typeof icons; title: string; text: string };

export default function Features({ ns }: { ns: "home.features" | "business.features" }) {
  const t = useTranslations(ns);
  const items = t.raw("items") as Item[];

  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
      <Reveal className="max-w-2xl">
        <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">{t("title")}</h2>
        <p className="mt-4 text-lg text-muted">{t("subtitle")}</p>
      </Reveal>
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => {
          const Icon = icons[item.icon];
          return (
            <Reveal key={item.title} delay={(i % 3) * 0.1}>
              <TiltCard className="group h-full rounded-3xl border border-border bg-card p-7 transition-shadow hover:shadow-2xl hover:shadow-accent/10">
                <div className="bg-brand grid h-12 w-12 place-items-center rounded-2xl text-white transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-xl font-semibold">{item.title}</h3>
                <p className="mt-2 text-muted">{item.text}</p>
              </TiltCard>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
