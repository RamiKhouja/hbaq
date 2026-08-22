import { Leaf, Truck, ShieldCheck, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';

function StatsBanner() {
    const { t } = useTranslation();
    const stats = [
        { icon: Truck, title: t('homepage.stats.fast_delivery.title'), text: t('homepage.stats.fast_delivery.text') },
        { icon: Leaf, title: t('homepage.stats.fresh.title'), text: t('homepage.stats.fresh.text') },
        { icon: ShieldCheck, title: t('homepage.stats.quality.title'), text: t('homepage.stats.quality.text') },
        { icon: Phone, title: t('homepage.stats.b2b.title'), text: t('homepage.stats.b2b.text') },
    ];
  return (
    <section className="mx-auto max-w-7xl xl:max-w-screen-2xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
            const Icon = item.icon;
            return (
            <div key={item.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{item.text}</p>
            </div>
            );
        })}
        </div>
    </section>    
  )
}

export default StatsBanner