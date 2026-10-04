import { useTranslations } from 'next-intl';
import { Pen, Gift, Car } from 'lucide-react';

export default function BenefitSection() {
  const t = useTranslations('Benefit');
  const benefitList = [
    {
      title: t('presonalization.title'),
      description: t('presonalization.description'),
      icon: Pen,
    },
    {
      title: t('wrapping.title'),
      description: t('wrapping.description'),
      icon: Gift,
    },
    {
      title: t('shipping.title'),
      description: t('shipping.description'),
      icon: Car,
    },
  ];
  return (
    <section className="bg-card px-2 py-10 space-y-3">
      <h3>{t('title')}</h3>
      {benefitList.map((benefit) => {
        const Icon = benefit.icon;

        return (
          <div
            key={benefit.title}
            className="flex px-3 py-6 gap-2 rounded-lg bg-background items-center"
          >
            <Icon width={24} height={24} />
            <div>
              <p>{benefit.title}</p>
              <p>{benefit.description}</p>
            </div>
          </div>
        );
      })}
    </section>
  );
}
