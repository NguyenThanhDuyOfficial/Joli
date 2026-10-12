"use client";

import { ProductListItemDTO } from "@nguyenthanhduyofficial/schemas";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { cn } from "../lib/utils";
import { authClient } from "../lib/auth-client";
import { useAuthStore } from "../stores/auth-store";
import { useRouter } from "next/navigation";

export default function ProductCard({
  product,
}: {
  product: ProductListItemDTO;
}) {
  const t = useTranslations("Products");
  const router = useRouter();
  const [variantIndex, setVariantIndex] = useState(0);
  const { data: session } = authClient.useSession();

  const toggleAuthModal = useAuthStore((s) => s.toggleAuthModal);

  async function handleBuyNow() {
    if (!session) {
      toggleAuthModal();
      return;
    }
    const res = await fetch("/api/v1/checkout", {
      method: "POST",
      body: JSON.stringify({
        userId: session.user.id,
        items: [
          {
            productId: product.id,
            variantId: product.variants[variantIndex]?.id,
            quantity: 1,
          },
        ],
      }),
    });
    const { id } = await res.json();
    router.push(`/checkout?sessionId=${id}`);
  }
  return (
    <div className="min-w-42 min-h-90 flex flex-col justify-between gap-2">
      <Link href={product.slug} className="relative w-full aspect-square">
        <Image
          src={product.variants[variantIndex]?.images[0]?.url!}
          alt={product.variants[variantIndex]?.images[0]?.alt ?? ""}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          loading="eager"
        />
      </Link>
      <p className="text-base line-clamp-2 h-full">{product.name}</p>
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-[14px]">{product.variants[0]?.price}</p>
          <div className="flex gap-2">
            {product.variants[0]?.color &&
              product.variants.map((variant, index) => (
                <button
                  key={index}
                  onClick={() => setVariantIndex(index)}
                  className={cn(
                    "rounded-sm px-2 py-2 border-[0.2px] border-button text-[12px]",
                    index === variantIndex &&
                      "bg-button text-button-foreground",
                  )}
                >
                  {variant.color}
                </button>
              ))}
          </div>
          <div className="flex gap-2">
            {product.variants[0]?.size &&
              product.variants.map((variant, index) => (
                <button
                  key={index}
                  onClick={() => setVariantIndex(index)}
                  className={cn(
                    "rounded-sm px-2 py-2 border-[0.2px] border-button text-[12px]",
                    index === variantIndex &&
                      "bg-button text-button-foreground",
                  )}
                >
                  {variant.size}{" "}
                </button>
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
