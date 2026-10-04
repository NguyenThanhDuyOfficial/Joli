import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

export default function CategorySection() {
  const t = useTranslations('Products');
  const categoryList = [
    {
      name: t('colognes'),
      slug: 'colognes/colognes',
      image: '/Cologne.png',
    },

    {
      name: t('candle'),
      slug: 'candle',
      image: '/Candle.png',
    },
    {
      name: t('body-hand-wash'),
      slug: 'body-hand-wash',
      image: '/Bath-Shower.png',
    },
    {
      name: t('diffusers-refills'),
      slug: 'diffusers-refills',
      image: '/Diffuser.png',
    },
  ];
  return (
    <section className="grid grid-cols-2 grid-rows-2 gap-2 py-10 px-2">
      {categoryList.map((category, index) => (
        <div key={index} className="space-y-2">
          <div className="relative w-full aspect-square">
            <Link href={'/products?category=' + category.slug}>
              <Image
                src={'/images' + category.image}
                alt={t('image') + ' ' + category.name}
                fill
                className="object-cover"
                sizes="100vw"
              />
            </Link>
          </div>
          <p className="text-center">{category.name}</p>
        </div>
      ))}
    </section>
  );
}
