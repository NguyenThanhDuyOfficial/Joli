import ProductCard from "../../components/ProductCard";
import { ProductListItemDTO } from "@nguyenthanhduyofficial/schemas";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;

  const query = new URLSearchParams(raw as Record<string, string>).toString();

  const res = await fetch(`${process.env.BASE_URL}/api/v1/products?${query}`, {
    next: { revalidate: 30 },
  });

  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);

  const { data, pagination } = await res.json();
  if (!data && data?.length === 0) return <p>Loading</p>;

  return (
    <main>
      <div className="grid grid-cols-2 gap-1 px-2">
        {data.map((product: ProductListItemDTO) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}
