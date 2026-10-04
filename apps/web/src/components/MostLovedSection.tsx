import { getTranslations } from 'next-intl/server';
import ProductCard from './ProductCard';
import { ProductListItemDTO } from '@nguyenthanhduyofficial/schemas';

export default async function MostLovedSection() {
  const t = await getTranslations('Products');
  const res = await fetch(
    'http://localhost:3000/api/v1/products?limit=5&sort=bestsellers',
  );
  const result = await res.json();
  const products = result.data;
  if (!products && products?.length === 0) return <p>Load</p>;
  return (
    <section>
      <h3 className="w-full py-8 text-center text-lg md:text-xl font-medium">
        {t('mostLoved')}
      </h3>
      <div className="flex gap-4 overflow-x-auto px-4 scroll-auto">
        {products.map((product: ProductListItemDTO) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
