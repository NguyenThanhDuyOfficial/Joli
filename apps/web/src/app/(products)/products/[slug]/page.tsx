import BenefitSection from "@/src/components/BenefitSection";
import BestSellerSection from "@/src/components/BestSellerSection";
import ContactSection from "@/src/components/ContactSection";
import ProductClientPage from "@/src/components/ProductClientPage";
import { auth } from "@/src/server/auth";
import { productService } from "@/src/server/container";
import { headers } from "next/headers";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const result = await productService.getBySlug(slug, session?.user.id);

  return (
    <ProductClientPage
      product={result.data}
      sections={
        <>
          <BestSellerSection />
          <BenefitSection />
          <ContactSection />
        </>
      }
    />
  );
}
