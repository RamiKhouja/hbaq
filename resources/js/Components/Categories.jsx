import { Link } from "@inertiajs/react";
import { useTranslation } from "react-i18next"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination'
import { useState, useEffect } from "react";

const options = {
  margin: 24,
  responsiveClass: true,
  loop: true,
  nav: false,
  dots: true,
  autoplay: false,
  smartSpeed: 1000,
  responsive: {
      0: {
          items: 1.5,
      },
      400: {
          items: 2,
      },
      600: {
          items: 2.5,
      },
      700: {
          items: 3,
      },
      1000: {
          items: 4,

      },
      1200: {
        items: 5
      }
  },
};

export default function Categories({categories}) {
  const {t, i18n} = useTranslation();
  const [forceRerender, setForceRerender] = useState(false);
  useEffect(()=>{
      setForceRerender((prev) => !prev);
  },[i18n.language]);

    return (
      <div>
        <div className={`mb-8 mt-8 lg:my-16 xl:mx-auto xl:max-w-7xl 2xl:max-w-screen-2xl xl:px-8`}>
          <p className='home-section-title text-center'>
            {t('category.title')}
          </p>
          <div className="text-center mx-auto mb-16 max-w-xl" dir={i18n.language==='ar'?'rtl':'ltr'}>
            <p className="home-section-description">
              {t('category.subtitle')}
            </p>
          </div>
  
          <div className="mt-8">
            <Swiper
              dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
              key={forceRerender}
              modules={[Pagination]}
              loop={true}
              spaceBetween={24}
              pagination={{ clickable: true }}
              slidesPerView={1.5}
              breakpoints={{
                0: { slidesPerView: 1.5 },
                400: { slidesPerView: 2 },
                600: { slidesPerView: 2.5 },
                700: { slidesPerView: 3 },
                1000: { slidesPerView: 4 },
                1200: { slidesPerView: 5 },
              }}
            >
              {categories.map((category) => (
                <SwiperSlide key={category.id}>
                  <Link
                    href={'/menu/' + category.url}
                    className="relative flex h-80 w-60 flex-col overflow-hidden rounded-lg p-6 hover:opacity-75 xl:w-auto"
                  >
                    <span aria-hidden="true" className="absolute inset-0">
                      <div className="h-56 w-56 rounded-3xl border-2 border-brown-100 p-1">
                        <img
                          src={category.image}
                          alt=""
                          className="h-full w-full rounded-2xl object-cover object-center"
                        />
                      </div>

                      <div className="mt-6 text-center">
                        <p
                          className={`${
                            i18n.language === 'ar'
                              ? 'font-hudhud text-2xl lg:text-3xl font-normal'
                              : 'font-nanum text-2xl font-semibold'
                          } text-primary`}
                        >
                          {i18n.language === 'ar'
                            ? category.name.ar
                            : i18n.language === 'en'
                            ? category.name.en
                            : category.name.fr}
                        </p>
                      </div>
                    </span>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          
        </div>
      </div>
    )
  }
  