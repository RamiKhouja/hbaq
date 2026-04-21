import parse from 'html-react-parser';
import ClientLayout from '@/Layouts/ClientLayout'
import { useTranslation } from 'react-i18next'
import ServiceModal from '@/Components/ServiceModal';
import { useState } from 'react';

export default function ServiceDetails({auth, categories, service, eventCategories}) {
  const {t, i18n} = useTranslation();
  const lang = i18n.language;
  const [modalOpen, setModalOpen] = useState(false);


  return (
    <ClientLayout user={auth?.user} categories={categories} eventCategories={eventCategories}>
    <div className="bg-white" dir={i18n.language=='ar' ? 'rtl' : 'ltr'}>
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
          <div className="flex justify-center rounded-lg">
              <img src={'/'+service?.image} alt="" className="h-80 lg:h-[500px] object-cover object-center rounded-lg" />
            </div>

          {/* Service info */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            
            <h1 className="text-3xl lg:text-5xl font-bold tracking-tight text-brown-800 mb-4">
              {lang=='ar' ? service?.name.ar : lang=='en' ? service?.name.en : service?.name.fr}
            </h1>
            {/* <p className="text-3xl lg:text-5xl font-bold text-brown-800">
              {parseFloat(service.price)} <span className='text-xl lg:text-3xl'>{t('product.tnd')}</span>
            </p> */}
            
            <div className="mt-6">
              <h2 className="text-lg text-brown-800 font-semibold">{t('service.what-expect')}</h2>
              <div className="w-full mt-3">
                <p className="text-gray-700">
                  {lang=='ar' 
                    ? parse(service?.description?.ar) 
                    : lang=='en' 
                      ? parse(service?.description?.en) 
                      : parse(service?.description?.fr)
                  }
                </p>
              </div>
            </div>
            <button
                type="button"
                dir={lang==='ar'?'rtl':'ltr'}
                onClick={()=>setModalOpen(true)}
                className="mt-12 inline-flex justify-center w-full md:w-fit items-center gap-x-4 rounded-full bg-primary px-8 py-2 text-sm font-semibold text-brown-800 shadow-sm hover:bg-primary hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
                {t('service.book-service')}
            </button>
            
          </div>
        </div>
      </div>
    </div>
    <ServiceModal open={modalOpen} setOpen={setModalOpen} user={auth?.user} id={service.id} />
    </ClientLayout>
  )
}
