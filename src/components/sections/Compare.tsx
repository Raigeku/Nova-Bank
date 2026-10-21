"use client";

import { useTranslations } from "next-intl";
import Reveal from "@/components/Reveal";
import { personalPlans } from "@/lib/plans";

type Row = { label: string; values: string[] };

export default function Compare() {
  const t = useTranslations("personal");
  const rows = t.raw("compare.rows") as Row[];
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <Reveal>
        <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">{t("compare.title")}</h2>
      </Reveal>
      <Reveal delay={0.1} className="mt-10 overflow-x-auto rounded-3xl border border-border bg-card">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="p-5 font-medium text-muted" />
              {personalPlans.map((p) => (
                <th key={p.id} scope="col" className={`p-5 text-base font-semibold ${p.popular ? "text-gradient" : ""}`}>
                  {t(`plans.${p.id}.name`)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} className="border-b border-border transition-colors last:border-0 hover:bg-fg/[0.03]">
                <th scope="row" className="p-5 font-medium">{r.label}</th>
                {r.values.map((v, i) => (
                  <td key={i} className="p-5 text-muted">{v}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Reveal>
    </section>
  );
}
