import MostLovedSection from "../../components/BestSellerSection";
import CategorySection from "../../components/CategorySection";
import BenefitSection from "../../components/BenefitSection";
import ContactSection from "../../components/ContactSection";
import AutoLogin from "@/src/components/AutoLogin";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="bg-background">
      {/* This component is for live demo version only.  */}
      <AutoLogin />

      <section className="relative w-full max-h-90 aspect-video">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/hero-poster1.webp"
          preload="none"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/JML_Christmas_HP_DT_1_launch.mp4" type="video/mp4" />
        </video>

        <Image
          src="/hero-poster1.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          quality={75}
          className="object-cover pointer-events-none"
          style={{ animation: "fade-out-poster 0.5s ease-in 2s forwards" }}
        />
      </section>
      <MostLovedSection />
      <CategorySection />
      <BenefitSection />
      <ContactSection />
    </main>
  );
}
