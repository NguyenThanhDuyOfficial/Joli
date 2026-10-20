import MostLovedSection from "../../components/BestSellerSection";
import CategorySection from "../../components/CategorySection";
import BenefitSection from "../../components/BenefitSection";
import ContactSection from "../../components/ContactSection";
export const dynamic = "force-dynamic";
export default function HomePage() {
  return (
    <main className="bg-background">
      <section className="relative w-full max-h-90 aspect-video">
        <video className="w-full h-full object-cover" loop autoPlay>
          <source src="/JML_Christmas_HP_DT_1_launch.mp4" type="video/mp4" />
        </video>
        {/* <div className="absolute bottom-2 left-2 p-4 flex flex-col gap-1 items-center rounded-lg bg-background"> */}
        {/*   <p className="text-base">{t("introducing")} Tartan Tales</p> */}
        {/*   <Link */}
        {/*     href="/products?" */}
        {/*     className="bg-button text-button-foreground p-2 text-sm" */}
        {/*   > */}
        {/*     {t("exploreChristmas")} */}
        {/*   </Link> */}
        {/* </div> */}
      </section>
      <MostLovedSection />
      <CategorySection />
      <BenefitSection />
      <ContactSection />
    </main>
  );
}
