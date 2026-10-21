"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { useFormatter, useTranslations } from "next-intl";

type Point = { title: string; text: string };
type Tx = { name: string; amount: number };

const bars = [40, 65, 30, 80, 55, 90, 70];

export default function AppShowcase() {
  const t = useTranslations("home.showcase");
  const format = useFormatter();
  const points = t.raw("points") as Point[];
  const txs = t.raw("phone.tx") as Tx[];
  const eur = (v: number) => format.number(v, { style: "currency", currency: "EUR" });

  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const rotateY = useTransform(scrollYProgress, [0, 1], [-28, 28]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [14, 0, 14]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.88, 1, 0.92]);
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setActive(Math.min(points.length - 1, Math.floor(v * points.length))));

  const screens = [
    <div key="balance" className="flex h-full flex-col gap-4">
      <p className="text-xs text-white/60">{t("phone.balance")}</p>
      <p className="text-3xl font-semibold">{eur(12480.5)}</p>
      <div className="bg-brand h-24 rounded-2xl p-3 text-xs font-semibold">nova</div>
      <ul className="flex flex-col gap-2">
        {txs.map((tx, i) => (
          <motion.li
            key={tx.name}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.08 }}
            className="flex justify-between rounded-xl bg-white/5 px-3 py-2 text-xs"
          >
            <span>{tx.name}</span>
            <span className={tx.amount > 0 ? "text-emerald-400" : ""}>{eur(tx.amount)}</span>
          </motion.li>
        ))}
      </ul>
    </div>,
    <div key="chart" className="flex h-full flex-col gap-4">
      <p className="text-xs text-white/60">{t("phone.spent")}</p>
      <p className="text-3xl font-semibold">{eur(1842)}</p>
      <div className="mt-auto flex h-48 items-end gap-2">
        {bars.map((h, i) => (
          <motion.div
            key={i}
            className="bg-brand flex-1 rounded-t-lg"
            initial={{ height: 0 }}
            animate={{ height: `${h}%` }}
            transition={{ delay: i * 0.06, type: "spring", bounce: 0.3 }}
          />
        ))}
      </div>
    </div>,
    <div key="goal" className="flex h-full flex-col items-center justify-center gap-4 text-center">
      <svg viewBox="0 0 120 120" className="h-40 w-40 -rotate-90">
        <circle cx="60" cy="60" r="50" fill="none" stroke="rgb(255 255 255 / 0.1)" strokeWidth="12" />
        <motion.circle
          cx="60"
          cy="60"
          r="50"
          fill="none"
          stroke="url(#ring)"
          strokeWidth="12"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 0.72 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id="ring">
            <stop offset="0" stopColor="#8a72ff" />
            <stop offset="1" stopColor="#2cc7ff" />
          </linearGradient>
        </defs>
      </svg>
      <p className="text-3xl font-semibold">72%</p>
      <p className="text-xs text-white/60">{t("phone.goal")}</p>
    </div>,
  ];

  return (
    <section ref={ref} className="relative h-[300vh]">
      <div className="sticky top-0 flex h-svh items-center overflow-hidden">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-2">
          <div>
            <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">{t("title")}</h2>
            <p className="mt-4 hidden text-lg text-muted sm:block">{t("subtitle")}</p>
            <ol className="mt-10 hidden flex-col gap-6 lg:flex">
              {points.map((p, i) => (
                <li key={p.title} className={`border-l-2 pl-5 transition-all duration-500 ${i === active ? "border-accent opacity-100" : "border-border opacity-40"}`}>
                  <h3 className="text-xl font-semibold">{p.title}</h3>
                  <p className="mt-1 text-muted">{p.text}</p>
                </li>
              ))}
            </ol>
            <p className="mt-4 font-medium text-accent lg:hidden">{points[active].title}</p>
          </div>

          <div className="flex justify-center [perspective:1400px]">
            <motion.div
              style={{ rotateY, rotateX, scale }}
              className="relative h-[440px] w-[220px] rounded-[42px] border-[8px] border-neutral-900 bg-[#0d0e16] p-5 pt-10 text-white shadow-2xl shadow-accent/30 sm:h-[540px] sm:w-[270px]"
            >
              <div className="absolute top-2 left-1/2 h-5 w-20 -translate-x-1/2 rounded-full bg-neutral-900" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  className="h-full"
                  initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -30, filter: "blur(8px)" }}
                  transition={{ duration: 0.4 }}
                >
                  {screens[active]}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
