import { Link, usePage } from '@inertiajs/react';
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

const getProductImage = (product) => {
  const image = product?.main_image;

  if (!image || image.startsWith('/') || /^https?:\/\//.test(image)) {
    return image;
  }

  return `/${image}`;
};

function TopBanner({ featured = [] }) {
  const { t, i18n } = useTranslation();
  const swiperRef = useRef(null);
  const titleTimerRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isTitleVisible, setIsTitleVisible] = useState(true);
  const { auth } = usePage().props;
  const isAuthenticated = Boolean(auth?.user);
  const products = Array.isArray(featured) ? featured.slice(0, 10) : [];
  const activeProduct = products[activeSlide] ?? products[0];
  const language = i18n.resolvedLanguage?.split('-')[0] ?? i18n.language;
  const productName = (product) => (
    product?.name?.[language]
    ?? product?.name?.en
    ?? Object.values(product?.name ?? {})[0]
    ?? ''
  );

  useEffect(() => () => clearTimeout(titleTimerRef.current), []);

  const handleSlideChange = (swiper) => {
    clearTimeout(titleTimerRef.current);
    setIsTitleVisible(false);
    const nextSlide = swiper.realIndex;

    titleTimerRef.current = setTimeout(() => {
      setActiveSlide(nextSlide);
      setIsTitleVisible(true);
    }, 1000);
  };

  return (
    <section className="relative overflow-hidden bg-[#10190f] text-white">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=1800&q=85"
          alt=""
          className="h-full w-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#10190f]/90 via-[#182615]/75 to-[#10190f]/45" />
        {/* <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#f7f9f2] to-transparent" /> */}
      </div>

      <div className="relative mx-auto grid min-h-[640px] max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 md:py-20 lg:grid-cols-[0.92fr_1.08fr] lg:gap-12 lg:px-8 xl:max-w-screen-2xl">
        <div className="max-w-2xl">
          {/* <span className="inline-flex border-l-4 border-secondary bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-tertiary shadow-sm backdrop-blur sm:text-xs">
            {t('homepage.top.badge')}
          </span> */}
          <p className="mt-8 text-sm font-extrabold uppercase tracking-[0.28em] text-secondary sm:text-2xl">
            {t('homepage.top.organic')}
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl font-black uppercase leading-[0.95] text-white sm:text-6xl lg:text-7xl">
            {t('homepage.top.title')}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-white/80 sm:text-lg">
            {t('homepage.top.description')}
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link href={'/shop'} className="w-full bg-secondary rounded-2xl px-8 py-4 text-center text-sm font-extrabold uppercase tracking-[0.18em] text-[#1d1708] shadow-xl shadow-black/20 transition hover:bg-tertiary sm:w-auto">
              {t('homepage.top.shop_now')}
            </Link>
            {!isAuthenticated && (
              <Link href={'/register'} className="w-full rounded-2xl border border-white/45 bg-white/10 px-8 py-4 text-center text-sm font-extrabold uppercase tracking-[0.18em] text-white backdrop-blur transition hover:bg-white hover:text-[#172313] sm:w-auto">
                {t('homepage.top.explore_wholesale')}
              </Link>
            )}
          </div>
        </div>

        {products.length > 0 && <div className="relative min-w-0 px-12 sm:px-20 lg:min-h-[520px]">
          <h2 className={`mb-6 text-center text-3xl font-normal uppercase leading-tight text-white transition-all duration-700 ease-in-out sm:text-4xl ${
            isTitleVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
          }`}>
            {productName(activeProduct)}
          </h2>

          <div className="relative mx-auto w-full lg:w-3/4">
            <Swiper
              modules={[Autoplay, EffectFade, Pagination]}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              onSlideChange={handleSlideChange}
              slidesPerView={1}
              spaceBetween={0}
              effect="fade"
              fadeEffect={{ crossFade: true }}
              speed={2000}
              loop={products.length > 1}
              autoplay={{
                delay: 4500,
                disableOnInteraction: false,
              }}
              pagination={{ clickable: true }}
              className="top-banner-products-swiper aspect-square h-auto w-full drop-shadow-[0_18px_20px_rgba(0,0,0,0.45)] sm:aspect-[4/3]"
            >
              {products.map((product) => {
                const title = productName(product);

                return (
                  <SwiperSlide key={product.id ?? product.url}>
                    <Link href={`/product/${product.url}`} className="group relative block h-full overflow-hidden">
                      <img
                        src={getProductImage(product)}
                        alt={title}
                        className="absolute inset-0 h-full w-full object-contain transition duration-700 group-hover:scale-105"
                      />
                    </Link>
                  </SwiperSlide>
                );
              })}
            </Swiper>

            <Link
              href={`/product/${activeProduct.url}`}
              className="group absolute -right-8 top-5 z-30 flex h-20 w-20 items-center justify-center rounded-full bg-orange-500 text-center text-xs font-extrabold uppercase leading-[1.25] tracking-[0.14em] text-white shadow-lg transition hover:scale-105 hover:bg-orange-400 sm:-right-10 sm:h-24 sm:w-24 sm:text-sm lang-ar:text-lg"
            >
              <span className="absolute right-[calc(100%-14px)] top-1/2 h-0 w-0 -translate-y-1/2 border-y-[25px] border-r-[27px] border-y-transparent border-r-orange-500 transition group-hover:border-r-orange-400 sm:right-[calc(100%-17px)] sm:border-y-[30px] sm:border-r-[32px]" />
              <span className="relative z-10">
                {t('homepage.top.shop')}
              </span>
            </Link>

            {products.length > 1 && <button
              type="button"
              onClick={() => swiperRef.current?.slidePrev()}
              aria-label="Previous product"
              className="absolute right-full top-1/2 z-20 mr-1 flex h-9 w-9 -translate-y-1/2 items-center justify-center text-white transition hover:scale-110 hover:text-secondary sm:mr-2 sm:h-16 sm:w-16"
            >
              <ChevronLeft className="h-7 w-7 sm:h-11 sm:w-11" strokeWidth={2.5} />
            </button>}
            {products.length > 1 && <button
              type="button"
              onClick={() => swiperRef.current?.slideNext()}
              aria-label="Next product"
              className="absolute left-full top-1/2 z-20 ml-1 flex h-9 w-9 -translate-y-1/2 items-center justify-center text-white transition hover:scale-110 hover:text-secondary sm:ml-2 sm:h-16 sm:w-16"
            >
              <ChevronRight className="h-7 w-7 sm:h-11 sm:w-11" strokeWidth={2.5} />
            </button>}
          </div>

        </div>}
      </div>
    </section>
  )
}

export default TopBanner
