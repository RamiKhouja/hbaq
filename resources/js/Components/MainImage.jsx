import React from 'react'
import { useTranslation } from 'react-i18next';

export default function MainImage() {
    const { t, i18n } = useTranslation();
    const lang = localStorage.getItem('lang');
  return (
    <>
    <div className='large-display w-full h-80 lg:h-[37rem] bg-cover relative' style={{ backgroundImage: 'url(/pictures/global/image-14.jpg)' }}>
        <div className='absolute top-20 left-16 lg:top-[172px] lg:left-[156px]'>
             <div className={`text-center ${lang==='ar' ? 'font-amiri' : 'font-trajan-pro'} uppercase font-normal text-primary mb-8`}>
                 <p className="text-lg lg:text-2xl lg:leading-10">{t('mainImage.discover')}</p>
                 <p className="text-xl lg:text-[40px] lg:leading-10">{t('mainImage.perfect')}</p>
                 <p className="text-primary font-bold text-3xl lg:text-[70px] lg:leading-normal lg:-mt-3">{t('mainImage.fragrance')}</p>
                 <p className="text-xs lg:text-base lg:-mt-4 max-w-[280px] lg:max-w-xl">{t('mainImage.slogan')}</p>
             </div>
             <div className={`flex justify-center space-x-3 ${lang==='ar' ? 'font-amiri' : 'font-trajan-pro'}`} dir="ltr">
                 <button className="primary-btn lg:w-36">{t('mainImage.buy')}</button>
                 <button className="secondary-btn text-primary lg:w-36">{t('mainImage.view')}</button>
             </div>
         </div>
    </div>
    
    <div className='phone-display w-full bg-gray-light3'>
      <div className='text-center pt-9 pb-16'>
            <div className='text-center font-trajan-pro uppercase font-normal text-primary mb-4'>
                <p className="text-base">{t('mainImage.discover')}</p>
                <p className="text-2xl">{t('mainImage.perfect')}</p>
                <p className="text-primary font-bold text-4xl">{t('mainImage.fragrance')}</p>
                <p className="text-xs">{t('mainImage.slogan')}</p>
            </div>
            <div className="flex justify-center space-x-3">
                <button className="primary-btn lg:w-36">{t('mainImage.buy')}</button>
                <button className="secondary-btn text-primary lg:w-36">{t('mainImage.view')}</button>
            </div>
        </div>
        <div className='w-screen h-[420px] bg-cover bg-gray-light3' style={{ backgroundImage: 'url(/pictures/global/image-27.png)' }}></div>
    </div>
    </>
  )
}
