"use client";

import { ProductListItem } from "@nguyenthanhduyofficial/schemas";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { authClient } from "../lib/auth-client";
import { useAuthStore } from "../stores/auth-store";
import { useRouter } from "next/navigation";
import { createCheckoutSessionAction } from "../actions/checkoutSession.action";
import { formatPrice } from "../lib/format";
import { Button } from "@nguyenthanhduyofficial/ui/components/button";

export default function ProductCard({ product }: { product: ProductListItem }) {
  const t = useTranslations("Products");
  const router = useRouter();
  const [variantIndex, setVariantIndex] = useState(0);
  const { data: session } = authClient.useSession();
  const toggleAuthModal = useAuthStore((s) => s.toggleAuthModal);
  const [pending, startTransition] = useTransition();

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
    <div className="min-w-42 min-h-90 flex flex-col justify-between gap-2">
      <Link
        href={`/products/${product.slug}`}
        className="relative w-full aspect-square"
      >
        <Image
          src={product.variants[variantIndex]?.images[0]?.url!}
          alt={product.variants[variantIndex]?.images[0]?.alt ?? ""}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          loading="eager"
        />
      </Link>
      <h5 className="line-clamp-2">{product.name}</h5>
      <div className="space-y-4">
        <div className="space-y-2">
          <h6 className="text-[14px]">
            {formatPrice(product.variants[0]?.price!)}
          </h6>
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
          <div className="flex gap-2">
            {product.variants[0]?.size &&
              product.variants.map((variant, index) => (
                <Button
                  key={index}
                  onClick={() => setVariantIndex(index)}
                  variant={index === variantIndex ? "default" : "outline"}
                  size="xs"
                >
                  {variant.size}{" "}
                </Button>
              ))}
          </div>
        </div>
        <button
          className="w-full h-8 bg-button text-button-foreground"
          onClick={handleBuyNow}
        >
          {t("buyNow")}
        </button>
      </div>
    </div>
  );
}
