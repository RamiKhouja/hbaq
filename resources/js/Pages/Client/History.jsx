import { XMarkIcon } from '@heroicons/react/24/outline'
import { CheckCircleIcon } from '@heroicons/react/20/solid'
import ClientLayout from '@/Layouts/ClientLayout'
import { useTranslation } from 'react-i18next'
import { usePage } from '@inertiajs/react'
import { XCircleIcon } from '@heroicons/react/24/solid'

const History = ({orders}) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { flash } = usePage().props

  const renderStatus = (status) => {
    switch (status) {
      case 'pending':
        return <CheckCircleIcon className="h-5 w-5 text-orange-500" aria-hidden="true" />
      case 'paid':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" aria-hidden="true" />
      case 'canceled':
        return <XCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
      case 'closed':
        return <CheckCircleIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
      default:
        return <CheckCircleIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
    }
  }

  return (
    <ClientLayout>
      {flash.success && isAlertVisible &&
        <div className="bg-green-100 rounded-lg text-green-800 px-4 py-3 shadow mb-3" role="alert" dir={i18n.language=='ar' ? ('rtl') : ('ltr')}>
          <div className="flex">
            <div className="py-1"><svg className="fill-current h-6 w-6 text-green-800 mx-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
            <div>
              <p className="text-sm">{flash.success}</p>
            </div>
          </div>
        </div>
      }
      <main className="py-16" dir={lang=='ar'?'rtl':'ltr'}>
        <div className="mx-auto max-w-7xl sm:px-2 lg:px-8">
          <div className="mx-auto max-w-2xl px-4 lg:max-w-4xl lg:px-0">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{t('order.order-history')}</h1>
            <p className="mt-2 text-sm text-gray-500">
              {t('order.check-order')}
            </p>
          </div>
        </div>

        <section aria-labelledby="recent-heading" className="mt-16">
          <h2 id="recent-heading" className="sr-only">
            Recent orders
          </h2>
          <div className="mx-auto max-w-7xl sm:px-2 lg:px-8">
            <div className="mx-auto max-w-2xl space-y-8 sm:px-4 lg:max-w-4xl lg:px-0">
              {orders && orders.map((order) => (
                <div
                  key={order.id}
                  className="border-b border-t border-gray-200 bg-white shadow-sm sm:rounded-lg sm:border"
                >
                  <div className="flex items-center border-b border-gray-200 p-4">
                    <dl className="flex justify-between w-full">
                      <div className='flex gap-16'>
                        <div>
                          <dt className="font-medium text-gray-900">{t('order.order-number')}</dt>
                          <dd className="mt-1 text-gray-500">#{order.id.toString().padStart(5, '0')}</dd>
                          <div className="flex items-center mt-4">
                            {renderStatus(order.status)}
                            <p className={`${lang=='ar'?'mr-2':'ml-2'} text-sm font-medium text-gray-500`}>
                              {t('order.'+order.status)}
                            </p>
                          </div>
                        </div>
                        <div className="hidden sm:block">
                          <dt className="font-medium text-gray-900">{t('order.date-placed')}</dt>
                          <dd className="mt-1 text-gray-500">
                            {order.created_at.substring(0,10)}
                          </dd>
                        </div>
                      </div>
                      <div className={`px-2 ${i18n.language==='ar' ? 'text-left' : 'text-right'}`}>
                        <dt className="font-medium text-gray-900">{t('order.total-amount')}</dt>
                        <dd className="mt-2 lg:text-lg font-semibold text-gray-900">{order.total} {t('order.dt')}</dd>
                      </div>
                    </dl>
                  </div>

                  {/* Products */}
                  <h4 className="sr-only">Items</h4>
                  <ul role="list" className="divide-y divide-gray-200">
                    {JSON.parse(order.purchases)?.map((purchase) => purchase.product && (
                      <li key={purchase.product.id} className="p-4 sm:p-6">
                        <div className="flex items-center sm:items-start">
                          <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200">
                            <img
                              src={'/'+purchase.product.main_image}
                              alt={purchase.product.name.en}
                              className="h-full w-full object-cover object-center"
                            />
                          </div>
                          <div className={`${lang=='ar'?'mr-6':'ml-6'} flex-1 text-sm`}>
                            <div className="font-medium text-gray-900 sm:grid sm:grid-cols-4">
                              <h5 className='lg:text-lg col-span-2'>{i18n.language == "en" ? purchase.product.name.en : i18n.language == "ar" ? purchase.product.name.ar : purchase.product.name.fr}</h5>
                              <div className="flex items-center gap-x-1 text-gray-600">
                                <p>{purchase.quantity}</p>
                                <XMarkIcon className='w-4 h-4'/>
                                <p>{purchase.product.price} {t('order.dt')}</p>
                              </div>
                              <p className={`mt-2 sm:mt-0 lg:text-lg ${i18n.language==='ar' ? 'text-left' : 'text-right'}`}>{purchase.quantity * purchase.product.price} {t('order.dt')}</p>
                            </div>
                            <p className="hidden text-gray-500 sm:mt-2 sm:block">{i18n.language == "en" ? purchase.product.description?.en : i18n.language == "ar" ? purchase.product.description?.ar : purchase.product.description?.fr}</p>
                          </div>
                        </div>

                        {/* <div className="mt-6 sm:flex sm:justify-end">
                          
                          <div className="mt-6 flex items-center gap-x-4 divide-x divide-gray-200 border-t border-gray-200 pt-4 text-sm font-medium sm:ml-4 sm:mt-0 sm:border-none sm:pt-0">
                            <div className="flex flex-1 justify-center">
                              <a
                                href={'/product/'+purchase.product.url}
                                className="whitespace-nowrap text-brown-600 hover:text-brown-500"
                              >
                                {t('order.view-product')}
                              </a>
                            </div>
                          </div>
                        </div> */}
                      </li>
                    ))}
                    {order.delivery && order.delivery>0 && (
                    <li className="p-4 sm:p-6">
                      <div className="flex justify-between text-lg text-gray-900 font-medium">
                        <p>{t('order.delivery')}</p>
                        <p>{order.delivery} {t('order.dt')}</p>
                      </div>
                      <div className="mt-4 text-gray-700">
                        <p>{t('order.cutlery')}: {order.cutlery ? t('order.yes') : ('order.no')}</p>
                        <p className='mt-2'>{order.message}</p>
                      </div>
                    </li>
                    )}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </ClientLayout>
  )
}
export default History;