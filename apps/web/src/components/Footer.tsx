'use client';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  const t = useTranslations('Footer');
  const footerList = [
    {
      namespace: 'helpAndContact',
      items: [
        { key: 'trackOrder', href: '/track-order' },
        { key: 'FAQs', href: '/faqs' },
        { key: 'myOrder', href: '/account/orders' },
        { key: 'deliveryInformation', href: '/delivery-information' },
        { key: 'returnsAndRefunds', href: '/returns-and-refunds' },
        { key: 'shoppingOnline', href: '/shopping-online' },
        { key: 'contactUs', href: '/contact-us' },
        { key: 'contactManufacturer', href: '/contact-manufacturer' },
      ],
    },
    {
      namespace: 'ourCompany',
      items: [
        { key: 'corporateInfo', href: '/corporate-information' },
        { key: 'corporateStatements', href: '/corporate-statements' },
        { key: 'careers', href: '/careers' },
      ],
    },
    {
      namespace: 'visitAndExplore',
      items: [
        { key: 'storeLocation', href: '/store-locator' },
        { key: 'corporateSalesAndEvents', href: '/corporate-sales-events' },
        { key: 'giftCards', href: '/gift-cards' },
        { key: 'ourStories', href: '/our-stories' },
        { key: 'ourPeopleAndOurWorkPlace', href: '/our-people-workplace' },
        { key: 'ourSustainablePractice', href: '/sustainability' },
        { key: 'ingredientGlossary', href: '/ingredient-glossary' },
        { key: 'seasonalMoments', href: '/seasonal-moments' },
      ],
    },
    {
      namespace: 'privacyAndTerms',
      items: [
        { key: 'termsAndConditions', href: '/terms-and-conditions' },
        { key: 'privacyPolicy', href: '/privacy-policy' },
        { key: 'termsOfSale', href: '/terms-of-sale' },
        { key: 'manageCookies', href: '/manage-cookies' },
      ],
    },
    {
      namespace: 'social',
      items: [
        {
          key: 'instagram',
          href: 'https://instagram.com/yourbrand',
        },
        {
          key: 'facebook',
          href: 'https://facebook.com/yourbrand',
        },
        {
          key: 'pinterest',
          href: 'https://pinterest.com/yourbrand',
        },
        { key: 'x', href: 'https://x.com/yourbrand' },
        {
          key: 'youtube',
          href: 'https://youtube.com/@yourbrand',
        },
      ],
    },
    {
      namespace: 'locationAndLanguage',
      items: [
        { key: 'location', href: '#' },
        { key: 'language', href: '#' },
      ],
    },
  ];
  return (
    <footer className="bg-background">
      {footerList.map((footer) => {
        const [open, setOpen] = useState(false);
        return (
          <div key={footer.namespace}>
            <div className="flex px-2 py-4 justify-between">
              <h4>{t(footer.namespace + '.title')}</h4>
              <button onClick={() => setOpen((v) => !v)}>
                {open ? <Plus /> : <Minus />}
              </button>
            </div>
            {open && (
              <div className="flex flex-col px-2 py-2 gap-2 bg-card">
                {footer.items.map((item) => (
                  <Link key={item.key} href={item.href}>
                    {t(footer.namespace + '.' + item.key)}
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}
      <div className="px-2 py-4">
        <p>Copyright (c) Joli Vietnam 2026. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
