import React from 'react'
import { router, Head, Link } from '@inertiajs/react'
import AdminLayout from '@/Layouts/AdminLayout';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

export default function Index({attributes, auth}) {
  const {t, i18n} = useTranslation();
  const lang = i18n.language;
  function deleteAttribute( id ) {
    router.delete(`/admin/catalog/attributes/${id}`);
  }
  return (
    <AdminLayout user={auth?.user}>
      <Head title="Attributes" />
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">{t('admin.attribute.attributes')}</h1>
            <p className="mt-2 text-sm text-gray-700">
            {t('admin.attribute.list-of-att')}
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <Link
              type="button"
              href='/admin/catalog/attributes/create'
              className="block rounded-md bg-primary px-3 py-1.5 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-brown-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brown-600"
            >
              {t('admin.attribute.add-attribute')}
            </Link>
          </div>
        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className={lang=='ar'?'text-right':'text-left'}>
                  <tr>
                    <th scope="col" className="px-3 py-3.5 text-sm font-semibold text-gray-900">
                    {t('admin.attribute.name-en')}
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-sm font-semibold text-gray-900">
                    {t('admin.attribute.name-ar')}
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-sm font-semibold text-gray-900">
                    {t('admin.attribute.filtrable')}
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-sm font-semibold text-gray-900">
                    {t('admin.attribute.options')}
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {attributes && attributes.map( (item) => (
                    <tr key={item.id}>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">{item.name.en}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">{item.name.ar}</td>
                      {/* <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">
                        {item.type === 'string' ? ('Text') : (item.type==='number' ? ('Number') : ('Yes/No'))}
                      </td> */}
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">{item.filtrable ? t('yes') : t('no')}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">
                        {item.options && item.options.map((option) => (
                            <p className='mb-2' key={option.id}>- {lang=='ar' ? option.value.ar : option.value.en}</p>
                        ))}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0 flex gap-x-2 items-center">
                        <Link href={`/admin/catalog/attributes/edit/${item.id}`} className="text-gray-800 hover:text-brown-900">
                          <PencilSquareIcon className='w-5 h-5'/>
                        </Link>
                        <button type="button" onClick={() => deleteAttribute(item.id)} className="text-red-800 hover:text-brown-900">
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
    </AdminLayout>
  )
}
