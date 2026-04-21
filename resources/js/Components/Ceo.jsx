import React from 'react'
import { useTranslation } from 'react-i18next'
import ServiceModal from './ServiceModal';
import { useState } from 'react';

function AboutCeo({user, ceo}) {
    const {t, i18n} = useTranslation();
    const [modalOpen, setModalOpen] = useState(false);
  return (
    <div className='my-12'>
        <div className="grid gap-16 md:grid-cols-2" dir={i18n.language==='ar' ? 'rtl' : 'ltr'}>
            <div className=''>
                {/* <img src="/pictures/global/ceo.png" className='shadow-2xl rounded-xl' alt="" /> */}
                <img src={`/${ceo.image}`} className='shadow-2xl rounded-xl' alt="" />
            </div>
            <div className='relative p-8'>
                <img src="/pictures/global/naksha-mix.png" className='w-96 opacity-20 absolute bottom-0 -left-8 -z-10' alt="" />
                <p className="text-3xl lg:text-4xl text-brown-800 font-semibold leading-relaxed">
                    {i18n.language === 'en' ? JSON.parse(ceo.title)?.en : i18n.language === 'fr' ? JSON.parse(ceo.title)?.fr : JSON.parse(ceo.title)?.ar }
                </p>
                {/* {i18n.language === 'en'
                ? (<p className="text-3xl lg:text-4xl text-brown-800 font-medium leading-relaxed">Our Restoration <span className='bg-primary px-2 py-0.5'>Expert</span></p>)
                : i18n.language === 'fr'
                    ? (<p className="text-3xl lg:text-4xl text-brown-800 font-medium leading-relaxed">Notre <span className='bg-primary px-2 py-0.5'>Expert</span> en Restauration</p>)
                    : (<p className="text-3xl lg:text-4xl text-brown-800 font-medium leading-relaxed"><span className='bg-primary px-2 py-0.5'>خبيرنا</span> في مجال الأطعمة</p>)
                } */}
                
                <p className="text-xl lg:text-2xl text-primary font-medium mt-6 mx-1">
                    {i18n.language === 'en' ? JSON.parse(ceo.name)?.en : i18n.language === 'fr' ? JSON.parse(ceo.name)?.fr : JSON.parse(ceo.name)?.ar }
                </p>
                <p className="text-lg font-normal text-gray-700 mt-8 text-justify">
                    {i18n.language === 'en' ? JSON.parse(ceo.paragraph_1)?.en : i18n.language === 'fr' ? JSON.parse(ceo.paragraph_1)?.fr : JSON.parse(ceo.paragraph_1)?.ar }
                </p>
                <p className="text-lg font-normal text-gray-700 mt-6 text-justify">
                    {i18n.language === 'en' ? JSON.parse(ceo.paragraph_2)?.en : i18n.language === 'fr' ? JSON.parse(ceo.paragraph_2)?.fr : JSON.parse(ceo.paragraph_2)?.ar }
                </p>
                <div className="mt-16 flex flex-row-reverse">
                    <button 
                        onClick={() => setModalOpen(true)}
                        className='rounded-lg bg-primary text-brown-800 font-semibold px-3 py-1.5 shadow-lg hover:bg-primary hover:text-white'
                    >{t('ceo.book-consultation')}</button>
                </div>
            </div>
        </div>
        <ServiceModal open={modalOpen} setOpen={setModalOpen} user={user} />
    </div>
  )
}

export default AboutCeo