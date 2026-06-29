import SectionTitle from './SectionTitle';
import PackCard from './PackCard';
import { useTranslation } from 'react-i18next';

export default function GiftPacks({ packs = [] }) {
  const { i18n } = useTranslation();

  if (!packs.length) {
    return null;
  }

  return (
    <section id="gift-packs" className="bg-[#f7f9f2] py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 xl:max-w-screen-2xl">
        <SectionTitle
          eyebrow={i18n.language === 'ar' ? 'باقات الهدايا' : 'Gift Packs'}
          title={i18n.language === 'ar' ? 'باقات جاهزة للإهداء' : 'Ready-to-gift packs'}
          description={i18n.language === 'ar' ? 'اختيارات مجمعة بعناية من منتجات حبق.' : 'Curated bundles made from selected Hbaq products.'}
          link="/gift-packs"
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {packs.map((pack) => <PackCard key={pack.id} pack={pack} />)}
        </div>
      </div>
    </section>
  );
}
