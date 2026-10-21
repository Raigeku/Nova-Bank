import Hero from "@/components/sections/Hero";
import PlanGrid from "@/components/sections/PlanGrid";
import Features from "@/components/sections/Features";
import CTA from "@/components/sections/CTA";
import { businessPlans } from "@/lib/plans";

export default function BusinessPage() {
  return (
    <>
      <Hero ns="business" variant="graphite" withCoins primaryHref="/business#plans" secondaryHref="/personal" />
      <Features ns="business.features" />
      <PlanGrid ns="business" plans={businessPlans} />
      <CTA href="/business" />
    </>
  );
}
