'use client';
import { ProductListItemDTO } from '@nguyenthanhduyofficial/schemas';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { cn } from '../lib/utils';

export default function ProductCard({
  product,
}: {
  product: ProductListItemDTO;
}) {
  const t = useTranslations('Products');
  const [variantIndex, setVariantIndex] = useState(0);
  return (
    <div className="min-w-50 space-y-2">
      <div className="relative min-w-50 aspect-square">
        <Link href={product.slug}>
          <Image
            src={product.variants[variantIndex].images[0].url}
            alt={product.variants[variantIndex].images[0].alt ?? ''}
            fill
            className="object-cover"
            sizes="100vw"
          />
        </Link>
      </div>
      <div className="space-y-4">
        <p className="text-base">{product.name}</p>
        <div className="space-y-2">
          <p className="text-[14px]">{product.variants[0].price}</p>
          <div className="flex gap-2">
            {product.variants[0].color &&
              product.variants.map((variant, index) => (
                <button
                  key={index}
                  onClick={() => setVariantIndex(index)}
                  className={cn(
                    'rounded-sm px-2 py-2 border-[0.2px] border-button text-[12px]',
                    index === variantIndex &&
                      'bg-button text-button-foreground',
                  )}
                >
                  {variant.color}
                </button>
              ))}
          </div>
          <div className="flex gap-2">
            {product.variants[0].size &&
              product.variants.map((variant, index) => (
                <button
                  key={index}
                  onClick={() => setVariantIndex(index)}
                  className={cn(
                    'rounded-sm px-2 py-2 border-[0.2px] border-button text-[12px]',
                    index === variantIndex &&
                      'bg-button text-button-foreground',
                  )}
                >
                  {variant.size}{' '}
                </button>
              ))}
          </div>
        </div>
        <button className="w-full h-8 bg-button text-button-foreground">
          {t('buyNow')}
        </button>
      </div>
    </div>
  );
}
