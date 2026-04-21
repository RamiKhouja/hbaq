import React from 'react'
import { router, Head, Link } from '@inertiajs/react'
import AdminLayout from '@/Layouts/AdminLayout';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

export default function Index({inventories, auth}) {
  const {t, i18n} = useTranslation();
  const lang = i18n.language;

  function deleteInventory( id ) {
    router.delete(`/admin/catalog/inventories/${id}`);
  }
  function truncateString(inputString, maxWords) {
    const words = inputString.split(' ');
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(' ') + '...';
    } else {
      return inputString;
    }
  }
  return (
    <AdminLayout user={auth?.user}>
      <Head title="Inventory" />
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">{t('admin.inventory.inventory')}</h1>
            <p className="mt-2 text-sm text-gray-700">
            {t('admin.inventory.list-of-stock')}
            </p>
          </div>
        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className={i18n.language=='ar'?'text-right':'text-left'}>
                  <tr>
                    <th scope="col" className="px-3 py-3.5 text-sm font-semibold text-gray-900">
                    {t('admin.inventory.product')}
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-sm font-semibold text-gray-900">
                    {t('admin.inventory.status')}
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-sm font-semibold text-gray-900">
                    {t('admin.inventory.qty')}
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-sm font-semibold text-gray-900">
                    {t('admin.inventory.unit')}
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-sm font-semibold text-gray-900">
                    {t('admin.inventory.qty-set')}
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-sm font-semibold text-gray-900">
                    {t('admin.inventory.warehouse')}
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {inventories && inventories.data.map( (item) => (
                    <tr key={item.id}>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">
                        <Link href={`/admin/catalog/products/show/${item.product.id}`} title={lang=='ar' ? item.product.name.ar : item.product.name.en} 
                          className='font-medium text-brown-700 hover:text-brown-900'>
                          {truncateString(lang=='ar' ? item.product.name.ar : item.product.name.en, 5)}
                        </Link>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">{item.in_stock ? t('admin.inventory.in-stock') : t('admin.inventory.out-stock')}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">{item.qty}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">{t(item.unit)}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">{item.unit == 'set' && item.qty_set}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">{item.warehouse}</td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0 flex gap-x-2 items-center">
                        <Link href={`/admin/catalog/inventories/edit/${item.id}`} className="text-gray-800 hover:text-brown-900">
                          <PencilSquareIcon className='w-5 h-5'/>
                        </Link>
                        <button type="button" onClick={() => deleteInventory(item.id)} className="text-red-800 hover:text-brown-900">
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
        <div className={`mt-8 flex justify-end`} dir={i18n.language=='ar'?'rtl':'ltr'}>
          {inventories.links.map((link, index) => (
            <Link
              key={index}
              className={`mr-2 px-3 py-1 rounded-full ring-1 ring-primary hover:bg-brown-800 hover:text-white ${link.active ? 'bg-primary text-white' : 'bg-white text-primary'}`}
              href={link.url}
            >
              {link.label == "&laquo; Previous" ? t('shop.prev') : (link.label=="Next &raquo;" ? t('shop.next') : link.label)}
            </Link>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}