import React from 'react'
import { useTranslation } from 'react-i18next';
import SectionTitle from './SectionTitle';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { Link } from '@inertiajs/react';

function Categories({ categories }) {
  const { t, i18n } = useTranslation();
  return (
    <section id="categories" className="mx-auto max-w-7xl xl:max-w-screen-2xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
      <SectionTitle
        eyebrow={t('homepage.categories.eyebrow')}
        title={t('homepage.categories.title')}
        description={t('homepage.categories.description')}
      />

      <Swiper
        className="categories-swiper"
        modules={[Pagination]}
        pagination={{ clickable: true }}
        slidesPerView={1.25}
        spaceBetween={24}
        breakpoints={{
          640: { slidesPerView: 2.25, spaceBetween: 24 },
          1024: { slidesPerView: 3, spaceBetween: 24 },
          1280: { slidesPerView: 4, spaceBetween: 24 },
        }}
      >
            {categories.map((category) => (
          <SwiperSlide key={category.id ?? category.name.en}>
            <div className="group overflow-hidden rounded-[2rem] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl my-8">
              <div className="overflow-hidden">
                <Link href={'/menu/' + category.url}>
                  <img
                    src={category.image}
                    alt={category.name?.[i18n.language] ?? category.name?.en}
                    className="h-56 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-64"
                  />
                </Link>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-slate-900">{category.name?.[i18n.language] ?? category.name?.en}</h3>
                <Link href={'/menu/' + category.url} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-green-700">
                  {t('homepage.categories.browse')} {i18n.language==='ar' ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}

export default Categories