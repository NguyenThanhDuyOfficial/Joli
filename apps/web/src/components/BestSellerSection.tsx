import { getTranslations } from "next-intl/server";
import ProductCard from "./ProductCard";
import { productService } from "../server/container";
import { ProductListItem } from "@nguyenthanhduyofficial/schemas";

export default async function BestSellerSection() {
  const t = await getTranslations("Products");
  const { data } = await productService.getMany({
    sort: "bestseller",
    limit: 4,
  });
  return (
    <section>
      <h3 className="w-full py-8 text-center text-lg md:text-xl font-medium">
        {t("mostLoved")}
      </h3>
      <div className="flex gap-4 overflow-x-auto px-4 scroll-auto">
        {data.map((product: ProductListItem) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
