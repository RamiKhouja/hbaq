import React, { useState } from 'react'
import SectionTitle from './SectionTitle';
import { LeafyGreen, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import FeedbackModal from '@/Components/FeedbackModal';
import 'swiper/css';
import 'swiper/css/pagination';

function Testimonials({ testimonials = [] }) {

    const { t } = useTranslation();
    const [open, setOpen] = useState(false);

    const approvedTestimonials = testimonials.filter((testimonial) => testimonial.is_approved);
    const items = approvedTestimonials;

  return (
    <section className="mx-auto max-w-7xl xl:max-w-screen-2xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <SectionTitle
            eyebrow={t('homepage.testimonials.eyebrow')}
            title={t('homepage.testimonials.title')}
            description={t('homepage.testimonials.description')}
          />
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="group inline-flex w-fit items-center gap-2 rounded-full border border-lime-200 bg-gradient-to-r from-emerald-600 via-lime-600 to-emerald-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-lime-200/70 transition hover:-translate-y-0.5 hover:from-emerald-500 hover:to-lime-500 hover:shadow-md focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-lime-500"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-lime-50 transition group-hover:bg-white/30">
              <LeafyGreen className="h-4 w-4" />
            </span>
            {t('homepage.testimonials.add_button')}
          </button>
      </div>
          <Swiper
            className="testimonials-swiper"
            modules={[Pagination]}
            pagination={{ clickable: true }}
            slidesPerView={1.25}
            spaceBetween={24}
            breakpoints={{
              1024: { slidesPerView: 2, spaceBetween: 24 },
            }}
          >
            {items.map((item) => (
              <SwiperSlide key={item.id ?? item.name}>
              <div className="my-8 h-full rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="mb-4 flex items-center gap-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < (item.rating ?? 5) ? 'fill-current' : 'fill-transparent'}`}
                    />
                  ))}
                </div>
                <p className="text-base leading-8 text-slate-600">“{item.message}”</p>
                <div className="mt-6">
                  <h4 className="font-semibold text-slate-900">{item.name}</h4>
                  {(item.profession || item.role) && <p className="text-sm text-slate-500">{item.profession || item.role}</p>}
                </div>
              </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <FeedbackModal open={open} setOpen={setOpen} />
    </section>
  )
}

export default Testimonials
