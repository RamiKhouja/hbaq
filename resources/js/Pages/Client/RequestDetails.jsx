import ClientLayout from '@/Layouts/ClientLayout';
import React from 'react'
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircleIcon } from '@heroicons/react/20/solid'
import { XCircleIcon } from '@heroicons/react/24/solid';

function RequestDetails({request}) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const params = new URLSearchParams(window.location.search);
  const success = params.get('success');

  useEffect(() => {
    if (success) {
      setIsAlertVisible(true);
      const timeoutId = setTimeout(() => {
        setIsAlertVisible(false);
      }, 3000);
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [success]);

  const renderStatus = (status) => {
    switch (status) {
      case 'pending':
        return <CheckCircleIcon className="h-5 w-5 text-orange-500" aria-hidden="true" />
      case 'payed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" aria-hidden="true" />
      case 'canceled':
        return <XCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
      case 'closed':
        return <CheckCircleIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
      default:
        return <CheckCircleIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
    }
  }

  const renderDescription = (description) => {
    let desc = i18n.language == "en" ? description?.en : i18n.language == "ar" ? description?.ar : description?.fr;
    return desc?.split(' ').slice(0, 20).join(' ') + (desc?.length > 20 ? '...' : '');
  }

  return (
    <ClientLayout>
      {success && isAlertVisible &&
        <div className="bg-green-100 rounded-lg text-green-800 px-4 py-3 shadow my-3" role="alert" dir={i18n.language=='ar' ? ('rtl') : ('ltr')}>
          <div className="flex items-center">
            <div className="py-1"><svg className="fill-current h-6 w-6 text-green-800 mx-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
            <div>
              <p className="text-sm">{t('request.request-created-success')}</p>
            </div>
          </div>
        </div>
      }
      <main className="py-16" dir={lang=='ar'?'rtl':'ltr'}>
        <div className="mx-auto max-w-7xl sm:px-2 lg:px-8">
          <div className="mx-auto max-w-2xl px-4 lg:max-w-4xl lg:px-0">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{t('request.request-details')}</h1>
            <p className="mt-2 text-sm text-gray-500">
            {t('request.check-request')}
            </p>
          </div>
        </div>

        <section aria-labelledby="recent-heading" className="mt-16">
          <div className="mx-auto max-w-7xl sm:px-2 lg:px-8">
            <div className="mx-auto max-w-2xl space-y-8 sm:px-4 lg:max-w-4xl lg:px-0">
              
                <div
                  key={request.id}
                  className="border-b border-t border-gray-200 bg-white shadow-sm sm:rounded-lg sm:border"
                >
                  <div className="flex items-center border-b border-gray-200 p-4">
                    <dl className="flex justify-between w-full">
                      <div className='flex gap-16'>
                        <div>
                          <dt className="font-medium text-gray-900">{t('request.request-number')}</dt>
                          <dd className="mt-1 text-gray-500">#{request.id.toString().padStart(5, '0')}</dd>
                          <div className="flex items-center mt-4">
                            {renderStatus(request.status)}
                            <p className={`${lang=='ar'?'mr-2':'ml-2'} text-sm font-medium text-gray-500`}>
                              {t('request.'+request.status)}
                            </p>
                          </div>
                        </div>
                        <div className="hidden sm:block">
                          <dt className="font-medium text-gray-900">{t('request.date-placed')}</dt>
                          <dd className="mt-1 text-gray-500">
                            {request.created_at.substring(0,10)}
                          </dd>
                        </div>
                        <div className="hidden sm:block">
                          <dt className="font-medium text-gray-900">{t('request.nb_persons')}</dt>
                          <dd className="mt-1 text-gray-500">
                            {request.nb_persons}
                          </dd>
                        </div>
                      </div>
                      {/* <div className={`px-2 ${i18n.language==='ar' ? 'text-left' : 'text-right'}`}>
                        <dt className="font-medium text-gray-900">{t('request.total-amount')}</dt>
                        <dd className="mt-2 lg:text-lg font-semibold text-gray-900">{request.total} {t('request.dt')}</dd>
                      </div> */}
                    </dl>
                  </div>

                  {/* Products */}
                  <h4 className="sr-only">Items</h4>
                  <ul role="list" className="divide-y divide-gray-200">
                    {request.services?.map((service) => (
                      <li key={service.id} className="p-4 sm:p-6">
                        <div className="flex items-center sm:items-start">
                          <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200">
                            <img
                              src={'/'+service.image}
                              alt={service.name.en}
                              className="h-full w-full object-cover object-center"
                            />
                          </div>
                          <div className={`${lang=='ar'?'mr-6':'ml-6'} flex-1 text-sm`}>
                            <div className="font-medium text-gray-900 sm:grid sm:grid-cols-3">
                              <h5 className='lg:text-lg col-span-2'>{i18n.language == "en" ? service.name.en : i18n.language == "ar" ? service.name.ar : service.name.fr}</h5>
                              {/* <p className={`mt-2 sm:mt-0 lg:text-lg ${i18n.language==='ar' ? 'text-left' : 'text-right'}`}>{service.price} {t('request.dt')}</p> */}
                            </div>
                            <p className="hidden text-gray-500 sm:mt-2 sm:block lg:max-w-lg">{renderDescription(service.description)}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                    
                  </ul>
                </div>
            </div>
          </div>
        </section>
      </main>
    </ClientLayout>
  )
}

export default RequestDetails