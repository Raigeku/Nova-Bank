import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import Features from "@/components/sections/Features";
import AppShowcase from "@/components/sections/AppShowcase";
import Stats from "@/components/sections/Stats";
import PlansTeaser from "@/components/sections/PlansTeaser";
import CTA from "@/components/sections/CTA";

export default function HomePage() {
  return (
    <>
      <Hero ns="home" variant="violet" primaryHref="/personal" secondaryHref="/business" />
      <Marquee />
      <Features ns="home.features" />
      <AppShowcase />
      <Stats />
      <PlansTeaser />
      <CTA />
    </>
  );
}
