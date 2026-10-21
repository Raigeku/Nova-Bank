import Hero from "@/components/sections/Hero";
import PlanGrid from "@/components/sections/PlanGrid";
import Compare from "@/components/sections/Compare";
import Faq from "@/components/sections/Faq";
import CTA from "@/components/sections/CTA";
import { personalPlans } from "@/lib/plans";

export default function PersonalPage() {
  return (
    <>
      <Hero ns="personal" variant="sunset" primaryHref="/personal#plans" secondaryHref="/business" />
      <PlanGrid ns="personal" plans={personalPlans} />
      <Compare />
      <Faq />
      <CTA />
    </>
  );
}
