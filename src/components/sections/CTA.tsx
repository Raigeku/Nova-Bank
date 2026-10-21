"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Reveal from "@/components/Reveal";

export default function CTA({ href = "/personal" }: { href?: string }) {
  const t = useTranslations("cta");
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2.5rem] bg-[#0b0b14] px-6 py-20 text-center text-white sm:px-16">
          <motion.div
            aria-hidden
            className="absolute top-1/2 left-1/2 h-[60rem] w-[60rem] -translate-x-1/2 -translate-y-1/2 opacity-60 blur-3xl"
            style={{ background: "conic-gradient(from 0deg, #6b4dff, #00b7ff, #ff4fd8, #6b4dff)" }}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-4xl font-semibold tracking-tight sm:text-6xl">{t("title")}</h2>
            <p className="mx-auto mt-5 max-w-lg text-lg text-white/75">{t("subtitle")}</p>
            <Link href={href} className="mt-10 inline-block rounded-full bg-white px-8 py-4 font-semibold text-black transition hover:scale-105">
              {t("button")}
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
