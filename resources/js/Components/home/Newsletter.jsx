import React from 'react'
import { useTranslation } from 'react-i18next';

function Newsletter() {
  const { t } = useTranslation();
  return (
    <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8">
          <div className="rounded-[2rem] bg-slate-900 px-5 py-10 text-center text-white shadow-2xl sm:px-8 sm:py-12 md:px-16">
            <span className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]">{t('homepage.newsletter.badge')}</span>
            <h2 className="mt-6 text-2xl font-bold sm:text-3xl md:text-4xl">{t('homepage.newsletter.title')}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-8 text-slate-300 md:text-base">
              {t('homepage.newsletter.description')}
            </p>
            <div className="mx-auto mt-8 flex max-w-2xl flex-col gap-4 sm:flex-row">
              <input
                type="email"
                placeholder={t('homepage.newsletter.placeholder')}
                className="h-14 w-full flex-1 rounded-full border border-white/10 bg-white px-6 text-sm text-slate-900 outline-none ring-0 placeholder:text-slate-400"
              />
              <button className="h-14 w-full rounded-full bg-green-600 px-8 text-sm font-semibold text-white transition hover:bg-green-700 sm:w-auto">
                {t('homepage.newsletter.subscribe')}
              </button>
            </div>
          </div>
        </section>
  )
}

export default Newsletter