import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import Product from './Product';
import { Link } from '@inertiajs/react';

function OwlProducts({products, type}) {
    const { t, i18n } = useTranslation();
    const lang = localStorage.getItem('lang');
    const [forceRerender, setForceRerender] = useState(false);
    useEffect(()=>{
        setForceRerender((prev) => !prev);
    },[lang]);

    const options = {
        margin: 24,
        responsiveClass: true,
        loop: false,
        nav: false,
        dots: true,
        autoplay: false,
        smartSpeed: 3000,
        autoplayHoverPause: true,
        responsive: {
            0: {
                items: 1.25,
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

  return (
    <div className={`mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:max-w-7xl 2xl:max-w-screen-2xl lg:px-8`}>
        {type && type!=='related' && (
          <div className='text-center mb-8'>
            <div className="text-center">
                <p className="home-section-title">
                {type==='featured' ? t('owl-products.featured') : t('owl-products.new-arrivals') }
                </p>
            </div>
            <div className="text-center mx-auto mb-8 max-w-md" dir={i18n.language==='ar'?'rtl':'ltr'}>
                <p className="home-section-description">
                {t('owl-products.subtitle')}
                </p>
            </div>
            <Link 
                href="/shop" 
                className={`${i18n.language === 'ar' ? 'font-adobe text-xl' : 'font-nanum'} mx-auto font-medium bg-brown-100 hover:bg-brown-300 text-brown-900 px-4 py-1 rounded-full mb-6 inline-block`}
            >
                {t('owl-products.shop-collection')}
            </Link>
          </div>
        )}
        <div className="">
        <Swiper
            key={forceRerender}
            modules={[Pagination]}
            dir={ i18n.language === 'ar' ? 'rtl' : 'ltr' }
            loop={false}
            spaceBetween={24}
            pagination={{ clickable: true }}
            slidesPerView={1.25}
            breakpoints={{
                0: { slidesPerView: 1.25 },
                400: { slidesPerView: 2 },
                600: { slidesPerView: 2.5 },
                700: { slidesPerView: 3 },
                1000: { slidesPerView: 4 },
                1200: { slidesPerView: 5 },
            }}
            >
            {products.map((product) => (
                <SwiperSlide key={product.id}>
                <div className="h-full mb-4">
                    <Product product={product} />
                </div>
                </SwiperSlide>
            ))}
        </Swiper>
        </div>
    </div>
  )
}

export default OwlProducts