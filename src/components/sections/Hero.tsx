"use client";

import { Fragment, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { useTranslations } from "next-intl";
import { ArrowRight, Hand } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { BankScene } from "@/components/three";
import type { SceneVariant } from "@/components/three/BankScene";

const ease = [0.22, 1, 0.36, 1] as const;

type Props = {
  ns: "home" | "personal" | "business";
  variant?: SceneVariant;
  withCoins?: boolean;
  primaryHref: string;
  secondaryHref: string;
};

export default function Hero({ ns, variant, withCoins, primaryHref, secondaryHref }: Props) {
  const t = useTranslations(`${ns}.hero`);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const sceneY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const words = t("title").split(" ");
  const hint = useTranslations("scene")("hint");
  const [grabbed, setGrabbed] = useState(false);

  return (
    <section ref={ref} className="relative overflow-hidden">
      {/* Drifting color blobs behind everything */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          className="absolute -top-32 -left-24 h-[28rem] w-[28rem] rounded-full bg-accent/30 blur-3xl"
          animate={{ x: [0, 80, 0], y: [0, 40, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-20 -right-32 h-[30rem] w-[30rem] rounded-full bg-accent-2/25 blur-3xl"
          animate={{ x: [0, -60, 0], y: [0, 80, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-accent-3/20 blur-3xl"
          animate={{ x: [0, 50, -30, 0], y: [0, -40, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="mx-auto grid min-h-[92svh] max-w-6xl items-center gap-6 px-4 pt-28 pb-12 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:pt-32">
        <motion.div style={{ y, opacity }}>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-muted backdrop-blur"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
            {t("eyebrow")}
          </motion.p>

          <h1 className="text-5xl leading-[1.02] font-semibold tracking-tight sm:text-6xl lg:text-7xl">
            {words.map((w, i) => (
              <Fragment key={i}>
                <span className="inline-block overflow-hidden pb-1 align-bottom">
                  <motion.span className="inline-block" initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ delay: 0.1 + i * 0.07, duration: 0.9, ease }}>
                    {w}
                  </motion.span>
                </span>{" "}
              </Fragment>
            ))}
            <motion.span
              className="text-gradient inline-block"
              initial={{ opacity: 0, scale: 0.85, filter: "blur(12px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ delay: 0.2 + words.length * 0.07, duration: 1, ease }}
            >
              {t("highlight")}
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8, ease }}
            className="mt-6 max-w-lg text-lg text-muted"
          >
            {t("subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.8, ease }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link href={primaryHref} className="group inline-flex items-center gap-2 rounded-full bg-fg px-6 py-3 font-medium text-bg transition hover:scale-105">
              {t("primary")}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
            <Link href={secondaryHref} className="rounded-full border border-border bg-card/60 px-6 py-3 font-medium backdrop-blur transition hover:bg-card">
              {t("secondary")}
            </Link>
          </motion.div>
        </motion.div>

        <motion.div style={{ y: sceneY }} className="relative h-[340px] sm:h-[460px] lg:h-[580px]">
          <BankScene variant={variant} withCoins={withCoins} onGrab={() => setGrabbed(true)} />
          {/* Hint shown after the intro spin, until the card is first grabbed */}
          <AnimatePresence>
            {!grabbed && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10, transition: { duration: 0.3 } }}
                transition={{ delay: 1.8, duration: 0.6, ease }}
                className="pointer-events-none absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-2 text-sm font-medium whitespace-nowrap text-muted shadow-lg backdrop-blur"
              >
                <motion.span animate={{ x: [-4, 4, -4], rotate: [-12, 12, -12] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}>
                  <Hand className="h-4 w-4 text-accent" />
                </motion.span>
                {hint}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
