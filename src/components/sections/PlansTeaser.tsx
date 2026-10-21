"use client";

import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import Reveal from "@/components/Reveal";
import TiltCard from "@/components/TiltCard";

const cards = [
  { key: "personal", href: "/personal", bg: "bg-brand text-white" },
  { key: "business", href: "/business", bg: "bg-fg text-bg" },
] as const;

export default function PlansTeaser() {
  const t = useTranslations("home.teaser");
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <Reveal>
        <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">{t("title")}</h2>
      </Reveal>
      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {cards.map((c, i) => (
          <Reveal key={c.key} delay={i * 0.12}>
            <Link href={c.href} className="block rounded-[2rem]">
              <TiltCard max={6} className={`group flex min-h-72 flex-col justify-between overflow-hidden rounded-[2rem] p-8 sm:p-10 ${c.bg}`}>
                <div className="animate-spin-slow absolute -right-20 -bottom-20 h-64 w-64 rounded-full border-[28px] border-current opacity-10" />
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-3xl font-semibold tracking-tight sm:text-4xl">{t(`${c.key}.title`)}</h3>
                  <ArrowUpRight className="h-8 w-8 shrink-0 transition-transform duration-500 group-hover:rotate-45" />
                </div>
                <p className="max-w-sm text-lg opacity-80">{t(`${c.key}.text`)}</p>
              </TiltCard>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
