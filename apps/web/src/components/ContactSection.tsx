import { useTranslations } from 'next-intl';

export default function ContactSection() {
  const t = useTranslations('Contact');
  return (
    <section className="px-2 py-10 space-y-2">
      <h3>{t('title')}</h3>
      <p>{t('description')}</p>
      <form className="flex flex-col gap-2">
        <input
          type="email"
          placeholder={t('emailAddress')}
          className="border-[0.2px] border-text px-1 py-2"
        />
        <div>
          <button className="px-4 py-2 bg-button text-button-foreground">
            {t('register')}
          </button>
        </div>
      </form>
    </section>
  );
}
