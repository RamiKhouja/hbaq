import { router, Head, Link, usePage } from '@inertiajs/react'
import AdminLayout from '@/Layouts/AdminLayout';
import { useLayoutEffect, useRef, useState, useEffect } from 'react'
import { EyeIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Index({services, auth}) {

  function deleteService( id ) {
    router.delete(`/admin/services/${id}`);
  }

  const {t, i18n} = useTranslation();

  function truncateString(inputString, maxWords) {
    const words = inputString.split(' ');
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(' ') + '...';
    } else {
      return inputString;
    }
  }

  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const { flash } = usePage().props
  useEffect(() => {
    if (flash.success) {
      setIsAlertVisible(true);
      const timeoutId = setTimeout(() => {
        setIsAlertVisible(false);
      }, 3000);
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [flash.success]);

  return (
    <AdminLayout user={auth?.user}>
      <Head title="Services" />
      {flash.success && isAlertVisible &&
      <div className="bg-green-100 rounded-lg text-green-800 px-4 py-3 shadow mb-4" role="alert">
        <div className="flex">
          <div className="py-1"><svg className="fill-current h-6 w-6 text-green-800 mx-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
          <div>
            <p className="font-bold">Success!</p>
            <p className="text-sm">{flash.success}</p>
          </div>
        </div>
      </div>}
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">{t('admin.service.list.services')}</h1>
          <p className="mt-2 text-sm text-gray-500">
            {t('admin.service.list.list-of-services')}
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:flex gap-x-4">
          
          <Link
            type="button"
            href='/admin/services/create'
            className="block rounded-md bg-primary px-3 py-1.5 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-brown-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brown-600"
          >
            {t('admin.service.list.add-service')}
          </Link>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="relative">
              <table className="min-w-full table-fixed divide-y divide-gray-300">
                <thead className={i18n.language=='ar'?'text-right':'text-left'}>
                  <tr>
                    <th scope="col" className="px-3 py-3.5 text-sm font-semibold text-gray-900">
                      {t('admin.service.list.image')}
                    </th>
                    <th scope="col" className="py-3.5 pr-3 text-sm font-semibold text-gray-900">
                      {t('admin.service.list.name')}
                    </th> 
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-3">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {services?.map((service) => (
                    <tr key={service.id}>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">
                        {service.image && (
                          <img src={'/'+service.image} alt={service.name.en} className='h-10'/>
                        )}
                      </td>
                      <td
                        className={classNames(
                          'whitespace-nowrap py-4 pr-3 text-sm font-medium text-gray-900'
                        )}
                      >
                        {i18n.language=='ar'
                        ? (<p title={service.name.ar}>{truncateString(service.name.ar,4)}</p>)
                        : (<p title={service.name.en}>{truncateString(service.name.en,4)}</p>)
                        }
                      </td>
                      
                      <td className="py-4 px-4 text-right text-sm font-medium flex gap-x-2 items-center">
                        <Link title={t('admin.service.list.view-service')} href={`/admin/services/show/${service.id}`} className="text-gray-800 hover:text-brown-900">
                          <EyeIcon className='w-5 h-5'/>
                        </Link>
                        <Link title={t('admin.service.list.edit-service')} href={`/admin/services/edit/${service.id}`} className="text-gray-800 hover:text-brown-900">
                          <PencilSquareIcon className='w-5 h-5'/>
                        </Link>
                        <button title={t('admin.service.list.delete-service')} type="button" onClick={() => deleteService(service.id)} className="text-red-800 hover:text-brown-900">
                          <TrashIcon className='w-5 h-5'/>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    </AdminLayout>
  )
}



