import React from 'react'
import { useTranslation } from 'react-i18next';

function About({ about }) {
    const { t, i18n } = useTranslation();
    const lang = i18n.language;

    const localized = (value) => {
        if (!value) return '';

        try {
            const parsed = typeof value === 'string' ? JSON.parse(value) : value;
            return parsed?.[lang] || parsed?.en || parsed?.fr || parsed?.ar || '';
        } catch (error) {
            return value;
        }
    };

    const image = about?.image
        ? `/${about.image}`
        : 'https://images.unsplash.com/photo-1506617420156-8e4536971650?auto=format&fit=crop&w=1200&q=80';
    const title = localized(about?.title) || t('homepage.about.title');
    const description = localized(about?.short_description) || t('homepage.about.description');

    return (
   <section id="about" className="bg-white py-12 sm:py-16">
        <div className="mx-auto grid max-w-7xl xl:max-w-screen-2xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] shadow-lg">
            <img
            src={image}
            alt={title}
            className="h-full min-h-[260px] w-full object-cover sm:min-h-[420px]"
            />
        </div>
        <div className="flex flex-col justify-center">
            <span className="inline-flex w-fit rounded-full bg-green-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-green-700">
            {t('homepage.about.badge')}
            </span>
            <h2 className="mt-6 text-2xl font-bold leading-tight text-slate-900 sm:text-3xl md:text-4xl">{title}</h2>
            <p className="mt-5 text-sm leading-8 text-slate-600 md:text-base">
            {description}
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
                ['200+', t('homepage.about.stats.farms')],
                ['50+', t('homepage.about.stats.cities')],
                ['24/7', t('homepage.about.stats.online')],
                ['4.9/5', t('homepage.about.stats.rating')],
            ].map(([value, label]) => (
                <div key={label} className="rounded-2xl border border-slate-200 p-5">
                <div className="text-2xl font-bold text-slate-900">{value}</div>
                <div className="mt-1 text-sm text-slate-500">{label}</div>
                </div>
            ))}
            </div>
        </div>
        </div>
    </section>
  )
}

export default About
