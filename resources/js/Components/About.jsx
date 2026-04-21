import { Link } from '@inertiajs/react';
import React from 'react'
import { useTranslation } from 'react-i18next'

function AboutSection({about}) {
    const {t, i18n} = useTranslation();
    const lang = i18n.language;
  return (
    <div className='mx-auto my-28 sm:px-6 lg:px-8 max-w-7xl 2xl:max-w-screen-2xl' dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <div className="grid gap-16 md:grid-cols-2">
            <div className='mx-4 lg:mx-8 lg:h-[520px]'>
                <img src={`/${about.image}`} className='shadow-2xl rounded-xl object-cover h-full w-full' alt="" />
            </div>
            <div className='relative p-8 my-auto'>
                <p className='home-section-title text-left lang-ar:text-right'>{t('about.title')}</p>
                <p className='home-section-description text-justify' dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                    {lang === 'en' ? JSON.parse(about.short_description)?.en : lang==='fr' ? JSON.parse(about.short_description)?.fr : JSON.parse(about.short_description)?.ar}
                </p>
                <div className="mt-8">
                    <Link 
                        href="/about" 
                        className={`${i18n.language === 'ar' ? 'font-adobe text-xl' : 'font-nanum'} font-medium bg-brown-100 hover:bg-brown-300 text-brown-900 px-4 py-1 rounded-full inline-block`}
                    >
                        {t('about.learn-more')}
                    </Link>
                </div>
            </div>
        </div>
    </div>
  )
}

export default AboutSection