"use client";

import { createCheckoutSessionAction } from "@/src/actions/checkoutSession.action";
import { authClient } from "@/src/lib/auth-client";
import { cn } from "@/src/lib/utils";
import { useAuthStore } from "@/src/stores/auth-store";
import { Button } from "@nguyenthanhduyofficial/ui/components/button";
import { Heart, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ProductItem } from "@nguyenthanhduyofficial/schemas";
import { formatPrice } from "../lib/format";

export default function ProductClientPage({
  product,
  sections,
}: {
  product: ProductItem;
  sections: React.ReactNode;
}) {
  const [variantIndex, setVariantIndex] = useState(0);
  const t = useTranslations("Products");
  const toggleAuthModal = useAuthStore((s) => s.toggleAuthModal);
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const { data: session } = authClient.useSession();

  async function handleBuyNow() {
    if (!session) {
      toggleAuthModal();
      return;
    }

    startTransition(async () => {
      const result = await createCheckoutSessionAction({
        items: [
          {
            productId: product.id,
            variantId: product.variants[variantIndex]?.id,
            quantity: 1,
          },
        ],
      });
      if (!result) {
        return;
      }
      if ("error" in result) {
        return;
      }

      router.push(`/checkout?sessionId=${result.data.id}`);
    });
  }

  return (
    <main>
      <div>
        <div className="px-2 py-4 space-y-2">
          <div className="flex justify-between">
            <h5>{product.name}</h5>
            {product.loves?.length ? (
              <Heart className="fill-background" />
            ) : (
              <Heart />
            )}
          </div>
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={
                  i < Math.round(product.starRating)
                    ? "fill-background h-4 w-4"
                    : "h-4 w-4"
                }
              />
            ))}
          </div>
        </div>
        <div className="relative w-90 aspect-square">
          <Image
            src={product.variants[variantIndex]?.images[0]?.url ?? ""}
            alt={
              product.variants[variantIndex]?.images[0]?.alt ?? "Product Image"
            }
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="px-2 py-4 space-y-2">
          <h5>{formatPrice(product.variants[variantIndex]?.price!)}</h5>
          <div className="flex gap-2">
            {product.variants[0]?.size &&
              product.variants.map((variant, index) => (
                <Button
                  key={index}
                  onClick={() => setVariantIndex(index)}
                  variant={index === variantIndex ? "default" : "outline"}
                  size="xs"
                >
                  {variant.size}
                </Button>
              ))}
          </div>
          <div className="flex gap-2">
            {product.variants[0]?.color &&
              product.variants.map((variant, index) => (
                <Button
                  key={index}
                  onClick={() => setVariantIndex(index)}
                  variant={index === variantIndex ? "default" : "outline"}
                  size="xs"
                >
                  {variant.color}
                </Button>
              ))}
          </div>
          <Button className="w-full" onClick={handleBuyNow}>
            {t("buyNow")}
          </Button>
        </div>
      </div>
      {sections}
    </main>
  );
}
