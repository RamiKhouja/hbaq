import React from 'react'
import { useTranslation } from 'react-i18next';

function TopBanner() {
  const { t } = useTranslation();
  return (
    <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#eff7df] via-[#f7f9f2] to-[#fff4df]" />
        <div className="relative mx-auto grid max-w-7xl xl:max-w-screen-2xl items-center gap-10 px-4 py-12 sm:px-6 md:py-20 lg:grid-cols-2 lg:gap-12 lg:px-8 lg:py-24">
            <div>
              <span className="inline-flex rounded-full border border-green-200 bg-white px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-green-700 shadow-sm sm:px-4 sm:text-xs">
                {t('homepage.top.badge')}
              </span>
              <h1 className="mt-6 max-w-xl text-3xl font-extrabold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
                {t('homepage.top.title')}
              </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
                {t('homepage.top.description')}
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <button className="w-full rounded-full bg-green-600 px-7 py-4 text-sm font-semibold text-white shadow-lg shadow-green-200 transition hover:bg-green-700 sm:w-auto">
                  {t('homepage.top.shop_now')}
                </button>
                <button className="w-full rounded-full border border-slate-300 bg-white px-7 py-4 text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-900 sm:w-auto">
                  {t('homepage.top.explore_wholesale')}
                </button>
              </div>

              <div className="mt-10 grid max-w-xl grid-cols-1 gap-4 min-[420px]:grid-cols-2 sm:grid-cols-3">
                {[
                  ['10K+', t('homepage.top.stats.customers')],
                  ['500+', t('homepage.top.stats.orders')],
                  ['99%', t('homepage.top.stats.freshness')],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm">
                    <div className="text-2xl font-bold text-slate-900">{value}</div>
                    <div className="mt-1 text-sm text-slate-500">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-4 top-8 h-20 w-20 rounded-full bg-orange-200/60 blur-2xl sm:-left-6 sm:top-10 sm:h-24 sm:w-24" />
              <div className="absolute -right-4 bottom-8 h-20 w-20 rounded-full bg-green-200/70 blur-2xl sm:-right-6 sm:bottom-10 sm:h-24 sm:w-24" />
              <div className="overflow-hidden rounded-[1.75rem] border border-white/70 bg-white p-3 shadow-2xl sm:rounded-[2rem] sm:p-4">
                <img
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80"
                  alt="Fresh vegetables and fruits"
                  className="h-[320px] w-full rounded-[1.35rem] object-cover sm:h-[420px] sm:rounded-[1.5rem] lg:h-[520px]"
                />
              </div>
              <div className="mx-4 -mt-8 rounded-3xl bg-white p-4 shadow-xl absolute -bottom-4 left-10 mx-0 mt-0 p-5">
                <p className="text-sm font-semibold text-slate-900">{t('homepage.top.offer.title')}</p>
                <p className="mt-1 text-xl font-bold text-green-700 sm:text-2xl">{t('homepage.top.offer.discount')}</p>
                <p className="text-sm text-slate-500">{t('homepage.top.offer.subtitle')}</p>
              </div>
            </div>
        </div>
    </section>
  )
}

export default TopBanner