import React from 'react'
import { useTranslation } from 'react-i18next';
import { Link } from '@inertiajs/react';

function Deals() {
  const { t } = useTranslation();
  return (
    <section className="mx-auto max-w-7xl xl:max-w-screen-2xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
        <div className="overflow-hidden rounded-[2rem] bg-[#fff2d9] p-6 shadow-sm sm:p-8">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">{t('homepage.deals.seasonal')}</span>
            <h3 className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl">{t('homepage.deals.heading_left')}</h3>
            <p className="mt-3 max-w-lg text-sm leading-7 text-slate-600">{t('homepage.deals.desc_left')}</p>
            <Link href="/gift-packs/build-your-own" className="mt-6 block w-full rounded-full bg-slate-900 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-green-700 sm:inline-block sm:w-auto">
              {t('homepage.deals.discover')}
            </Link>
        </div>
        <div className="overflow-hidden rounded-[2rem] bg-[#e7f8e5] p-6 shadow-sm sm:p-8">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-green-700">{t('homepage.deals.farm_to_table')}</span>
            <h3 className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl">{t('homepage.deals.heading_right')}</h3>
            <p className="mt-3 max-w-lg text-sm leading-7 text-slate-600">{t('homepage.deals.desc_right')}</p>
            <button className="mt-6 w-full rounded-full bg-green-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-900 sm:w-auto">
            {t('homepage.deals.learn_more')}
            </button>
        </div>
        </div>
    </section>
  )
}

export default Deals
