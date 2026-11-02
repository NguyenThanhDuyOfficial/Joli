import FilterBar from "@/src/components/FilterBar";
import ProductCard from "../../../components/ProductCard";
import {
  ProductListItem,
  ProductsRequestSchema,
} from "@nguyenthanhduyofficial/schemas";
import { ProductPagination } from "@/src/components/ProductPagination";
import { productService } from "@/src/server/container";
import { Suspense } from "react";
import { redirect } from "next/navigation";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;

  return (
    <main className="px-4 md:px-16">
      <FilterBar />
      <Suspense fallback={<ProductsSkeleton />}>
        <ProductsContent raw={raw} />
      </Suspense>
    </main>
  );
}

async function ProductsContent({
  raw,
}: {
  raw: Record<string, string | string[] | undefined>;
}) {
  const parsed = ProductsRequestSchema.safeParse(raw);
  if (!parsed.success) {
    redirect("/products");
  }

  const { data, pagination } = await productService.getMany(parsed.data);

  return (
    <>
      <div className="grid grid-cols-2 gap-4 gap-y-8 md:grid-cols-4">
        {data.map((product: ProductListItem) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <ProductPagination
        totalPages={pagination.totalPages}
        currentPage={pagination.page}
      />
    </>
  );
}

function ProductsSkeleton() {
  return <p>Đang tải...</p>;
}
