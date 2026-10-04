import Image from 'next/image';
import MostLovedSection from '../../components/MostLovedSection';
import CategorySection from '../../components/CategorySection';
import BenefitSection from '../../components/BenefitSection';
import ContactSection from '../../components/ContactSection';

export default function HomePage() {
  return (
    <main className="bg-background">
      <section className="relative w-full aspect-video">
        <Image
          src="/images/hero.jpg"
          alt="hero"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </section>
      <MostLovedSection />
      <CategorySection />
      <BenefitSection />
      <ContactSection />
    </main>
  );
}
