"use client";

import { useTranslations } from "next-intl";
import { Sparkle } from "lucide-react";

export default function Marquee() {
  const items = useTranslations("home").raw("marquee") as string[];
  return (
    <div className="relative overflow-hidden border-y border-border py-6 [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
      {/* Two copies so the -50% loop is seamless */}
      <div className="animate-marquee flex w-max">
        {[0, 1].map((copy) => (
          <ul key={copy} aria-hidden={copy === 1} className="flex shrink-0 items-center">
            {items.map((item) => (
              <li key={item} className="flex items-center gap-8 px-4 text-2xl font-semibold tracking-tight whitespace-nowrap sm:text-3xl">
                {item}
                <Sparkle className="h-5 w-5 text-accent" />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
