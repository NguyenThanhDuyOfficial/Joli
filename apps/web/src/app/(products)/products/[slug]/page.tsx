import BenefitSection from "@/src/components/BenefitSection";
import BestSellerSection from "@/src/components/BestSellerSection";
import ContactSection from "@/src/components/ContactSection";
import ProductClientPage from "@/src/components/ProductClientPage";
import { auth } from "@/src/server/auth";
import { productService } from "@/src/server/container";
import { headers } from "next/headers";
import { Suspense } from "react";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ProductContent slug={slug} userId={session?.user.id} />
    </Suspense>
  );
}

async function ProductContent({
  slug,
  userId,
}: {
  slug: string;
  userId?: string;
}) {
  const result = await productService.getBySlug(slug, userId);
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

function ProductSkeleton() {
  return <p>Đang tải...</p>;
}
