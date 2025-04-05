import { HeroFeature } from "@/components/widgets/hero-feature";
import { Hero } from "@/components/ui/animated-hero";
import { HeroParallaxSection } from "@/components/widgets/hero-parallax";
import { HeroBackground } from "@/components/widgets/hero-background";
import { HeroPricing } from "@/components/widgets/hero-pricing";


export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <Hero />
      <HeroParallaxSection />
      <HeroBackground />
      <HeroFeature />
      <HeroPricing />
    </div>
  );
}
