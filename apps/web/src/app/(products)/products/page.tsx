import FilterBar from "@/src/components/FilterBar";
import ProductCard from "../../../components/ProductCard";
import {
  ProductListDTO,
  ProductListItemDTO,
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

  const parsed = ProductsRequestSchema.safeParse(raw);
  if (!parsed.success) {
  }

  const { data, pagination } = await productService.getMany(
    parsed.success ? parsed.data : ProductsRequestSchema.parse({}),
  );

  return (
    <main>
      <FilterBar />
      <div className="grid grid-cols-2 gap-2 px-2">
        {data.map((product: ProductListItemDTO) => (
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
