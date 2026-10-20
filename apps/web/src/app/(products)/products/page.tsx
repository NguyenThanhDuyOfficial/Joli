import FilterBar from "@/src/components/FilterBar";
import ProductCard from "../../../components/ProductCard";
import {
  ProductListItem,
  ProductsRequestSchema,
} from "@nguyenthanhduyofficial/schemas";
import { ProductPagination } from "@/src/components/ProductPagination";
import { productService } from "@/src/server/container";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  console.log(raw);

  const parsed = ProductsRequestSchema.safeParse(raw);
  if (!parsed.success) {
    console.log(parsed.error.issues);
  }
  console.log(parsed);

  const { data, pagination } = await productService.getMany(
    parsed.success ? parsed.data : ProductsRequestSchema.parse({}),
  );

  return (
    <main className="px-4 md:px-16">
      <FilterBar />
      <div className="grid grid-cols-2 gap-4 gap-y-8 md:grid-cols-4">
        {data.map((product: ProductListItem) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <ProductPagination
        totalPages={pagination.totalPages}
        currentPage={pagination.page}
      />
    </main>
  );
}
