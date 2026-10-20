import { getTranslations } from "next-intl/server";
import ProductCard from "./ProductCard";
import { productService } from "../server/container";
import { ProductListItem } from "@nguyenthanhduyofficial/schemas";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@nguyenthanhduyofficial/ui/components/carousel";

export default async function BestSellerSection() {
  const t = await getTranslations("Products");
  const { data } = await productService.getMany({
    sort: "bestseller",
    limit: 8,
  });
  return (
    <section className="px-4 py-8 space-y-8 md:px-16">
      <h3 className="w-full text-center text-lg md:text-xl font-medium">
        {t("mostLoved")}
      </h3>
      <Carousel
        opts={{ loop: true, align: "start", containScroll: "trimSnaps" }}
      >
        <CarouselContent>
          {data.map((product: ProductListItem) => (
            <CarouselItem key={product.id} className="basis-1/2 md:basis-1/4">
              <ProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
