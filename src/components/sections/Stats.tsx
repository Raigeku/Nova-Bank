"use client";

import { useEffect, useRef } from "react";
import { animate, useInView } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import Reveal from "@/components/Reveal";

type Stat = { value: number; decimals: number; suffix: string; label: string };

function Counter({ value, decimals }: { value: number; decimals: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const locale = useLocale();

  useEffect(() => {
    if (!inView) return;
    const fmt = new Intl.NumberFormat(locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    const controls = animate(0, value, {
      duration: 2,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = fmt.format(v);
      },
    });
    return () => controls.stop();
  }, [inView, value, decimals, locale]);

  return <span ref={ref}>0</span>;
}

export default function Stats() {
  const items = useTranslations("home").raw("stats") as Stat[];
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
        {items.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.1}>
            <p className="text-gradient text-5xl font-semibold tracking-tight tabular-nums sm:text-6xl">
              <Counter value={s.value} decimals={s.decimals} />
              {s.suffix}
            </p>
            <p className="mt-2 text-muted">{s.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
