import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import ServiceModal from './ServiceModal';

function Banner({user}) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
  return (
    <>
    <div className="bg-primary w-full absolute left-0 mt-16 h-fit">
        <div className="flex justify-between mx-auto max-w-6xl py-7 items-center relative px-8">
        <img src="/pictures/global/hafedh.png" alt="Fragrant" className="absolute w-24 -mt-16"/>
        <div className='w-36'></div>
        <div className="text-center hidden sm:block">
            <p className="sm:text-sm md:text-2xl font-medium text-primary uppercase mb-4">{t('banner.title')}</p>
            <p className="sm:text-lg xl:text-xl text-white leading-normal">
            {t('banner.desc')}
            </p>
        </div>
        <div>
          <button 
            className="secondary-btn bg-primary text-primary px-4 py-2"
            onClick={()=>setOpen(true)}
          >
            <p className='font-semibold text-sm lg:text-lg'>{t('banner.buy')}</p>
          </button>
        </div>
        </div>
        <div className="text-center text-sm sm:hidden pb-7">
            <p className="text-primary uppercase">{t('banner.title')}</p>
            <p className="text-xl text-white leading-normal">
            {t('banner.desc')}
            </p>
        </div>
    </div>
    <ServiceModal open={open} setOpen={setOpen} user={user} />
    </>
  )
}

export default Banner