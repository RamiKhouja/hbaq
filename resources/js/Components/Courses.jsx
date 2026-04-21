import { PlayCircleIcon } from '@heroicons/react/24/solid';
import { Link } from '@inertiajs/react'
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

function Courses() {
    const {t, i18n} = useTranslation();
    const lang = i18n.language;
    const [play, setPlay] = useState(false);
  return (
    <div className='my-24 mx-auto lg:max-w-7xl 2xl:max-w-screen-2xl'>
        <div className="grid gap-16 md:grid-cols-2" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <div className='relative my-auto'>
                <p className='home-section-title text-center'>{t('courses.our-courses')}</p>
                <p className='home-section-description text-center' dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                    {t('courses.description')}
                </p>
                <div className="mt-8 mx-auto text-center">
                    <Link 
                        href="/about" 
                        className={`${i18n.language === 'ar' ? 'font-adobe text-xl' : 'font-nanum'} font-medium bg-brown-100 hover:bg-brown-300 text-brown-900 px-4 py-1 rounded-full inline-block`}
                    >
                        {t('about.learn-more')}
                    </Link>
                </div>
            </div>
            {!play ? (
            <div className="relative cursor-pointer group" onClick={() => setPlay(true)}>
                <img src="/pictures/global/chef.jpg" className='shadow-2xl rounded-xl' alt="" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <PlayCircleIcon className='h-20 w-20 text-white shadow-inner group-hover:text-brown-900' />
                </div>
            </div>
            ) : (
            <div className="relative aspect-w-16 aspect-h-9">
                <video
                    src='/pictures/global/tutorial.mp4'
                    controls
                    autoPlay
                    className="w-full h-full rounded-xl shadow-2xl"
                />
            </div>
            )}
        </div>
    </div>
  )
}

export default Courses