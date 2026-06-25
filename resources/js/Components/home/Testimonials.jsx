import React from 'react'
import SectionTitle from './SectionTitle';
import { Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

function Testimonials() {

    const { t } = useTranslation();

    const testimonials = [
      {
        name: 'Amina Foods Market',
        role: t('homepage.testimonials.role_wholesale'),
        quote: t('homepage.testimonials.quote_1'),
      },
      {
        name: 'Green Basket',
        role: t('homepage.testimonials.role_retail'),
        quote: t('homepage.testimonials.quote_2'),
      },
    ];
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <SectionTitle
            eyebrow={t('homepage.testimonials.eyebrow')}
            title={t('homepage.testimonials.title')}
            description={t('homepage.testimonials.description')}
          />
          <div className="grid gap-6 md:grid-cols-2">
            {testimonials.map((item) => (
              <div key={item.name} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="mb-4 flex items-center gap-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <p className="text-base leading-8 text-slate-600">“{item.quote}”</p>
                <div className="mt-6">
                  <h4 className="font-semibold text-slate-900">{item.name}</h4>
                  <p className="text-sm text-slate-500">{item.role}</p>
                </div>
              </div>
            ))}
          </div>
    </section>
  )
}

export default Testimonials