import { ChevronRight } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next';

function Wholesale() {
  const { t } = useTranslation();
  return (
    <section id="wholesale" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-green-700 to-emerald-500 p-6 text-white shadow-xl sm:p-8 md:p-12">
            <span className="rounded-full bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]">{t('homepage.wholesale.badge')}</span>
            <h2 className="mt-6 text-2xl font-bold leading-tight sm:text-3xl md:text-4xl">{t('homepage.wholesale.title')}</h2>
            <p className="mt-4 max-w-2xl text-sm leading-8 text-green-50 md:text-base">
            {t('homepage.wholesale.description')}
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            <button className="w-full rounded-full bg-white px-6 py-3 text-sm font-semibold text-green-700 transition hover:bg-slate-100 sm:w-auto">
                {t('homepage.wholesale.become_partner')}
            </button>
            <button className="w-full rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10 sm:w-auto">
                {t('homepage.wholesale.request_price')}
            </button>
            </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h3 className="text-xl font-bold text-slate-900 sm:text-2xl">{t('homepage.wholesale.why_title')}</h3>
            <div className="mt-6 space-y-5">
            {[
                t('homepage.wholesale.points.tiered_pricing'),
                t('homepage.wholesale.points.moq_support'),
                t('homepage.wholesale.points.delivery_slots'),
                t('homepage.wholesale.points.invoice_flow'),
            ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-700">
                    <ChevronRight className="h-4 w-4" />
                </div>
                <p className="text-sm leading-7 text-slate-600">{item}</p>
                </div>
            ))}
            </div>
        </div>
        </div>
    </section>
  )
}

export default Wholesale